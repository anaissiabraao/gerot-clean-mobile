"""Tool externo (HTTP) com whitelist para o agente.

Objetivo:
- Permitir consulta a fontes externas SOMENTE quando não há contexto interno suficiente.
- Manter determinismo e segurança: sem URL livre do usuário/LLM.

Primeiro caso suportado:
- Clima/temperatura atual via Open-Meteo (gratuito, sem API key)
  - Geocoding: https://geocoding-api.open-meteo.com/v1/search
  - Forecast:  https://api.open-meteo.com/v1/forecast
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any, Optional

import httpx

from .config import settings


@dataclass(frozen=True)
class ExternalResult:
    provider: str
    query_name: str
    data: dict[str, Any]


def _timeout() -> float:
    return float(max(3, min(int(settings.agent_external_timeout_s or 15), 60)))


def _extract_city_state_br(question: str) -> Optional[tuple[str, str | None]]:
    """Extrai 'Cidade/UF' (muito simples)."""
    q = (question or "").strip()
    m = re.search(r"temperatura.*?de\s+([A-Za-zÀ-ÿ\s]+?)(?:/([A-Za-z]{2}))?(?:\b|\?)", q, flags=re.IGNORECASE)
    if not m:
        m = re.search(r"clima.*?de\s+([A-Za-zÀ-ÿ\s]+?)(?:/([A-Za-z]{2}))?(?:\b|\?)", q, flags=re.IGNORECASE)
    if not m:
        # fallback: "tempo em Cidade/UF"
        m = re.search(r"tempo\s+em\s+([A-Za-zÀ-ÿ\s]+?)(?:/([A-Za-z]{2}))?(?:\b|\?)", q, flags=re.IGNORECASE)
    if not m:
        return None
    city = (m.group(1) or "").strip()
    uf = (m.group(2) or "").strip().upper() if m.group(2) else None
    city = re.sub(r"\\s+", " ", city)
    if not city:
        return None
    return city, uf


def _strip_accents(text: str) -> str:
    try:
        import unicodedata

        return "".join(ch for ch in unicodedata.normalize("NFD", text) if unicodedata.category(ch) != "Mn")
    except Exception:
        return text


def choose_external_template(question: str) -> Optional[str]:
    q = (question or "").lower()
    if any(k in q for k in ("temperatura", "clima", "previs", "tempo em")):
        if _extract_city_state_br(question):
            return "weather.open_meteo.current_temp"
    # Livros: resumo/sinopse via Open Library (gratuito, sem API key)
    if any(k in q for k in ("o que diz o livro", "resumo do livro", "sobre o livro", "o que é", "quem é")):
        return "books.openlibrary.summary"
    return None


async def _open_meteo_geocode(city: str, uf: str | None) -> Optional[dict[str, Any]]:
    params = {"name": city, "count": 5, "language": "pt", "format": "json"}
    async with httpx.AsyncClient(timeout=_timeout()) as client:
        r = await client.get("https://geocoding-api.open-meteo.com/v1/search", params=params)
        r.raise_for_status()
        data = r.json() or {}
    results = list(data.get("results") or [])
    if results:
        # Preferir Brasil (Open-Meteo não fornece UF como "SC"; admin1_code costuma ser numérico).
        br = [x for x in results if str(x.get("country_code") or "").upper() == "BR"]
        return (br[0] if br else results[0])

    # Fallback: retry sem acentos (ex.: Itajaí -> Itajai)
    city2 = _strip_accents(city or "").strip()
    if city2 and city2 != city:
        params2 = {"name": city2, "count": 5, "language": "pt", "format": "json"}
        async with httpx.AsyncClient(timeout=_timeout()) as client:
            r2 = await client.get("https://geocoding-api.open-meteo.com/v1/search", params=params2)
            r2.raise_for_status()
            data2 = r2.json() or {}
        results2 = list(data2.get("results") or [])
        if results2:
            br2 = [x for x in results2 if str(x.get("country_code") or "").upper() == "BR"]
            return (br2[0] if br2 else results2[0])

    return None


def _extract_wiki_title(question: str) -> Optional[str]:
    q = (question or "").strip()
    # padrões comuns
    m = re.search(r"(?:o que diz o livro|resumo do livro|sobre o livro)\s+(.+)$", q, flags=re.IGNORECASE)
    if m:
        t = (m.group(1) or "").strip().strip("?.!\"'")
        return t or None
    m = re.search(r"(?:o que é|quem é)\s+(.+)$", q, flags=re.IGNORECASE)
    if m:
        t = (m.group(1) or "").strip().strip("?.!\"'")
        return t or None
    return None


async def _openlibrary_book_summary(title: str) -> dict[str, Any]:
    """Busca sinopse/descrição de livro via Open Library (sem API key)."""
    async with httpx.AsyncClient(timeout=_timeout(), headers={"User-Agent": "GeRot-Agent/1.0"}) as client:
        r = await client.get("https://openlibrary.org/search.json", params={"title": title, "limit": 5})
        r.raise_for_status()
        data = r.json() or {}
        docs = list(data.get("docs") or [])
        if not docs:
            return {"not_found": True, "title": title}
        doc0 = docs[0] or {}
        work_key = doc0.get("key")  # ex: "/works/OL123W"
        if not work_key:
            return {"not_found": True, "title": title}
        r2 = await client.get(f"https://openlibrary.org{work_key}.json")
        r2.raise_for_status()
        work = r2.json() or {}
    desc = work.get("description")
    if isinstance(desc, dict):
        desc = desc.get("value")
    if not isinstance(desc, str):
        desc = ""
    return {
        "work_key": work_key,
        "title": work.get("title") or doc0.get("title") or title,
        "description": desc.strip(),
        "authors": doc0.get("author_name") or [],
        "first_publish_year": doc0.get("first_publish_year"),
        "url": f"https://openlibrary.org{work_key}",
    }


async def _open_meteo_current_temp(lat: float, lon: float) -> dict[str, Any]:
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m",
        "timezone": "America/Sao_Paulo",
    }
    async with httpx.AsyncClient(timeout=_timeout()) as client:
        r = await client.get("https://api.open-meteo.com/v1/forecast", params=params)
        r.raise_for_status()
        return r.json() or {}


async def run_external_template(template_name: str, question: str) -> ExternalResult:
    if not settings.agent_external_enabled:
        raise RuntimeError("External tool desabilitada (RAG_AGENT_EXTERNAL_ENABLED=false).")

    if template_name not in {"weather.open_meteo.current_temp", "books.openlibrary.summary"}:
        raise RuntimeError(f"Template externo não permitido: {template_name}")

    if template_name == "books.openlibrary.summary":
        title = _extract_wiki_title(question)
        if not title:
            raise RuntimeError("Não consegui extrair o título do livro.")
        data = await _openlibrary_book_summary(title)
        if data.get("not_found"):
            raise RuntimeError("Livro não encontrado na Open Library.")
        return ExternalResult(
            provider="openlibrary",
            query_name=template_name,
            data={
                "title": data.get("title") or title,
                "description": data.get("description"),
                "authors": data.get("authors") or [],
                "first_publish_year": data.get("first_publish_year"),
                "url": data.get("url"),
                "source": {"api": "https://openlibrary.org/search.json + /works/{id}.json"},
            },
        )

    parsed = _extract_city_state_br(question)
    if not parsed:
        raise RuntimeError("Não consegui extrair cidade/UF da pergunta.")
    city, uf = parsed

    geo = await _open_meteo_geocode(city, uf)
    if not geo:
        raise RuntimeError("Cidade não encontrada no geocoding (Open-Meteo).")

    lat = float(geo["latitude"])
    lon = float(geo["longitude"])
    wx = await _open_meteo_current_temp(lat, lon)

    return ExternalResult(
        provider="open-meteo",
        query_name=template_name,
        data={
            "place": {
                "name": geo.get("name"),
                "admin1": geo.get("admin1"),
                "country": geo.get("country"),
                "latitude": lat,
                "longitude": lon,
            },
            "current": (wx.get("current") or {}),
            "current_units": (wx.get("current_units") or {}),
            "source": {
                "geocoding": "https://geocoding-api.open-meteo.com/v1/search",
                "forecast": "https://api.open-meteo.com/v1/forecast",
            },
        },
    )


