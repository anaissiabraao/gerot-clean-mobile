import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class AlertaMotoristas:
    """Stub de serviço de alertas de motoristas para compatibilidade com servico_completo.py."""

    def __init__(self, teams_webhook_url=None, intervalo_segundos=60):
        self.teams_webhook_url = teams_webhook_url
        self.intervalo_segundos = intervalo_segundos
        self._ultimo_id_log = self._carregar_ultimo_id()

    def _estado_path(self):
        base = Path(__file__).resolve().parent
        return base / '.alerta_motoristas_last_id'

    def _carregar_ultimo_id(self) -> int:
        try:
            p = self._estado_path()
            if p.exists():
                return int(p.read_text().strip() or 0)
        except Exception:
            logger.debug("Falha ao ler ultimo id, usando 0")
        return 0

    def _salvar_ultimo_id(self, ultimo_id: int):
        try:
            p = self._estado_path()
            p.write_text(str(int(ultimo_id)))
        except Exception as e:
            logger.warning("Não foi possível salvar último id: %s", e)

    # Métodos esperados pelo servico_completo
    def buscar_novas_ocorrencias(self):
        """Retorna lista de ocorrências; stub retorna lista vazia."""
        return []

    def salvar_alerta_supabase(self, ocorrencia, alerta_enviado=True):
        """Stub de persistência; retorna True para compatibilidade."""
        return True
