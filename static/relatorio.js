// FUNÇÕES DO RELATÓRIO DE RESULTADOS
// ============================================================

// Variáveis globais para refresh automático
let relatorioAutoRefreshInterval = null;
let relatorioAutoRefreshCountdown = null;
let relatorioAutoRefreshEnabled = false;
let relatorioRefreshInFlight = false;
let relatorioPollingInterval = null;
let relatorioLastRefreshAt = null;
let relatorioLastRowCount = null;
let relatorioLayoutCache = null;
let relatorioLayoutLoading = null;
let relatorioLayoutSaveTimer = null;
let relatorioMetaAlertTimer = null;
let relatorioSoundEnabled = true;
let relatorioTickerDetails = [];
let relatorioFreteMetaChartData = null;
let relatorioFreteGaugeState = { mode: 'mes', dayISO: null };
let relatorioFreteGaugeContext = null;
let relatorioIsProcessingChunks = false;
let relatorioIndicadoresLastKey = null;

function _toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(_toNumber(value));
}

function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(_toNumber(value));
}

function relatorioDateToISO(value) {
    if (!value) return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
    const raw = String(value).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
    const br = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (br) return `${br[3]}-${br[2]}-${br[1]}`;
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
    return null;
}

function getRelatorioBusinessDaysInMonth(year, monthIdx) {
    const days = [];
    const d = new Date(year, monthIdx, 1);
    while (d.getMonth() === monthIdx) {
        const dow = d.getDay();
        if (dow !== 0 && dow !== 6) {
            days.push(d.toISOString().slice(0, 10));
        }
        d.setDate(d.getDate() + 1);
    }
    return days;
}

function getRelatorioDailyReferenceDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dataFimStr = document.getElementById('relatorio-data-fim')?.value;
    if (dataFimStr) {
        const base = new Date(`${dataFimStr}T00:00:00`);
        if (!Number.isNaN(base.getTime())) {
            base.setHours(0, 0, 0, 0);
            if (base < today) return base;
        }
    }
    return today;
}

function getRelatorioDailyFreteInfo(registros, metaValor) {
    const refDate = getRelatorioDailyReferenceDate();
    const refISO = refDate ? refDate.toISOString().slice(0, 10) : null;
    const businessDays = getRelatorioBusinessDaysInMonth(refDate.getFullYear(), refDate.getMonth());
    const businessDaysSet = new Set(businessDays);
    const metaDia = metaValor > 0 && businessDays.length ? (metaValor / businessDays.length) : 0;
    let totalDia = 0;
    if (refISO) {
        (registros || []).forEach((reg) => {
            const iso = relatorioDateToISO(reg.data);
            if (iso === refISO) totalDia += (reg.frete || 0);
        });
    }
    const pctDiaRaw = metaDia > 0 ? (totalDia / metaDia) * 100 : 0;
    const pctDia = Number.isFinite(pctDiaRaw) ? pctDiaRaw : 0;
    return {
        refDate,
        refISO,
        metaDia,
        totalDia,
        pctDia,
        businessDays,
        businessDaysSet
    };
}

function getRelatorioProgressStyles(pctValue) {
    const pctSafe = Number.isFinite(pctValue) ? pctValue : 0;
    const pct = Math.max(0, Math.min(100, pctSafe));
    const color = pct >= 100 ? '#22c55e' : pct >= 80 ? '#f59e0b' : '#ef4444';
    const gradient = `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`;
    return { pct, color, gradient };
}

function renderRelatorioProgressBar(pctValue) {
    const { pct, color, gradient } = getRelatorioProgressStyles(pctValue);
    return `
        <div class="h-3 rounded-full bg-muted overflow-hidden">
            <div class="h-full"
                 style="width:${pct}%; background:${gradient}; box-shadow: 0 0 8px ${color}55;"></div>
        </div>
    `;
}

function getRelatorioFreteDailyTotals(registros) {
    const dailyTotals = {};
    (registros || []).forEach((reg) => {
        const iso = relatorioDateToISO(reg.data);
        if (!iso) return;
        dailyTotals[iso] = (dailyTotals[iso] || 0) + (reg.frete || 0);
    });
    return dailyTotals;
}

function getRelatorioFreteGaugeValue(state, context) {
    if (!context) return { value: 0, valueText: '—', metaText: '—' };
    const { metaValor, metaDia, totalFrete, dailyTotals, availableDays } = context;
    const mode = state?.mode || 'mes';
    const dayISO = state?.dayISO || availableDays[0] || null;
    const dayTotal = dayISO ? (dailyTotals[dayISO] || 0) : 0;
    if (mode === 'dia') {
        const pctRaw = metaDia > 0 ? (dayTotal / metaDia) * 100 : 0;
        const valueText = metaDia > 0 ? `${pctRaw.toFixed(1)}%` : '—';
        const metaText = `Dia ${dayISO ? formatDateBR(dayISO) : '—'}: ${formatCurrency(dayTotal)} · Meta/dia: ${metaDia > 0 ? formatCurrency(metaDia) : '—'}`;
        return { value: pctRaw, valueText, metaText };
    }
    const pctRaw = metaValor > 0 ? (totalFrete / metaValor) * 100 : 0;
    const valueText = metaValor > 0 ? `${pctRaw.toFixed(1)}%` : '—';
    const metaText = `Meta: ${metaValor > 0 ? formatCurrency(metaValor) : '—'} · Atual: ${formatCurrency(totalFrete)}`;
    return { value: pctRaw, valueText, metaText };
}

function buildRelatorioFreteGaugeDetailHtml(state, context) {
    if (!context) return '';
    const { metaValor, metaDia, totalFrete, dailyTotals, availableDays } = context;
    const mode = state?.mode || 'mes';
    const dayISO = state?.dayISO || availableDays[0] || null;
    const dayTotal = dayISO ? (dailyTotals[dayISO] || 0) : 0;
    const monthlyPct = metaValor > 0 ? (totalFrete / metaValor) * 100 : 0;
    const dailyPct = metaDia > 0 ? (dayTotal / metaDia) * 100 : 0;

    const dayLabel = dayISO ? formatDateBR(dayISO) : '—';
    const dayPctText = metaDia > 0 ? `${dailyPct.toFixed(1)}%` : '—';
    const monthPctText = metaValor > 0 ? `${monthlyPct.toFixed(1)}%` : '—';

    const dayOptions = availableDays.map((iso) => {
        const selected = iso === dayISO ? 'selected' : '';
        return `<option value="${iso}" ${selected}>${formatDateBR(iso)}</option>`;
    }).join('');

    return `
        <div class="space-y-2">
            <div class="flex items-center gap-2">
                <button type="button" data-frete-gauge-mode="dia"
                        class="px-2 py-1 rounded-md text-[11px] font-medium border border-input ${mode === 'dia' ? 'bg-background text-foreground' : 'bg-muted/40 text-muted-foreground'}">
                    Dia
                </button>
                <button type="button" data-frete-gauge-mode="mes"
                        class="px-2 py-1 rounded-md text-[11px] font-medium border border-input ${mode === 'mes' ? 'bg-background text-foreground' : 'bg-muted/40 text-muted-foreground'}">
                    Mês
                </button>
                <select data-frete-gauge-day class="ml-auto rounded-md border border-input bg-background px-2 py-1 text-[11px]">
                    ${dayOptions || '<option value="">Sem datas</option>'}
                </select>
            </div>
            <div class="bg-muted/40 rounded-md px-2 py-1 text-[11px] text-muted-foreground">
                ${mode === 'dia'
        ? `Dia ${dayLabel}: <strong>${formatCurrency(dayTotal)}</strong> · Meta/dia: ${metaDia > 0 ? formatCurrency(metaDia) : '—'} · ${dayPctText}`
        : `Mês: <strong>${formatCurrency(totalFrete)}</strong> · Meta: ${metaValor > 0 ? formatCurrency(metaValor) : '—'} · ${monthPctText}`}
            </div>
            ${mode === 'dia' ? renderRelatorioProgressBar(dailyPct) : renderRelatorioProgressBar(monthlyPct)}
        </div>
    `;
}

function bindRelatorioFreteGaugeDetailControls() {
    const detailEl = document.querySelector('[data-gauge-detail-for="chart-gauge-frete"]');
    if (!detailEl || !relatorioFreteGaugeContext) return;
    detailEl.querySelectorAll('[data-frete-gauge-mode]').forEach((btn) => {
        btn.addEventListener('click', () => {
            relatorioFreteGaugeState.mode = btn.getAttribute('data-frete-gauge-mode') || 'mes';
            refreshRelatorioFreteGauge();
        });
    });
    const select = detailEl.querySelector('[data-frete-gauge-day]');
    if (select) {
        select.addEventListener('change', () => {
            relatorioFreteGaugeState.dayISO = select.value || null;
            relatorioFreteGaugeState.mode = 'dia';
            refreshRelatorioFreteGauge();
        });
    }
}

function updateRelatorioFreteGaugeDetailUI() {
    const detailEl = document.querySelector('[data-gauge-detail-for="chart-gauge-frete"]');
    if (!detailEl || !relatorioFreteGaugeContext) return;
    detailEl.innerHTML = buildRelatorioFreteGaugeDetailHtml(relatorioFreteGaugeState, relatorioFreteGaugeContext);
    bindRelatorioFreteGaugeDetailControls();
    bindRelatorioFreteGaugeToggle();
}

function refreshRelatorioFreteGauge() {
    if (!relatorioFreteGaugeContext) return;
    const detailHtml = buildRelatorioFreteGaugeDetailHtml(relatorioFreteGaugeState, relatorioFreteGaugeContext);
    const { value, valueText, metaText } = getRelatorioFreteGaugeValue(relatorioFreteGaugeState, relatorioFreteGaugeContext);
    renderGaugeChart('gauge_frete', 'chart-gauge-frete', value, 'Frete (Meta)', {
        valueText,
        metaText,
        detailHtml
    });
    updateRelatorioFreteGaugeDetailUI();
}

function bindRelatorioFreteGaugeToggle() {
    const detailEl = document.querySelector('[data-gauge-detail-for="chart-gauge-frete"]');
    const toggleBtn = document.getElementById('relatorio-frete-gauge-toggle');
    if (!detailEl || !toggleBtn || toggleBtn.dataset.bound) return;
    toggleBtn.dataset.bound = 'true';
    const updateLabel = () => {
        toggleBtn.textContent = detailEl.classList.contains('hidden') ? 'Ver detalhes' : 'Ocultar detalhes';
    };
    updateLabel();
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        detailEl.classList.toggle('hidden');
        updateLabel();
    });
}

function setRelatorioSoundEnabled(enabled) {
    relatorioSoundEnabled = Boolean(enabled);
    const soundEl = document.getElementById('relatorio-sound-enabled');
    if (soundEl) soundEl.checked = relatorioSoundEnabled;
}

function getRelatorioScopeElement() {
    return document.querySelector('[data-relatorio-scope]') || document.getElementById('content-relatorio');
}

function getRelatorioMetaSettings() {
    const container = document.getElementById('content-relatorio') || document.querySelector('[data-relatorio-scope]');
    const metaValor = _toNumber(container?.dataset?.metaValor);
    const metaPercentual = _toNumber(container?.dataset?.metaPercentual);
    return { metaValor, metaPercentual };
}

async function loadRelatorioLayout() {
    if (relatorioLayoutLoading) return relatorioLayoutLoading;
    relatorioLayoutLoading = fetch('/api/relatorio/layout')
        .then((res) => res.json())
        .then((data) => {
            relatorioLayoutCache = data.layout || {};
            return relatorioLayoutCache;
        })
        .catch(() => ({}));
    return relatorioLayoutLoading;
}

function buildRelatorioLayout(scope) {
    const soundEl = document.getElementById('relatorio-sound-enabled');
    const soundEnabled = soundEl ? soundEl.checked : relatorioSoundEnabled;
    relatorioSoundEnabled = soundEnabled;
    const layout = { containers: {}, settings: { soundEnabled } };
    const containers = scope.querySelectorAll('[data-relatorio-container]');
    containers.forEach((container) => {
        const key = container.getAttribute('data-relatorio-container');
        if (!key) return;
        const items = Array.from(container.querySelectorAll(':scope > [data-relatorio-component]'));
        if (!items.length) return;
        layout.containers[key] = items.map((el) => el.getAttribute('data-relatorio-component'));
    });
    return layout;
}

function applyRelatorioLayout(scope, layout) {
    if (!layout || !layout.containers) return;
    Object.entries(layout.containers).forEach(([key, order]) => {
        const container = scope.querySelector(`[data-relatorio-container="${key}"]`);
        if (!container || !Array.isArray(order)) return;
        order.forEach((componentKey) => {
            const el = container.querySelector(`:scope > [data-relatorio-component="${componentKey}"]`);
            if (el) container.appendChild(el);
        });
    });
    if (layout.settings && typeof layout.settings.soundEnabled === 'boolean') {
        setRelatorioSoundEnabled(layout.settings.soundEnabled);
    }
}

function saveRelatorioLayoutDebounced(scope) {
    if (relatorioLayoutSaveTimer) clearTimeout(relatorioLayoutSaveTimer);
    relatorioLayoutSaveTimer = setTimeout(() => {
        saveRelatorioLayoutNow(scope, true);
    }, 400);
}

function setRelatorioLayoutStatus(message, isError = false) {
    const el = document.getElementById('relatorio-layout-status');
    if (!el) return;
    el.textContent = message || '';
    el.classList.toggle('text-red-600', Boolean(isError));
    el.classList.toggle('text-muted-foreground', !isError);
}

function saveRelatorioLayoutNow(scope, silent = false) {
    if (!scope) return;
    const layout = buildRelatorioLayout(scope);
    relatorioLayoutCache = layout;
    if (!silent) setRelatorioLayoutStatus('Salvando...');
    fetch('/api/relatorio/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout })
    })
        .then(() => {
            if (!silent) {
                setRelatorioLayoutStatus('Layout salvo.');
                setTimeout(() => setRelatorioLayoutStatus(''), 2000);
            }
        })
        .catch(() => {
            if (!silent) setRelatorioLayoutStatus('Erro ao salvar layout.', true);
        });
}

function initRelatorioDragAndDrop(scope) {
    const containers = scope.querySelectorAll('[data-relatorio-container]');
    let dragged = null;

    containers.forEach((container) => {
        const items = Array.from(container.querySelectorAll(':scope > [data-relatorio-component]'));
        if (items.length < 2) return;
        items.forEach((item) => {
            item.setAttribute('draggable', 'true');
            item.classList.add('relatorio-draggable');
            item.style.cursor = 'move';
            item.addEventListener('dragstart', (e) => {
                dragged = item;
                item.classList.add('opacity-60');
                e.dataTransfer.effectAllowed = 'move';
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('opacity-60');
                dragged = null;
            });
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!dragged) return;
            const after = getRelatorioDragAfterElement(container, e.clientY);
            if (after == null) {
                container.appendChild(dragged);
            } else {
                container.insertBefore(dragged, after);
            }
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!dragged) return;
            saveRelatorioLayoutDebounced(scope);
        });
    });
}

function getRelatorioDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(':scope > [data-relatorio-component]:not(.opacity-60)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        }
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function setRelatorioState(state, message = '') {
    const loading = document.getElementById('relatorio-loading');
    const results = document.getElementById('relatorio-results');
    const empty = document.getElementById('relatorio-empty');
    const errorBox = document.getElementById('relatorio-error');
    const errorMsg = document.getElementById('relatorio-error-message');
    const detail = document.getElementById('relatorio-detail');

    [loading, results, empty, errorBox].forEach(el => el && el.classList.add('hidden'));
    if (detail) detail.classList.add('hidden');

    switch (state) {
        case 'loading':
            if (loading) {
                loading.classList.remove('hidden');
                const textEl = loading.querySelector('p');
                if (textEl && message) textEl.textContent = message;
            }
            break;
        case 'results':
            results?.classList.remove('hidden');
            break;
        case 'error':
            if (errorBox) {
                if (errorMsg) errorMsg.textContent = message || 'Erro ao carregar relatório.';
                errorBox.classList.remove('hidden');
            }
            break;
        default:
            empty?.classList.remove('hidden');
    }
}

function setRelatorioRefreshMessage(msg = '') {
    const el = document.getElementById('relatorio-refresh-message');
    if (!el) return;
    el.textContent = msg || '';
}

function updateRelatorioTicker(resumo) {
    const ticker = document.getElementById('relatorio-ticker');
    const track = document.getElementById('relatorio-ticker-track');
    if (!ticker || !track || !resumo) return;
    ticker.classList.remove('hidden');
    ticker.style.cursor = 'pointer';

    const metaValor = _toNumber(ticker.dataset.metaValor);
    const metaPercentual = _toNumber(ticker.dataset.metaPercentual);

    const buildStatus = (valor, meta, higherIsBetter = true) => {
        if (!meta || meta <= 0) return { label: 'Sem meta', color: '#94a3b8' };
        const ratio = higherIsBetter ? (valor / meta) : (meta / Math.max(valor, 1e-9));
        if (ratio >= 1) return { label: 'Verde', color: '#22c55e' };
        if (ratio >= 0.8) return { label: 'Amarelo', color: '#f59e0b' };
        return { label: 'Vermelho', color: '#ef4444' };
    };

    const statusFrete = buildStatus(resumo.totalFrete || 0, metaValor, true);
    const statusMargem = buildStatus(resumo.margemPercentual, metaPercentual, true);
    const ebtidaMetaBase = metaPercentual > 0 ? metaPercentual : 50;
    const statusEbtida = buildStatus(resumo.ebtidaPercentual, ebtidaMetaBase, true);

    relatorioTickerDetails = [
        {
            titulo: 'Frete (Bruto)',
            valor: resumo.totalFrete || 0,
            meta: metaValor,
            percentual: metaValor > 0 ? (resumo.totalFrete || 0) / metaValor * 100 : null,
            status: statusFrete
        },
        {
            titulo: 'Margem',
            valor: resumo.margemPercentual,
            meta: metaPercentual,
            percentual: metaPercentual > 0 ? resumo.margemPercentual / metaPercentual * 100 : null,
            status: statusMargem,
            isPercent: true
        },
        {
            titulo: 'EBTIDA',
            valor: resumo.totalEBTIDA,
            meta: ebtidaMetaBase,
            percentual: ebtidaMetaBase > 0 ? resumo.ebtidaPercentual / ebtidaMetaBase * 100 : null,
            status: statusEbtida,
            extra: `${resumo.ebtidaPercentual.toFixed(1)}%`
        }
    ];

    const items = [
        `<span class="inline-flex items-center gap-2">
            <span style="background:${statusFrete.color};" class="inline-block h-2 w-2 rounded-full"></span>
            Frete (Bruto): ${formatCurrency(resumo.totalFrete || 0)} (Meta: ${metaValor > 0 ? formatCurrency(metaValor) : '—'})
        </span>`,
        `<span class="inline-flex items-center gap-2">
            <span style="background:${statusMargem.color};" class="inline-block h-2 w-2 rounded-full"></span>
            Margem: ${resumo.margemPercentual.toFixed(1)}% (Meta: ${metaPercentual > 0 ? metaPercentual.toFixed(1) + '%' : '—'})
        </span>`,
        `<span class="inline-flex items-center gap-2">
            <span style="background:${statusEbtida.color};" class="inline-block h-2 w-2 rounded-full"></span>
            EBTIDA: ${formatCurrency(resumo.totalEBTIDA)} (${resumo.ebtidaPercentual.toFixed(1)}%)
        </span>`
    ];

    const content = items.join('<span class="mx-3 text-muted-foreground">•</span>');
    track.innerHTML = `${content}<span class="mx-6"></span>${content}`;

    if (!ticker.dataset.detailsBound) {
        ticker.dataset.detailsBound = 'true';
        ticker.addEventListener('click', () => {
            showRelatorioTickerDetails();
        });
    }
}

function applyRelatorioMetaCards(resumo, registros = relatorioRegistros) {
    const { metaValor, metaPercentual } = getRelatorioMetaSettings();
    const dailyInfo = getRelatorioDailyFreteInfo(registros || [], metaValor);
    const setStatus = (el, value, meta) => {
        if (!el) return;
        el.classList.remove('border-emerald-300', 'border-amber-300', 'border-red-300');
        if (!meta || meta <= 0) return;
        const ratio = value / meta;
        if (ratio >= 1) el.classList.add('border-emerald-300');
        else if (ratio >= 0.8) el.classList.add('border-amber-300');
        else el.classList.add('border-red-300');
    };
    const freteMetaBase = dailyInfo.metaDia > 0 ? dailyInfo.metaDia : metaValor;
    const freteValorBase = dailyInfo.totalDia;
    setStatus(document.querySelector('[data-meta-card="frete"]'), freteValorBase, freteMetaBase);
    setStatus(document.querySelector('[data-meta-card="margem"]'), resumo.margemPercentual || 0, metaPercentual);
    const freteTotalEl = document.getElementById('relatorio-total-frete');
    if (freteTotalEl) {
        freteTotalEl.textContent = formatCurrency(freteValorBase);
    }
    const freteMetaEl = document.getElementById('relatorio-frete-meta');
    if (freteMetaEl) {
        const pctRaw = dailyInfo.metaDia > 0 ? (dailyInfo.totalDia / dailyInfo.metaDia) * 100 : 0;
        const pctSafe = Number.isFinite(pctRaw) ? pctRaw : 0;
        const extra = dailyInfo.metaDia > 0 && pctSafe > 100 ? ` (+${(pctSafe - 100).toFixed(1)}%)` : '';
        freteMetaEl.textContent = dailyInfo.metaDia > 0
            ? `Hoje: ${formatCurrency(dailyInfo.totalDia)} · Meta/dia: ${formatCurrency(dailyInfo.metaDia)} · ${pctSafe.toFixed(1)}%${extra}`
            : 'Meta/dia: —';
    }
}

function renderRelatorioIndicadores(resumo) {
    if (!resumo) return;
    if (relatorioIsProcessingChunks) return;
    const { metaValor } = getRelatorioMetaSettings();
    const totalFrete = resumo.totalFrete || 0;
    const fretePctRaw = metaValor > 0 ? (totalFrete / metaValor) * 100 : 0;
    const fretePct = metaValor > 0 ? Math.min(100, fretePctRaw) : 0;
    const freteMetaText = metaValor > 0
        ? `Meta: ${formatCurrency(metaValor)} · Atual: ${formatCurrency(totalFrete)}`
        : `Meta não definida · Atual: ${formatCurrency(totalFrete)}`;
    const indicadoresKey = [
        metaValor,
        totalFrete,
        resumo.custosPercentual,
        resumo.impostosPercentual,
        resumo.margemPercentual,
        resumo.totalEBTIDA,
        resumo.ebtidaPercentual
    ].join('|');
    if (relatorioIndicadoresLastKey === indicadoresKey) return;
    relatorioIndicadoresLastKey = indicadoresKey;
    const dailyTotals = getRelatorioFreteDailyTotals(relatorioRegistros || []);
    const availableDays = Object.keys(dailyTotals).sort();
    const dailyInfo = getRelatorioDailyFreteInfo(relatorioRegistros || [], metaValor);
    const defaultDay = dailyInfo.refISO && dailyTotals[dailyInfo.refISO] != null
        ? dailyInfo.refISO
        : (availableDays[availableDays.length - 1] || null);
    relatorioFreteGaugeState = { mode: 'mes', dayISO: defaultDay };
    relatorioFreteGaugeContext = {
        metaValor,
        metaDia: dailyInfo.metaDia,
        totalFrete,
        dailyTotals,
        availableDays
    };
    refreshRelatorioFreteGauge();
    renderGaugeChart('gauge_custos', 'chart-velocimetro-custos', resumo.custosPercentual || 0, 'Custos (%)');
    renderGaugeChart('gauge_impostos', 'chart-velocimetro-impostos', resumo.impostosPercentual || 0, 'Impostos (%)');
    renderGaugeChart('gauge_margem_global', 'chart-velocimetro-margem-global', resumo.margemPercentual || 0, 'Margem (%)');
}

function showRelatorioTickerDetails() {
    const items = Array.isArray(relatorioTickerDetails) ? relatorioTickerDetails : [];
    const titleEl = document.getElementById('metrica-detail-title');
    const contentEl = document.getElementById('metrica-detail-content');
    const modalEl = document.getElementById('metrica-detail-modal');
    if (!titleEl || !contentEl || !modalEl) return;
    titleEl.innerHTML = '<i class="fas fa-bullseye text-primary"></i> Detalhes do Ticker';

    const rows = items.map((item) => {
        const metaText = item.meta && item.meta > 0
            ? (item.isPercent ? `${item.meta.toFixed(1)}%` : formatCurrency(item.meta))
            : '—';
        const valorText = item.isPercent
            ? `${Number(item.valor || 0).toFixed(1)}%`
            : formatCurrency(item.valor || 0);
        const pctText = Number.isFinite(item.percentual)
            ? `${Math.min(999, item.percentual).toFixed(1)}%`
            : '—';
        const statusColor = item.status?.color || '#94a3b8';
        return `
            <div class="rounded-lg border bg-muted/30 p-3 text-sm">
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                        <span class="inline-block h-2 w-2 rounded-full" style="background:${statusColor};"></span>
                        <span class="font-semibold">${escapeHtml(item.titulo)}</span>
                    </div>
                    <span class="text-xs text-muted-foreground">${escapeHtml(item.status?.label || 'Sem meta')}</span>
                </div>
                <div class="mt-2 grid gap-1 text-xs text-muted-foreground">
                    <div><strong>Atual:</strong> ${valorText}</div>
                    <div><strong>Meta:</strong> ${metaText}</div>
                    <div><strong>Atingimento:</strong> ${pctText}</div>
                    ${item.extra ? `<div><strong>Extra:</strong> ${escapeHtml(item.extra)}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');

    contentEl.innerHTML = `<div class="space-y-3">${rows || '<p class="text-sm text-muted-foreground">Sem detalhes disponíveis.</p>'}</div>`;
    modalEl.classList.remove('hidden');
}

function updateRelatorioMetaAlerts(resumo) {
    const box = document.getElementById('relatorio-meta-alerts');
    if (!box) return;
    const { metaValor } = getRelatorioMetaSettings();
    if (relatorioMetaAlertTimer) {
        clearTimeout(relatorioMetaAlertTimer);
        relatorioMetaAlertTimer = null;
    }
    if (!metaValor || metaValor <= 0) {
        box.classList.add('hidden');
        return;
    }
    const totalFrete = resumo.totalFrete || 0;
    const pct = (totalFrete / metaValor) * 100;
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysLeft = Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));

    if (totalFrete >= metaValor) {
        box.className = 'rounded-lg border bg-emerald-50 border-emerald-200 p-4 text-emerald-800 animate-pulse';
        box.innerHTML = `🎉 Parabéns! Meta de frete batida. Atual: <strong>${formatCurrency(totalFrete)}</strong> (Meta: ${formatCurrency(metaValor)}).`;
        box.classList.remove('hidden');
        relatorioMetaAlertTimer = setTimeout(() => {
            box.classList.add('hidden');
            box.classList.remove('animate-pulse');
        }, 4000);
        return;
    }

    if (daysLeft <= 10) {
        const falta = metaValor - totalFrete;
        box.className = 'rounded-lg border bg-amber-50 border-amber-200 p-4 text-amber-800 animate-pulse';
        box.innerHTML = `⚠️ Faltam ${daysLeft} dia(s) para o fim do mês. Meta: ${formatCurrency(metaValor)} · Atual: ${formatCurrency(totalFrete)} · Falta: ${formatCurrency(falta)} (${pct.toFixed(1)}% atingido).`;
        box.classList.remove('hidden');
        relatorioMetaAlertTimer = setTimeout(() => {
            box.classList.add('hidden');
            box.classList.remove('animate-pulse');
        }, 4000);
        return;
    }

    box.classList.add('hidden');
}

function initRelatorioAlertsUI() {
    const alertBar = document.getElementById('relatorio-alerts');
    const modal = document.getElementById('relatorio-alerts-modal');
    const closeBtn = document.getElementById('relatorio-alerts-close');
    if (!alertBar || !modal) return;
    const open = () => modal.classList.remove('hidden');
    const close = () => modal.classList.add('hidden');
    alertBar.addEventListener('click', open);
    alertBar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') open();
    });
    closeBtn?.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });
}

function applyRelatorioAlertsFromResumo(resumo) {
    if (!resumo) return [];
    const negatives = [];
    if ((resumo.totalResultado || 0) < 0) {
        negatives.push({ label: 'Resultado Líquido', value: resumo.totalResultado });
    }
    if ((resumo.totalPrejuizos || 0) > 0) {
        negatives.push({ label: 'Prejuízos', value: resumo.totalPrejuizos });
    }
    if ((resumo.margemPercentual || 0) < 0) {
        negatives.push({ label: 'Margem %', value: `${resumo.margemPercentual.toFixed(1)}%` });
    }
    return negatives;
}

function updateRelatorioClock() {
    const clock = document.getElementById('relatorio-refresh-clock');
    if (!clock) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    clock.innerHTML = `<i class="far fa-clock mr-1"></i>${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const globalClock = document.getElementById('relatorio-global-clock');
    if (globalClock) {
        globalClock.innerHTML = `<i class="far fa-clock mr-2"></i>${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
}

function setRelatorioRefreshSummary(text) {
    const el = document.getElementById('relatorio-refresh-summary');
    if (!el) return;
    el.textContent = text || '';
    const globalStatus = document.getElementById('relatorio-global-status');
    if (globalStatus) {
        globalStatus.querySelector('span') ? (globalStatus.querySelector('span').textContent = text || '') : (globalStatus.textContent = text || '');
    }
}

function startRefreshSpinner() {
    const icon = document.getElementById('relatorio-refresh-icon');
    if (icon) icon.classList.add('fa-spin');
    const globalIcon = document.getElementById('relatorio-global-refresh-icon');
    if (globalIcon) globalIcon.classList.add('fa-spin');
}

function stopRefreshSpinner() {
    const icon = document.getElementById('relatorio-refresh-icon');
    if (icon) icon.classList.remove('fa-spin');
    const globalIcon = document.getElementById('relatorio-global-refresh-icon');
    if (globalIcon) globalIcon.classList.remove('fa-spin');
}

async function buscarRelatorioResultados(opts = {}) {
    const background = !!opts.background;
    if (background && relatorioRefreshInFlight) {
        console.log('[Relatório] Refresh em segundo plano ignorado (já existe um em andamento).');
        return;
    }
    if (background) relatorioRefreshInFlight = true;
    const period = document.getElementById('relatorio-period')?.value || 'mes_atual';
    const dataInicio = document.getElementById('relatorio-data-inicio')?.value;
    const dataFim = document.getElementById('relatorio-data-fim')?.value;
    const database = document.getElementById('relatorio-database')?.value || 'azportoex';
    const fpTokens = [];
    if (document.getElementById('relatorio-fp-faturado')?.checked) fpTokens.push('Faturado');
    if (document.getElementById('relatorio-fp-avista')?.checked) fpTokens.push('A vista');
    const fpExcludeTokens = [];
    if (document.getElementById('relatorio-fp-excluir-cortesia')?.checked) fpExcludeTokens.push('Cortesia');

    if (period === 'custom') {
        if (!dataInicio || !dataFim) {
            alert('Por favor, selecione as datas de início e fim.');
            return;
        }
    }

    if (!database) {
        alert('Por favor, selecione a base de dados.');
        return;
    }

    const databaseLabel = (database === 'azportoex') ? 'MATRIZ (azportoex)' : 'FILIAL SP (portoexsp)';
    const periodLabel = period === 'mes_atual' ? 'mês atual' : (period === 'mes_menos1' ? 'mês -1' : (period === 'mes_menos2' ? 'mês -2' : (period === 'mes_menos3' ? 'mês -3' : 'custom')));
    if (!background) {
        setRelatorioState('loading', `Solicitando dados ao Agente Local (${databaseLabel}, ${periodLabel})...`);
    } else {
        // Refresh em segundo plano: manter resultados na tela, só sinalizar atualização
        setRelatorioRefreshMessage('Atualizando…');
    }
    startRefreshSpinner();

    try {
        const response = await fetch('/api/agent/relatorio-resultados/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                period: period,
                data_inicio: dataInicio, 
                data_fim: dataFim,
                database: database,
                forma_pagamento_tokens: fpTokens,
                forma_pagamento_exclude_tokens: fpExcludeTokens
            })
        });

        const payload = await response.json();
        if (!response.ok || !payload.success) {
            throw new Error(payload.error || 'Erro ao criar solicitação.');
        }

        // Pode ser uma única solicitação ou múltiplas (quando "ambas" for selecionado)
        const requestIds = payload.request_ids || [payload.request_id];
        if (!background) {
            setRelatorioState('loading', 'Carregando...');
        }

        // Disparar Relatório de Entregas em paralelo (carrega junto com os demais)
        if (typeof carregarGraficoEntregas === 'function') {
            carregarGraficoEntregas();
        }

        if (relatorioPollingInterval) clearInterval(relatorioPollingInterval);
        relatorioIsProcessingChunks = false;
        let attempts = 0;
        const completedRequests = new Set();
        const allResults = [];
        
        relatorioPollingInterval = setInterval(async () => {
            attempts++;
            if (attempts > 90) {
                clearInterval(relatorioPollingInterval);
                relatorioRefreshInFlight = false;
                if (!background) {
                    setRelatorioState('error', 'Tempo limite excedido. Verifique se o Agente Local está rodando.');
                } else {
                    setRelatorioRefreshMessage('Falha ao atualizar (timeout)');
                    setTimeout(() => setRelatorioRefreshMessage(''), 4000);
                }
                return;
            }

            try {
                let anyProcessing = false;
                // Verificar todas as solicitações
                for (const requestId of requestIds) {
                    if (completedRequests.has(requestId)) continue;
                    
                    const statusResp = await fetch(`/api/agent/relatorio-resultados/status/${requestId}`);
                    const statusData = await statusResp.json();

                    if (statusData.status === 'completed') {
                        completedRequests.add(requestId);
                        console.log(`[Relatório] Solicitação ${requestId} concluída. Total de registros: ${statusData.registros?.length || 0}`);
                        allResults.push({
                            requestId: requestId,
                            data: statusData
                        });
                        
                        // Se todas as solicitações foram concluídas, processar resultados
                        if (completedRequests.size === requestIds.length) {
                            clearInterval(relatorioPollingInterval);
                            relatorioRefreshInFlight = false;
                            stopRefreshSpinner();
                            relatorioIsProcessingChunks = false;
                            
                            console.log(`[Relatório] Todas as solicitações concluídas. Total de resultados: ${allResults.length}`);
                            
                            // Se houver múltiplas solicitações, combinar os dados
                            if (allResults.length > 1) {
                                console.log(`[Relatório] Combinando dados de ${allResults.length} bases de dados...`);
                                const combinedData = {
                                    status: 'completed',
                                    success: true,
                                    registros: [],
                                    row_count: 0
                                };
                                
                                // Usar Set para evitar duplicação baseada em identificadores únicos
                                const registrosUnicos = new Map();
                                
                                allResults.forEach((result, index) => {
                                    if (result.data.registros && Array.isArray(result.data.registros)) {
                                        const dbName = index === 0 ? 'azportoex' : 'portoexsp';
                                        console.log(`[Relatório] Processando ${result.data.registros.length} registros de ${dbName}`);
                                        
                                        // Adicionar identificador de origem se não existir
                                        const registros = result.data.registros.map(reg => {
                                            if (!reg._database_source) {
                                                // Tentar identificar pela ordem (primeiro = azportoex, segundo = portoexsp)
                                                reg._database_source = dbName;
                                            }
                                            return reg;
                                        });
                                        
                                        let duplicadosEncontrados = 0;
                                        // Adicionar registros evitando duplicação
                                        registros.forEach(reg => {
                                            // Criar chave única baseada em identificadores disponíveis
                                            const chaveUnica = reg.id_minuta || reg.cte || reg.fatura || 
                                                              `${reg._database_source}_${reg.cte}_${reg.data}_${reg.cliente}_${reg.destino}`;
                                            
                                            if (!registrosUnicos.has(chaveUnica)) {
                                                registrosUnicos.set(chaveUnica, reg);
                                            } else {
                                                // Se já existe, verificar se é do mesmo banco ou diferente
                                                const existente = registrosUnicos.get(chaveUnica);
                                                // Se for de bancos diferentes, manter ambos mas marcar como duplicado
                                                if (existente._database_source !== reg._database_source) {
                                                    // Manter ambos, mas adicionar sufixo para diferenciar
                                                    reg._is_duplicate = true;
                                                    existente._is_duplicate = true;
                                                    registrosUnicos.set(chaveUnica + '_' + reg._database_source, reg);
                                                }
                                                // Se for do mesmo banco, ignorar (duplicata real)
                                                duplicadosEncontrados++;
                                            }
                                        });
                                        
                                        if (duplicadosEncontrados > 0) {
                                            console.log(`[Relatório] ⚠️ ${duplicadosEncontrados} duplicatas encontradas e removidas de ${dbName}`);
                                        }
                                        
                                        // NÃO somar row_count aqui - usar apenas o total de registros únicos
                                        // combinedData.row_count += result.data.row_count || 0;
                                    }
                                });
                                
                                // Converter Map para Array
                                combinedData.registros = Array.from(registrosUnicos.values());
                                combinedData.row_count = combinedData.registros.length; // Usar o número real de registros únicos
                                
                                console.log(`[Relatório] ✅ Combinação concluída: ${combinedData.registros.length} registros únicos de ${allResults.length} bases`);
                                console.log(`[Relatório] Detalhes: ${allResults.map((r, i) => `${i === 0 ? 'azportoex' : 'portoexsp'}: ${r.data.registros?.length || 0} registros`).join(', ')}`);
                                
                                processarRelatorioResultados(combinedData);
                            } else {
                                console.log(`[Relatório] Processando resultado único: ${statusData.registros?.length || 0} registros`);
                                processarRelatorioResultados(statusData);
                            }
                            
                            // Iniciar auto-refresh se estiver habilitado
                            if (relatorioAutoRefreshEnabled && !relatorioAutoRefreshInterval) {
                                startAutoRefresh();
                            }
                        }
                    } else if (statusData.status === 'processing') {
                        anyProcessing = true;
                        // Ainda processando chunks - atualizar mensagem de status
                        const chunksInfo = statusData.chunks_info || {};
                        const message = chunksInfo.total_chunks > 0 
                            ? `Processando chunks: ${chunksInfo.chunks_received?.length || 0}/${chunksInfo.total_chunks} recebidos (${chunksInfo.current_records || 0} registros até agora)...`
                            : 'Processando dados...';
                        if (!background) {
                            setRelatorioState('loading', message);
                        } else {
                            setRelatorioRefreshMessage('Atualizando…');
                        }
                        // Continuar polling
                    } else if (statusData.status === 'failed') {
                        completedRequests.add(requestId);
                        // Se todas falharam, mostrar erro
                        if (completedRequests.size === requestIds.length) {
                            clearInterval(relatorioPollingInterval);
                            relatorioRefreshInFlight = false;
                            stopRefreshSpinner();
                            if (!background) {
                                setRelatorioState('error', statusData.error || 'Falha na execução.');
                            } else {
                                setRelatorioRefreshMessage('Falha ao atualizar');
                                setTimeout(() => setRelatorioRefreshMessage(''), 4000);
                            }
                        }
                    }
                }
                relatorioIsProcessingChunks = anyProcessing;
            } catch (pollError) {
                console.error('[Relatório] erro no polling:', pollError);
                stopRefreshSpinner();
            }
        }, 2000);
    } catch (err) {
        console.error('[Relatório] erro ao iniciar:', err);
        relatorioRefreshInFlight = false;
        stopRefreshSpinner();
        if (!background) {
            setRelatorioState('error', err.message);
        } else {
            setRelatorioRefreshMessage('Falha ao atualizar');
            setTimeout(() => setRelatorioRefreshMessage(''), 4000);
        }
    }
}

// Funções de Refresh Automático
function toggleAutoRefresh() {
    const checkbox = document.getElementById('relatorio-auto-refresh');
    const select = document.getElementById('relatorio-refresh-interval');
    const statusDiv = document.getElementById('relatorio-refresh-status');
    
    if (!checkbox || !select) return;
    
    relatorioAutoRefreshEnabled = checkbox.checked;
    
    if (relatorioAutoRefreshEnabled) {
        // Ativar refresh automático
        select.disabled = false;
        statusDiv?.classList.remove('hidden');
        
        // Verificar se há dados carregados
        const resultsDiv = document.getElementById('relatorio-results');
        if (!resultsDiv || resultsDiv.classList.contains('hidden')) {
            // Se não há dados, fazer busca inicial
            buscarRelatorioResultados();
        } else {
            // Se já há dados, iniciar refresh automático
            startAutoRefresh();
        }
    } else {
        // Desativar refresh automático
        select.disabled = true;
        statusDiv?.classList.add('hidden');
        stopAutoRefresh();
    }
}

function updateAutoRefreshInterval() {
    const select = document.getElementById('relatorio-refresh-interval');
    if (!select || !relatorioAutoRefreshEnabled) return;
    
    // Reiniciar refresh com novo intervalo
    stopAutoRefresh();
    startAutoRefresh();
}

function startAutoRefresh() {
    stopAutoRefresh(); // Garantir que não há intervalos duplicados
    
    const select = document.getElementById('relatorio-refresh-interval');
    if (!select) return;
    
    const intervalSeconds = parseInt(select.value) || 60;
    let countdown = intervalSeconds;
    
    // Atualizar contador imediatamente
    updateRefreshCountdown(countdown);
    updateRelatorioClock();

    // Fazer um refresh imediato em segundo plano ao habilitar (sem piscar a tela)
    setTimeout(() => {
        buscarRelatorioResultados({ background: true });
    }, 0);
    
    // Atualizar contador a cada segundo
    relatorioAutoRefreshCountdown = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            countdown = intervalSeconds;
        }
        updateRefreshCountdown(countdown);
        updateRelatorioClock();
    }, 1000);
    
    // Executar refresh no intervalo definido
    relatorioAutoRefreshInterval = setInterval(() => {
        console.log('[AutoRefresh] Executando refresh automático...');
        // Refresh em segundo plano: não mostrar animação de loading, manter resultados visíveis
        buscarRelatorioResultados({ background: true });
        countdown = intervalSeconds; // Resetar contador após refresh
    }, intervalSeconds * 1000);
}

function stopAutoRefresh() {
    if (relatorioAutoRefreshInterval) {
        clearInterval(relatorioAutoRefreshInterval);
        relatorioAutoRefreshInterval = null;
    }
    if (relatorioAutoRefreshCountdown) {
        clearInterval(relatorioAutoRefreshCountdown);
        relatorioAutoRefreshCountdown = null;
    }
    updateRefreshCountdown(0);
    stopRefreshSpinner();
}

// Limpar intervalos ao sair da página
window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
    if (relatorioPollingInterval) {
        clearInterval(relatorioPollingInterval);
    }
});

// Defaults obrigatórios no load do Relatório de Resultados:
// - Status: Faturado
// - Forma de pagamento: À vista
// - Período: mês atual
document.addEventListener('DOMContentLoaded', () => {
    const periodEl = document.getElementById('relatorio-period');
    const customWrap1 = document.getElementById('relatorio-custom-datas');
    const customWrap2 = document.getElementById('relatorio-custom-datas2');
    const iniEl = document.getElementById('relatorio-data-inicio');
    const fimEl = document.getElementById('relatorio-data-fim');
    const fpFat = document.getElementById('relatorio-fp-faturado');
    const fpAv = document.getElementById('relatorio-fp-avista');
    const fpExcCort = document.getElementById('relatorio-fp-excluir-cortesia');

    // Defaults obrigatórios (coluna forma_pagamento)
    if (fpFat) fpFat.checked = true;
    if (fpAv) fpAv.checked = true;
    if (fpExcCort) fpExcCort.checked = true;
    initRelatorioAlertsUI();
    setRelatorioSoundEnabled(true);
    updateRelatorioClock();
    setInterval(updateRelatorioClock, 1000);
    const toISO = (dt) => dt.toISOString().slice(0, 10);

    // Limite: apenas -3 meses pra trás (calendário)
    const clampDateInput = (inputEl, minISO, maxISO) => {
        if (!inputEl) return;
        inputEl.min = minISO;
        inputEl.max = maxISO;
        if (inputEl.value) {
            if (inputEl.value < minISO) inputEl.value = minISO;
            if (inputEl.value > maxISO) inputEl.value = maxISO;
        }
        inputEl.addEventListener('change', () => {
            if (inputEl.value < minISO) inputEl.value = minISO;
            if (inputEl.value > maxISO) inputEl.value = maxISO;
            // Se usuário mexeu manualmente nas datas, considera custom
            if (periodEl) periodEl.value = 'custom';
        });
    };

    const monthRange = (monthsAgo) => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        // ir para o primeiro dia do mês desejado
        const target = new Date(d.getFullYear(), d.getMonth() - monthsAgo, 1);
        const start = new Date(target.getFullYear(), target.getMonth(), 1);
        const end = new Date(target.getFullYear(), target.getMonth() + 1, 0);
        return { start: toISO(start), end: toISO(end) };
    };

    const applyPeriodUI = () => {
        const p = periodEl?.value || 'mes_atual';
        const isCustom = p === 'custom';
        if (!iniEl || !fimEl) return;
        if (isCustom) return;
        const monthsAgo = p === 'mes_atual' ? 0 : (p === 'mes_menos1' ? 1 : (p === 'mes_menos2' ? 2 : 3));
        const r = monthRange(monthsAgo);
        iniEl.value = r.start;
        fimEl.value = r.end;
    };

    if (periodEl) periodEl.value = 'mes_atual';
    periodEl?.addEventListener('change', applyPeriodUI);
    applyPeriodUI();

    // Aplicar min/max nas datas (3 meses)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minD = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
    const toISOClamp = (dt) => dt.toISOString().slice(0, 10);
    const minISO = toISOClamp(minD);
    const maxISO = toISOClamp(today);
    clampDateInput(iniEl, minISO, maxISO);
    clampDateInput(fimEl, minISO, maxISO);

    const saveBtn = document.getElementById('relatorio-save-layout');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const scope = getRelatorioScopeElement();
            saveRelatorioLayoutNow(scope);
        });
    }
    const soundEl = document.getElementById('relatorio-sound-enabled');
    if (soundEl) {
        soundEl.addEventListener('change', () => {
            setRelatorioSoundEnabled(soundEl.checked);
            const scope = getRelatorioScopeElement();
            saveRelatorioLayoutDebounced(scope);
        });
    }
});

function updateRefreshCountdown(seconds) {
    const countdownEl = document.getElementById('relatorio-refresh-countdown');
    if (!countdownEl) return;
    
    if (seconds <= 0) {
        countdownEl.textContent = '';
    } else {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (minutes > 0) {
            countdownEl.textContent = `Próximo refresh em ${minutes}:${secs.toString().padStart(2, '0')}`;
        } else {
            countdownEl.textContent = `Próximo refresh em ${secs}s`;
        }
    }
}

function parseMetricValue(text) {
    if (!text) return 0;
    let raw = String(text).replace(/\s/g, '');
    raw = raw.replace(/[R$\u00A0]/g, '').replace('%', '');
    raw = raw.replace(/\./g, '').replace(',', '.');
    const val = parseFloat(raw);
    return Number.isFinite(val) ? val : 0;
}

let _audioContextResumed = false;
document.addEventListener('click', function _resumeAudioOnce() {
    if (_audioContextResumed) return;
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        window._relatorioAudioContext = ctx;
        ctx.resume().then(() => { _audioContextResumed = true; }).catch(() => {});
    } catch (e) {}
}, { once: true, passive: true });
document.addEventListener('keydown', function _resumeAudioKeyOnce() {
    if (_audioContextResumed) return;
    try {
        let ctx = window._relatorioAudioContext;
        if (!ctx) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) { ctx = new Ctx(); window._relatorioAudioContext = ctx; }
        }
        if (ctx) ctx.resume().then(() => { _audioContextResumed = true; }).catch(() => {});
    } catch (e) {}
}, { once: true, passive: true });
function playAlertSound() {
    if (!relatorioSoundEnabled) return;
    if (!_audioContextResumed) return;
    try {
        const ctx = window._relatorioAudioContext;
        if (!ctx || ctx.state === 'suspended') return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.value = 0.05;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        setTimeout(() => { try { osc.disconnect(); } catch (e) {} }, 300);
    } catch (e) {}
}

function applyRelatorioAlertsHighlight(resumo) {
    const alertBar = document.getElementById('relatorio-alerts');
    const list = document.getElementById('relatorio-alerts-list');
    const negatives = applyRelatorioAlertsFromResumo(resumo);
    const negativesSet = new Set(negatives.map((n) => n.label));
    const targets = Array.from(document.querySelectorAll('#relatorio-results [id^="relatorio-"], #relatorio-results [id^="dre-"]'));
    targets.forEach((el) => {
        const val = parseMetricValue(el.textContent || '');
        if (val < 0) {
            const card = el.closest('.rounded-lg.border');
            if (card) {
                card.classList.add('border-red-400', 'ring-1', 'ring-red-300');
                const labelEl = card.querySelector('h4, h3, span.text-sm, span.text-xs');
                const label = labelEl ? labelEl.textContent.trim() : 'Indicador negativo';
                if (label && !negativesSet.has(label)) {
                    negatives.push({ label, value: el.textContent.trim() });
                    negativesSet.add(label);
                }
            }
        }
    });
    const redCards = Array.from(document.querySelectorAll('#relatorio-results .rounded-lg.border'))
        .filter((card) => /border-red|text-red/.test(card.className));
    redCards.forEach((card) => {
        const labelEl = card.querySelector('h4, h3, span.text-sm, span.text-xs');
        const valueEl = card.querySelector('p');
        const label = labelEl ? labelEl.textContent.trim() : 'Indicador negativo';
        if (label && !negativesSet.has(label)) {
            negatives.push({ label, value: valueEl?.textContent?.trim() || '—' });
            negativesSet.add(label);
        }
    });
    if (!alertBar || !list) return;
    if (!negatives.length) {
        alertBar.classList.add('hidden');
        list.innerHTML = '<li>Nenhum indicador negativo identificado.</li>';
        return;
    }
    alertBar.classList.remove('hidden');
    list.innerHTML = negatives.map((n) => {
        const value = typeof n.value === 'string' ? n.value : formatCurrency(n.value);
        return `<li class="flex items-center justify-between"><span>${n.label}</span><span class="text-red-600 font-semibold">${value}</span></li>`;
    }).join('');
    playAlertSound();
}

// Modificar buscarRelatorioResultados para iniciar auto-refresh após sucesso
// (já está implementado acima, mas vamos garantir que o auto-refresh seja iniciado após processar resultados)

function normalizarRegistroRelatorio(row) {
    const normalized = {};
    Object.entries(row || {}).forEach(([key, value]) => {
        normalized[String(key || '').toLowerCase()] = value;
    });

    const pickFirst = (obj, keys) => {
        for (const key of keys) {
            const val = obj[key];
            if (val !== undefined && val !== null && String(val).trim() !== '') return val;
        }
        return undefined;
    };

    const pickByRegex = (obj, regex) => {
        const key = Object.keys(obj).find(k => regex.test(k));
        return key ? obj[key] : undefined;
    };

    const toNumber = (val) => {
        if (val === undefined || val === null) {
            console.log('[Relatório] toNumber: valor undefined/null');
            return 0;
        }
        if (typeof val === 'number') {
            const result = Number.isFinite(val) ? val : 0;
            console.log('[Relatório] toNumber: número', val, '->', result);
            return result;
        }
        let s = String(val).trim();
        if (!s) {
            console.log('[Relatório] toNumber: string vazia');
            return 0;
        }

        s = s.replace(/\s/g, '');
        s = s.replace(/R\$/gi, '');

        const hasComma = s.includes(',');
        const hasDot = s.includes('.');
        if (hasComma && hasDot) {
            s = s.replace(/\./g, '').replace(',', '.');
        } else if (hasComma && !hasDot) {
            s = s.replace(',', '.');
        }
        s = s.replace(/[^0-9.-]/g, '');

        const num = Number(s);
        const result = Number.isFinite(num) ? num : 0;
        console.log('[Relatório] toNumber: string', val, '->', s, '->', result);
        return result;
    };

    const data = pickFirst(normalized, ['data', 'data_emissao', 'datamov', 'dt', 'data_movimento']) ?? pickByRegex(normalized, /\bdata\b|\bdt\b/);
    const vendedor = pickFirst(normalized, ['vendedor', 'vendedor_nome', 'nome_vendedor', 'consultor', 'representante']) ?? pickByRegex(normalized, /vendedor|\bvend\b|consultor|representante/);
    const cliente = pickFirst(normalized, ['cliente', 'cliente_nome', 'nome_cliente', 'tomador', 'destinatario', 'pagador', 'sacado']) ?? pickByRegex(normalized, /cliente|tomador|destinat|pagador|sacado/);
    const origem = pickFirst(normalized, ['origem', 'origem_cidade', 'cidade_origem']) ?? pickByRegex(normalized, /origem|cidade.*orig/);
    const destino = pickFirst(normalized, ['destino', 'destino_cidade', 'cidade_destino']) ?? pickByRegex(normalized, /destino|cidade.*dest/);
    // CORREÇÃO CRÍTICA: Priorizar total_nf_valor (corresponde ao "VALOR NF" do sistema = 151.209.812,75)
    // O sistema mostra "VALOR NF" = 151.209.812,75 e "FRETE" = 2.813.817,44
    // O campo total_nf_valor é o que corresponde ao "VALOR NF" do sistema
    // IMPORTANTE: A normalização converte tudo para lowercase, então 'total_nf_valor' vira 'total_nf_valor'
    const valorRaw = pickFirst(normalized, [
        'total_nf_valor',  // CORREÇÃO: Este é o campo correto para "VALOR NF" do sistema (prioridade máxima)
        'valor_nf', 'nf_valor', 'valor_nota_fiscal', 'nf', 
        'frete', 'valor_bruto', 'valor', 'total', 'faturado', 
        'valor_total', 'valor_frete', 'vlr', 'vlr_total', 'vlr_frete', 'receita'
    ]) ?? pickByRegex(normalized, /total_nf_valor|valor_nf|nf.*valor|frete|valor|vlr|fatur|receita|total/);
    
    // Log para debug (apenas no primeiro registro)
    if (!window._valorFieldLogged) {
        const camposEncontrados = Object.keys(normalized).filter(k => 
            /valor|frete|nf|receita|total/i.test(k)
        );
        console.log('[Relatório] ========== DIAGNÓSTICO DE CAMPOS (NORMALIZADO) ==========');
        console.log('[Relatório] Todos os campos normalizados:', Object.keys(normalized).sort());
        console.log('[Relatório] Campos de valor disponíveis:', camposEncontrados);
        
        // Verificar cada campo na ordem de prioridade
        const camposPrioridade = ['total_nf_valor', 'valor_nf', 'nf_valor', 'frete', 'receita'];
        camposPrioridade.forEach(campo => {
            const existe = normalized[campo] !== undefined;
            const valor = normalized[campo];
            const valido = existe && valor !== null && String(valor).trim() !== '';
            console.log(`[Relatório] ${campo}: existe=${existe}, valido=${valido}, valor=${valor}`);
        });
        
        console.log('[Relatório] Campo de valor selecionado:', Object.keys(normalized).find(k => normalized[k] === valorRaw), '=', valorRaw);
        console.log('[Relatório] ========================================================');
        window._valorFieldLogged = true;
    }
    const resultadoRaw = pickFirst(normalized, ['resultado', 'resultado_liquido', 'lucro_liq', 'lucro', 'margem', 'resultado_total']) ?? pickByRegex(normalized, /resultado|lucro|margem/);
    // Para quantidade: usar 1 por registro (contar registros, não somar volumes)
    // Volumes será usado apenas para informações adicionais, não para contar operações
    const qtdRaw = 1; // Sempre 1 operação por registro (conforme sistema que mostra 2895 registros)
    const volumesRaw = pickFirst(normalized, ['volumes', 'quantidade', 'qtd', 'qtde', 'qtd_cte', 'qtd_nf']) ?? pickByRegex(normalized, /volumes|\bqtd\b|qtde|quantidade/);
    
    // Novos campos: custos e impostos
    // IMPORTANTE: O sistema mostra "C.TOTAL" = 1.398.516,06 e "IMPOSTO" = 731.592,46
    const custosRaw = pickFirst(normalized, ['c_total', 'custo_total', 'custos_operacionais', 'custos', 'total_custos', 'custo_operacional']) ?? pickByRegex(normalized, /c_total|custo|despesa/);
    const impostosRaw = pickFirst(normalized, ['imposto', 'imposto_value', 'impostos', 'total_impostos', 'imposto_total']) ?? pickByRegex(normalized, /imposto|taxa/);
    const receitaRaw = pickFirst(normalized, ['receita', 'receita_total', 'faturamento']) ?? pickByRegex(normalized, /receita|faturamento/);
    
    // Campos de custos detalhados
    const coletaCusto = pickFirst(normalized, ['coleta_custo', 'custo_coleta']) ?? 0;
    const entregaCusto = pickFirst(normalized, ['entrega_custo', 'custo_entrega']) ?? 0;
    const coletaResp = pickFirst(normalized, ['coleta_resp', 'resp_coleta', 'responsavel_coleta', 'coleta_responsavel']) ?? pickByRegex(normalized, /coleta.*resp|resp.*coleta/);
    const entregaResp = pickFirst(normalized, ['entrega_resp', 'resp_entrega', 'responsavel_entrega', 'entrega_responsavel']) ?? pickByRegex(normalized, /entrega.*resp|resp.*entrega/);
    const transfCusto = pickFirst(normalized, ['custo_transf', 'transf_custo', 'custo_transferencia']) ?? 0;
    const transfResp = pickFirst(normalized, ['transf_resp', 'resp_transf', 'responsavel_transf', 'responsavel_transferencia', 'transferencia_resp', 'transferencia_responsavel']) ?? pickByRegex(normalized, /transf.*resp|transfer.*resp|resp.*transf/);
    const icmsCusto = pickFirst(normalized, ['custo_icms', 'icms']) ?? 0;
    const seguroCusto = pickFirst(normalized, ['custo_seguro', 'seguro']) ?? 0;
    const outrosCustos = pickFirst(normalized, ['custo_outros', 'outros_custos']) ?? 0;
    const difal = pickFirst(normalized, ['difal']) ?? 0;
    const despachoCusto = pickFirst(normalized, ['despacho_custo', 'c_despacho', 'custo_despacho']) ?? 0;
    const peso = pickFirst(normalized, ['peso']) ?? 0;
    const comis = pickFirst(normalized, ['comis', 'comissao', 'comissao_value']) ?? 0;
    const lucroLiq = pickFirst(normalized, ['lucro_liq', 'lucro_liquido', 'lucro_liq']) ?? resultadoRaw; // Se não tiver, usar resultado

    // Identificadores (para rastreio e debug)
    const idMinuta = pickFirst(normalized, ['id_minuta', 'minuta', 'idminuta', 'id_min']) ?? pickByRegex(normalized, /minuta/);
    
    const valor = toNumber(valorRaw);
    const resultado = toNumber(resultadoRaw);
    const custos = toNumber(custosRaw) || (toNumber(coletaCusto) + toNumber(entregaCusto) + toNumber(transfCusto) + toNumber(icmsCusto) + toNumber(seguroCusto) + toNumber(outrosCustos));
    const impostos = toNumber(impostosRaw);
    const receita = toNumber(receitaRaw) || valor;
    // IMPORTANTE: Buscar o campo frete separadamente (usado para cálculo de margem)
    const freteRaw = pickFirst(normalized, ['frete', 'valor_frete', 'vlr_frete']) ?? 0;
    const frete = toNumber(freteRaw);
    const prejuizo = resultado < 0 ? Math.abs(resultado) : 0;
    const volumes = toNumber(volumesRaw) || 1;

    return {
        id_minuta: idMinuta ?? null,
        data: data || null,
        vendedor: vendedor || 'Sem vendedor',
        cliente: cliente || 'Cliente não informado',
        origem: origem || '-',
        destino: destino || '-',
        valor: valor, // VALOR NF (total_nf_valor)
        frete: frete, // FRETE (usado para cálculo de margem)
        resultado: resultado,
        quantidade: 1, //
        volumes: volumes, // Volumes para informação adicional
        custos: custos,
        impostos: impostos,
        receita: receita,
        prejuizo: prejuizo,
        coletaCusto: toNumber(coletaCusto),
        entregaCusto: toNumber(entregaCusto),
        coletaResp: coletaResp || 'Sem agente',
        entregaResp: entregaResp || 'Sem agente',
        transfCusto: toNumber(transfCusto),
        transfResp: transfResp || 'Sem agente',
        icmsCusto: toNumber(icmsCusto),
        seguroCusto: toNumber(seguroCusto),
        outrosCustos: toNumber(outrosCustos),
        difal: toNumber(difal),
        despachoCusto: toNumber(despachoCusto),
        peso: toNumber(peso),
        comis: toNumber(comis),
        lucroLiq: toNumber(lucroLiq),
        // Para cálculo de distância (será calculado se houver dados de origem/destino)
        distancia: null
    };
}

function processarRelatorioResultados(apiData) {
    // Resetar flag de log para permitir novo log após recarregar
    window._valorFieldLogged = false;
    
    console.log('[Relatório] Dados recebidos:', apiData);
    console.log('[Relatório] Total de registros brutos:', apiData?.registros?.length || 0);
    
    // Verificar e remover duplicatas antes de processar
    if (apiData?.registros && Array.isArray(apiData.registros)) {
        const registrosUnicos = new Map();
        const duplicados = [];
        
        apiData.registros.forEach((reg, index) => {
            // Criar chave única baseada em identificadores disponíveis
            const chaveUnica = reg.id_minuta || reg.cte || reg.fatura || 
                              `${reg._database_source || 'unknown'}_${reg.cte || ''}_${reg.data || ''}_${reg.cliente || ''}_${reg.destino || ''}`;
            
            if (registrosUnicos.has(chaveUnica)) {
                duplicados.push({ index, chaveUnica, registro: reg });
            } else {
                registrosUnicos.set(chaveUnica, reg);
            }
        });
        
        if (duplicados.length > 0) {
            console.warn(`[Relatório] ⚠️ ATENÇÃO: ${duplicados.length} registros duplicados detectados! Removendo duplicatas...`);
            // Remover duplicatas, mantendo apenas o primeiro de cada chave única
            apiData.registros = Array.from(registrosUnicos.values());
            console.log(`[Relatório] Registros após remoção de duplicatas: ${apiData.registros.length} (removidos: ${duplicados.length})`);
        }
    }
    
    // Log do primeiro registro bruto para verificar campos disponíveis
    if (apiData?.registros?.length > 0) {
        console.log('[Relatório] Primeiro registro BRUTO (campos disponíveis):', Object.keys(apiData.registros[0]));
        console.log('[Relatório] Primeiro registro BRUTO (valores):', apiData.registros[0]);
    }
    
    const registros = (apiData?.registros || []).map(normalizarRegistroRelatorio);
    console.log('[Relatório] Total de registros normalizados:', registros.length);
    console.log('[Relatório] Primeiro registro normalizado:', registros[0]);
    
    // Diagnóstico: verificar campos de valor encontrados
    const primeiroBruto = apiData?.registros?.[0];
    if (primeiroBruto) {
        const camposValor = Object.keys(primeiroBruto).filter(k => 
            /valor|frete|nf|receita|total|c_total|imposto|resultado/i.test(k)
        );
        console.log('[Relatório] ========== CAMPOS DISPONÍVEIS NO REGISTRO BRUTO ==========');
        console.log('[Relatório] Todos os campos:', Object.keys(primeiroBruto).sort());
        console.log('[Relatório] Campos relevantes:', camposValor);
        camposValor.forEach(campo => {
            console.log(`[Relatório]   ${campo}:`, primeiroBruto[campo], `(tipo: ${typeof primeiroBruto[campo]})`);
        });
        console.log('[Relatório] =========================================================');
    }
    
    relatorioRegistros = registros;

    if (!registros.length) {
        console.warn('[Relatório] Nenhum registro após normalização');
        setRelatorioState('empty');
        return;
    }

    const resumo = calcularResumoRelatorio(registros);
    relatorioVendedoresStats = resumo.vendedores;
    relatorioClientesStats = resumo.clientes;
    updateRelatorioTicker(resumo);
    applyRelatorioMetaCards(resumo, registros);
    renderRelatorioIndicadores(resumo);
    
    // Log de diagnóstico dos totais calculados
    console.log('[Relatório] ========== RESUMO CALCULADO ==========');
    console.log('[Relatório] Total de registros processados:', registros.length);
    console.log('[Relatório] Total Operações:', resumo.totalOperacoes, '(esperado: 2913)');
    console.log('[Relatório] Total Valor (VALOR NF):', formatCurrency(resumo.totalValor), '(esperado: R$ 152.065.330,83)');
    console.log('[Relatório] Total Receita:', formatCurrency(resumo.totalReceita), '(esperado: R$ 1.432.110,16)');
    console.log('[Relatório] Total Resultado:', formatCurrency(resumo.totalResultado), '(esperado: R$ 694.655,92)');
    console.log('[Relatório] Total Custos (C.TOTAL):', formatCurrency(resumo.totalCustos), '(esperado: R$ 1.404.252,94)');
    console.log('[Relatório] Total Impostos:', formatCurrency(resumo.totalImpostos), '(esperado: R$ 737.454,24)');
    console.log('[Relatório] Total Frete:', formatCurrency(resumo.totalFrete || 0), '(esperado: R$ 2.836.362,84)');
    console.log('[Relatório] Margem %:', resumo.margemPercentual.toFixed(2) + '%', '(esperado: 23,99%)');
    console.log('[Relatório] Cálculo margem: (', formatCurrency(resumo.totalResultado), '/', formatCurrency(resumo.totalFrete || resumo.totalReceita), ') * 100 =', resumo.margemPercentual.toFixed(2) + '%');
    console.log('[Relatório] ======================================');
    
    // Verificar se o primeiro registro normalizado tem o campo correto
    if (registros.length > 0) {
        console.log('[Relatório] Primeiro registro normalizado - valor:', registros[0].valor, 'receita:', registros[0].receita, 'resultado:', registros[0].resultado);
    }

    document.getElementById('relatorio-total-operacoes').textContent = formatNumber(resumo.totalOperacoes);
    // Frete exibido no card é diário (aplicado em applyRelatorioMetaCards)
    document.getElementById('relatorio-total-valor-nf').textContent = formatCurrency(resumo.totalValor); // VALOR NF (total_nf_valor)
    document.getElementById('relatorio-total-resultado').textContent = formatCurrency(resumo.totalResultado);
    document.getElementById('relatorio-total-custos').textContent = formatCurrency(resumo.totalCustos);
    document.getElementById('relatorio-total-impostos').textContent = formatCurrency(resumo.totalImpostos);
    document.getElementById('relatorio-total-prejuizos').textContent = formatCurrency(resumo.totalPrejuizos);
    document.getElementById('relatorio-margem-percentual').textContent = resumo.margemPercentual.toFixed(1) + '%';
    document.getElementById('relatorio-ticket-medio').textContent = formatCurrency(resumo.ticketMedio);
    document.getElementById('relatorio-media-resultado').textContent = formatCurrency(resumo.mediaResultado);
    document.getElementById('relatorio-melhor-vendedor').textContent = resumo.melhorVendedor?.nome || '-';
    document.getElementById('relatorio-melhor-vendedor-valor').textContent = resumo.melhorVendedor ? formatCurrency(resumo.melhorVendedor.resultadoTotal) : '-';
    document.getElementById('relatorio-pior-vendedor').textContent = resumo.piorVendedor?.nome || '-';
    document.getElementById('relatorio-pior-vendedor-valor').textContent = resumo.piorVendedor ? formatCurrency(resumo.piorVendedor.resultadoTotal) : '-';

    // Mostrar resultados imediatamente (indicadores sem delay)
    setRelatorioState('results');

    // Renderizações pesadas assíncronas para não bloquear o paint inicial
    setTimeout(() => {
        renderRelatorioVendedores(resumo.mediaResultado);
        renderRelatorioClientes();
        initRelatorioAgentesUI();
        renderRelatorioAgentesAdvanced();
        popularFiltroVendedor(resumo.vendedores);
        renderGraficosVendedores(resumo.vendedores);
        renderAnaliseFinanceiraDetalhada(resumo);
        renderFarolClientes(resumo.clientes);
        renderChurnAnalysis(resumo.clientes, registros);
        renderDREAnalysis(registros); // Renderizar análise DRE
        applyRelatorioAlertsHighlight(resumo);
        updateRelatorioMetaAlerts(resumo);
        document.querySelectorAll('[data-relatorio-scope], #content-relatorio').forEach((scope) => {
            if (!scope) return;
            initRelatorioDragAndDrop(scope);
        });
        loadRelatorioLayout().then((layout) => {
            document.querySelectorAll('[data-relatorio-scope], #content-relatorio').forEach((scope) => {
                if (!scope) return;
                applyRelatorioLayout(scope, layout);
                initRelatorioDragAndDrop(scope);
            });
        });
        // Re-renderizar gauge de frete apos layout estabilizar (garante velocimetro visivel)
        setTimeout(() => {
            if (relatorioFreteGaugeContext && typeof refreshRelatorioFreteGauge === 'function') {
                refreshRelatorioFreteGauge();
            }
        }, 300);
        // Relatório de Entregas já é disparado em paralelo no início de solicitacaoRelatorio()
    }, 0);
    try {
        const height = document.body.scrollHeight || document.documentElement.scrollHeight || 0;
        window.parent?.postMessage({ type: 'gerot-embed-height', height }, '*');
    } catch (e) {}
    relatorioLastRefreshAt = new Date();
    const newCount = registros.length;
    if (relatorioLastRowCount !== null) {
        const diff = newCount - relatorioLastRowCount;
        if (diff > 0) {
            setRelatorioRefreshSummary(`Recarregado · +${diff} registro(s)`);
        } else {
            setRelatorioRefreshSummary(`Recarregado · sem novos registros`);
        }
    } else {
        setRelatorioRefreshSummary(`Recarregado · ${newCount} registro(s)`);
    }
    relatorioLastRowCount = newCount;
    updateRelatorioClock();
    stopRefreshSpinner();
    // Se a atualização foi em segundo plano, limpar mensagem discreta
    setRelatorioRefreshMessage('');
    relatorioRefreshInFlight = false;
}

let relatorioAgentesState = {
    initialized: false,
    selectedAgents: new Set(),
    search: ''
};

let relatorioAgenteDetailState = {
    agente: null,
    rows: [],
};

function fecharDetalhesAgente() {
    relatorioAgenteDetailState = { agente: null, rows: [] };
    document.getElementById('relatorio-agente-detail')?.classList.add('hidden');
}

function initRelatorioAgentesUI() {
    if (relatorioAgentesState.initialized) return;
    relatorioAgentesState.initialized = true;

    const searchEl = document.getElementById('relatorio-agente-search');
    const btnAll = document.getElementById('relatorio-agente-select-all');
    const btnClear = document.getElementById('relatorio-agente-clear');
    const chkColeta = document.getElementById('relatorio-agente-tipo-coleta');
    const chkEntrega = document.getElementById('relatorio-agente-tipo-entrega');
    const chkTransf = document.getElementById('relatorio-agente-tipo-transf');

    // Transformar "Agentes (multi)" em popover (abre sob demanda)
    const popBtn = document.getElementById('relatorio-agente-picker-btn');
    const pop = document.getElementById('relatorio-agente-picker-pop');
    const popClose = () => pop?.classList.add('hidden');
    const popOpen = () => pop?.classList.remove('hidden');
    popBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!pop) return;
        pop.classList.toggle('hidden');
        if (!pop.classList.contains('hidden')) {
            // foco para busca
            setTimeout(() => searchEl?.focus(), 0);
        }
    });
    document.addEventListener('click', (e) => {
        if (!pop || pop.classList.contains('hidden')) return;
        const t = e.target;
        if (t && (pop.contains(t) || popBtn?.contains(t))) return;
        popClose();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') popClose();
    });

    searchEl?.addEventListener('input', () => {
        relatorioAgentesState.search = (searchEl.value || '').trim().toLowerCase();
        renderRelatorioAgentesAdvanced();
    });

    const onTipoChange = () => {
        // ao mudar os tipos, mantém seleção de agentes (se existirem no novo conjunto), e re-renderiza
        renderRelatorioAgentesAdvanced();
    };
    chkColeta?.addEventListener('change', onTipoChange);
    chkEntrega?.addEventListener('change', onTipoChange);
    chkTransf?.addEventListener('change', onTipoChange);

    btnClear?.addEventListener('click', () => {
        relatorioAgentesState.selectedAgents = new Set();
        renderRelatorioAgentesAdvanced();
    });

    btnAll?.addEventListener('click', () => {
        const visible = Array.from(document.querySelectorAll('#relatorio-agente-list input[type="checkbox"][data-agent]'))
            .filter(el => !el.disabled)
            .map(el => el.getAttribute('data-agent'))
            .filter(Boolean);
        visible.forEach(a => relatorioAgentesState.selectedAgents.add(a));
        renderRelatorioAgentesAdvanced();
    });
}

function _getSelectedAgentTipos() {
    const tipos = [];
    if (document.getElementById('relatorio-agente-tipo-coleta')?.checked) tipos.push('coleta');
    if (document.getElementById('relatorio-agente-tipo-entrega')?.checked) tipos.push('entrega');
    if (document.getElementById('relatorio-agente-tipo-transf')?.checked) tipos.push('transf');
    return tipos;
}

function _collectAgentsFromRegistros(tipos) {
    const set = new Set();
    (relatorioRegistros || []).forEach(item => {
        if (tipos.includes('coleta')) set.add(item.coletaResp || 'Sem agente');
        if (tipos.includes('entrega')) set.add(item.entregaResp || 'Sem agente');
        if (tipos.includes('transf')) set.add(item.transfResp || 'Sem agente');
    });
    // remover vazios e normalizar
    set.delete(null);
    set.delete(undefined);
    return Array.from(set).filter(a => String(a).trim() !== '').sort((a, b) => String(a).localeCompare(String(b), 'pt-BR'));
}

function _renderAgentPicker(allAgents) {
    const container = document.getElementById('relatorio-agente-list');
    if (!container) return;
    container.innerHTML = '';

    const q = (relatorioAgentesState.search || '').trim();
    const filtered = !q ? allAgents : allAgents.filter(a => String(a).toLowerCase().includes(q));

    if (!filtered.length) {
        container.innerHTML = '<div class="text-xs text-muted-foreground">Nenhum agente encontrado.</div>';
        return;
    }

    filtered.forEach(agent => {
        const checked = relatorioAgentesState.selectedAgents.has(agent);
        const safeId = `ag_${String(agent).replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)}_${Math.random().toString(16).slice(2, 6)}`;
        const row = document.createElement('div');
        row.className = 'flex items-center gap-2';
        row.innerHTML = `
            <input type="checkbox" id="${safeId}" data-agent="${escapeHtml(agent)}" class="rounded border-input" ${checked ? 'checked' : ''}>
            <label for="${safeId}" class="cursor-pointer">${escapeHtml(agent)}</label>
        `;
        const cb = row.querySelector('input');
        cb?.addEventListener('change', () => {
            if (cb.checked) relatorioAgentesState.selectedAgents.add(agent);
            else relatorioAgentesState.selectedAgents.delete(agent);
            renderRelatorioAgentesAdvanced();
        });
        container.appendChild(row);
    });

    const countEl = document.getElementById('relatorio-agente-picker-count');
    if (countEl) {
        const n = relatorioAgentesState.selectedAgents ? relatorioAgentesState.selectedAgents.size : 0;
        countEl.textContent = n > 0 ? `(${n} selecionado${n > 1 ? 's' : ''})` : '';
    }
}

function _aggregateAgentes(tipos) {
    const map = new Map();

    const push = (agente, custo, resultado) => {
        const name = agente || 'Sem agente';
        if (!map.has(name)) map.set(name, { agente: name, operacoes: 0, custoTotal: 0, resultadoTotal: 0 });
        const agg = map.get(name);
        agg.operacoes += 1;
        agg.custoTotal += (custo || 0);
        agg.resultadoTotal += (resultado || 0);
    };

    (relatorioRegistros || []).forEach(item => {
        const resultado = item.resultado || 0;
        if (tipos.includes('coleta')) push(item.coletaResp || 'Sem agente', item.coletaCusto || 0, resultado);
        if (tipos.includes('entrega')) push(item.entregaResp || 'Sem agente', item.entregaCusto || 0, resultado);
        if (tipos.includes('transf')) push(item.transfResp || 'Sem agente', item.transfCusto || 0, resultado);
    });

    return Array.from(map.values())
        .map(r => ({ ...r, impacto: (r.resultadoTotal || 0) - (r.custoTotal || 0) }))
        .sort((a, b) => (b.impacto || 0) - (a.impacto || 0));
}

function mostrarDetalhesAgente(agenteNome) {
    const tipos = _getSelectedAgentTipos();
    if (!tipos.length) {
        tipos.push('coleta', 'entrega');
    }

    const agente = agenteNome || 'Sem agente';
    const rows = [];
    (relatorioRegistros || []).forEach(item => {
        const minuta = item.id_minuta ?? item.minuta ?? null;
        const data = item.data || null;
        const cliente = item.cliente || '';
        const rol = item.resultado || 0; // R.O.L
        const impostos = item.impostos || 0;
        const lucroliq = item.lucroLiq || 0;

        const push = (tipo, resp, custo) => {
            if ((resp || 'Sem agente') !== agente) return;
            rows.push({
                id_minuta: minuta,
                data,
                cliente,
                tipo,
                custo: custo || 0,
                rol,
                impostos,
                lucroliq,
            });
        };

        if (tipos.includes('coleta')) push('Coleta', item.coletaResp, item.coletaCusto);
        if (tipos.includes('entrega')) push('Entrega', item.entregaResp, item.entregaCusto);
        if (tipos.includes('transf')) push('Transferência', item.transfResp, item.transfCusto);
    });

    // Agrupar por minuta: fazer merge de Coleta e Entrega que pertencem à mesma minuta
    const minutasMap = new Map();
    rows.forEach(row => {
        const key = String(row.id_minuta || '');
        if (!minutasMap.has(key)) {
            minutasMap.set(key, {
                id_minuta: row.id_minuta,
                data: row.data,
                cliente: row.cliente,
                tipos: [],
                custoTotal: 0,
                rol: row.rol,
                impostos: row.impostos,
                lucroliq: row.lucroliq,
            });
        }
        const merged = minutasMap.get(key);
        // Adicionar tipo se ainda não estiver presente
        if (!merged.tipos.includes(row.tipo)) {
            merged.tipos.push(row.tipo);
        }
        // Somar custos (coleta + entrega, etc)
        merged.custoTotal += (row.custo || 0);
    });

    // Converter map para array de linhas mergeadas
    const mergedRows = Array.from(minutasMap.values()).map(m => ({
        ...m,
        tipo: m.tipos.join(' + '), // "Coleta + Entrega" ou apenas "Coleta"
    }));

    relatorioAgenteDetailState = { agente, rows: mergedRows };

    // Totais DRE (contar minutas únicas, não linhas)
    const ops = mergedRows.length;
    const totalRol = rows.reduce((a, r) => a + (r.rol || 0), 0);
    const totalImp = rows.reduce((a, r) => a + (r.impostos || 0), 0);
    const totalLuc = rows.reduce((a, r) => a + (r.lucroliq || 0), 0);

    document.getElementById('relatorio-agente-detail-title').textContent = agente;
    document.getElementById('relatorio-agente-detail-ops').textContent = formatNumber(ops);
    document.getElementById('relatorio-agente-detail-rol').textContent = formatCurrency(totalRol);
    document.getElementById('relatorio-agente-detail-impostos').textContent = formatCurrency(totalImp);
    document.getElementById('relatorio-agente-detail-lucroliq').textContent = formatCurrency(totalLuc);

    const tbody = document.getElementById('relatorio-agente-detail-tbody');
    if (tbody) {
        tbody.innerHTML = '';
        mergedRows
            .slice()
            .sort((a, b) => {
                // Ordenar por minuta (numérica se possível, senão alfabética)
                const aMin = String(a.id_minuta || '');
                const bMin = String(b.id_minuta || '');
                const aNum = parseInt(aMin);
                const bNum = parseInt(bMin);
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return bNum - aNum; // Maior para menor
                }
                return bMin.localeCompare(aMin, 'pt-BR');
            })
            .forEach(r => {
                const dataFmt = r.data ? (String(r.data).includes('T') ? String(r.data).split('T')[0] : String(r.data)) : '';
                const dataFmtBR = dataFmt ? (dataFmt.includes('/') ? dataFmt : dataFmt.split('-').reverse().join('/')) : '-';
                tbody.insertAdjacentHTML('beforeend', `
                    <tr class="hover:bg-muted/30">
                        <td class="px-3 py-2 text-sm font-medium">${escapeHtml(r.id_minuta ?? '-')}</td>
                        <td class="px-3 py-2 text-sm">${escapeHtml(dataFmtBR)}</td>
                        <td class="px-3 py-2 text-sm">${escapeHtml(r.cliente || '')}</td>
                        <td class="px-3 py-2 text-sm">${escapeHtml(r.tipo || '')}</td>
                        <td class="px-3 py-2 text-sm text-right">${formatCurrency(r.custoTotal || 0)}</td>
                        <td class="px-3 py-2 text-sm text-right">${formatCurrency(r.rol || 0)}</td>
                        <td class="px-3 py-2 text-sm text-right">${formatCurrency(r.impostos || 0)}</td>
                        <td class="px-3 py-2 text-sm text-right">${formatCurrency(r.lucroliq || 0)}</td>
                    </tr>
                `);
            });
    }

    const box = document.getElementById('relatorio-agente-detail');
    box?.classList.remove('hidden');
    box?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function _renderRanking(rows) {
    const tbody = document.getElementById('relatorio-agentes-ranking-all');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!rows || !rows.length) return;

    rows.forEach((r, idx) => {
        const impacto = r.impacto || 0;
        const impactoClass = impacto < 0 ? 'text-red-700' : 'text-emerald-700';
        tbody.insertAdjacentHTML('beforeend', `
            <tr class="hover:bg-muted/30">
                <td class="px-3 py-2 text-xs text-muted-foreground">${idx + 1}</td>
                <td class="px-3 py-2 text-sm font-medium">${escapeHtml(r.agente)}</td>
                <td class="px-3 py-2 text-sm text-right">${formatCurrency(r.resultadoTotal || 0)}</td>
                <td class="px-3 py-2 text-sm text-right">${formatCurrency(r.custoTotal || 0)}</td>
                <td class="px-3 py-2 text-sm text-right font-semibold ${impactoClass}">${formatCurrency(impacto)}</td>
            </tr>
        `);
    });
}

function _renderAgentesChart(rows) {
    const canvas = document.getElementById('chart-agentes-impacto');
    if (!canvas || typeof Chart === 'undefined') return;

    const limited = (rows || []).slice(0, 15);
    const labels = limited.map(r => r.agente);
    const custo = limited.map(r => r.custoTotal || 0);
    const resultado = limited.map(r => r.resultadoTotal || 0);
    const impacto = limited.map(r => r.impacto || 0);

    const meta = document.getElementById('relatorio-agente-chart-meta');
    if (meta) meta.textContent = limited.length ? `Top ${limited.length} por impacto` : '';

    // destruir instância anterior
    window.relatorioCharts = window.relatorioCharts || {};
    if (window.relatorioCharts.agentesImpacto) {
        try { window.relatorioCharts.agentesImpacto.destroy(); } catch (e) {}
    }

    const ctx = canvas.getContext('2d');
    window.relatorioCharts.agentesImpacto = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Resultado',
                    data: resultado,
                    backgroundColor: 'rgba(16, 185, 129, 0.55)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Custos',
                    data: custo,
                    backgroundColor: 'rgba(59, 130, 246, 0.45)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Impacto',
                    data: impacto,
                    type: 'line',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    pointRadius: 2,
                    yAxisID: 'y',
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const v = ctx.parsed.y || 0;
                            return `${ctx.dataset.label}: ${formatCurrency(v)}`;
                        }
                    }
                }
            },
            scales: {
                // Mantém o gráfico estável (não cresce a página). Para muitos agentes, use a tabela/ranking.
                x: {
                    ticks: { autoSkip: true, maxRotation: 0, minRotation: 0 },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (v) => {
                            try { return formatCurrency(v); } catch { return v; }
                        }
                    }
                },
            }
        }
    });
}

function renderRelatorioAgentesAdvanced() {
    const tbody = document.getElementById('relatorio-agentes-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const tipos = _getSelectedAgentTipos();
    // se nada selecionado, assume coleta+entrega
    if (!tipos.length) {
        document.getElementById('relatorio-agente-tipo-coleta') && (document.getElementById('relatorio-agente-tipo-coleta').checked = true);
        document.getElementById('relatorio-agente-tipo-entrega') && (document.getElementById('relatorio-agente-tipo-entrega').checked = true);
        tipos.push('coleta', 'entrega');
    }

    const allAgents = _collectAgentsFromRegistros(tipos);
    _renderAgentPicker(allAgents);

    const allRows = _aggregateAgentes(tipos);

    // filtro por agentes selecionados (multi)
    let rows = allRows;
    if (relatorioAgentesState.selectedAgents && relatorioAgentesState.selectedAgents.size > 0) {
        rows = allRows.filter(r => relatorioAgentesState.selectedAgents.has(r.agente));
    } else {
        rows = allRows.slice(0, 12);
    }

    // tabela + ranking + gráfico
    rows.forEach(r => {
        const impactoClass = (r.impacto || 0) < 0 ? 'text-red-600' : 'text-emerald-600';
        tbody.insertAdjacentHTML('beforeend', `
            <tr class="hover:bg-muted/30">
                <td class="px-4 py-3 text-sm font-medium">
                    <button type="button" class="hover:underline text-left" data-agent-row="${escapeHtml(r.agente)}">
                        ${escapeHtml(r.agente)}
                    </button>
                </td>
                <td class="px-4 py-3 text-sm">${formatNumber(r.operacoes)}</td>
                <td class="px-4 py-3 text-sm">${formatCurrency(r.custoTotal)}</td>
                <td class="px-4 py-3 text-sm">${formatCurrency(r.resultadoTotal)}</td>
                <td class="px-4 py-3 text-sm font-medium ${impactoClass}">${formatCurrency(r.impacto)}</td>
            </tr>
        `);
    });

    // Bind click (delegated): abrir detalhes + listar minutas do agente
    tbody.querySelectorAll('button[data-agent-row]')?.forEach(btn => {
        btn.addEventListener('click', () => {
            const a = btn.getAttribute('data-agent-row') || '';
            mostrarDetalhesAgente(a);
        });
    });

    _renderRanking(allRows);
    _renderAgentesChart(rows.length ? rows : allRows);
}

function calcularResumoRelatorio(registros) {
    const vendedoresMap = new Map();
    const clientesMap = new Map();
    let totalOperacoes = 0;
    let totalValor = 0;
    let totalFrete = 0;
    let totalVolumes = 0;
    let totalPeso = 0;
    let totalResultado = 0;
    let totalCustos = 0;
    let totalImpostos = 0;
    let totalPrejuizos = 0;
    let totalReceita = 0;
    let totalColetaCusto = 0;
    let totalEntregaCusto = 0;
    let totalTransfCusto = 0;
    let totalIcms = 0;
    let totalDifal = 0;
    let totalDespacho = 0;
    let totalSeguro = 0;
    let totalOutros = 0;
    let totalComis = 0;
    let totalLucroLiq = 0;

    registros.forEach(item => {
        const receitaBruta = item.frete || 0;
        const custos = item.custos || 0;
        const impostos = item.impostos || 0;
        const resultadoLiquido = receitaBruta - custos - impostos;
        const ops = 1; // Sempre 1 operação por registro
        totalOperacoes += ops;
        totalValor += item.valor || 0;
        totalFrete += receitaBruta;
        totalVolumes += item.volumes || 0;
        totalPeso += item.peso || 0;
        totalResultado += resultadoLiquido;
        totalCustos += custos;
        totalImpostos += impostos;
        totalPrejuizos += item.prejuizo || 0;
        totalReceita += receitaBruta;
        totalColetaCusto += item.coletaCusto || 0;
        totalEntregaCusto += item.entregaCusto || 0;
        totalTransfCusto += item.transfCusto || 0;
        totalIcms += item.icmsCusto || 0;
        totalDifal += item.difal || 0;
        totalDespacho += item.despachoCusto || 0;
        totalSeguro += item.seguroCusto || 0;
        totalOutros += item.outrosCustos || 0;
        totalComis += item.comis || 0;
        totalLucroLiq += resultadoLiquido;

        const vendedorKey = item.vendedor || 'Sem vendedor';
        if (!vendedoresMap.has(vendedorKey)) {
            vendedoresMap.set(vendedorKey, {
                nome: vendedorKey,
                operacoes: 0,
                valorTotal: 0,
                freteTotal: 0,
                resultadoTotal: 0,
                custosTotal: 0,
                impostosTotal: 0,
                receitaTotal: 0,
                ebtida: 0,
                clientes: new Set(),
                registros: []
            });
        }
        const vendedor = vendedoresMap.get(vendedorKey);
        vendedor.operacoes += 1; // Cada registro = 1 operação
        vendedor.valorTotal += item.valor || 0;
        vendedor.freteTotal = (vendedor.freteTotal || 0) + receitaBruta;
        vendedor.resultadoTotal += resultadoLiquido;
        vendedor.custosTotal += custos;
        vendedor.impostosTotal += impostos;
        vendedor.receitaTotal += receitaBruta;
        // EBTIDA = Receita - Custos Operacionais (antes dos impostos)
        vendedor.ebtida = vendedor.receitaTotal - vendedor.custosTotal;
        vendedor.clientes.add(item.cliente);
        vendedor.registros.push(item);

        const clienteKey = item.cliente || 'Cliente não informado';
        if (!clientesMap.has(clienteKey)) {
            clientesMap.set(clienteKey, {
                nome: clienteKey,
                operacoes: 0,
                valorTotal: 0,
                freteTotal: 0,
                resultadoTotal: 0,
                custosTotal: 0,
                impostosTotal: 0,
                receitaTotal: 0,
                vendedor: item.vendedor || 'Sem vendedor',
                registros: []
            });
        }
        const cliente = clientesMap.get(clienteKey);
        cliente.operacoes += 1;
        cliente.valorTotal += item.valor || 0;
        cliente.freteTotal = (cliente.freteTotal || 0) + receitaBruta;
        cliente.resultadoTotal += resultadoLiquido;
        cliente.custosTotal += custos;
        cliente.impostosTotal += impostos;
        cliente.receitaTotal += receitaBruta;
        cliente.registros.push(item);
    });

    const vendedores = Array.from(vendedoresMap.values()).map(v => ({
        ...v,
        clientesCount: v.clientes.size,
        resultadoMedio: v.operacoes ? v.resultadoTotal / v.operacoes : 0,
        margemPercentual: v.receitaTotal ? (v.resultadoTotal / v.receitaTotal) * 100 : 0,
        ebtidaPercentual: v.receitaTotal ? ((v.ebtida || 0) / v.receitaTotal) * 100 : 0,
        impostosPercentual: v.receitaTotal ? (v.impostosTotal / v.receitaTotal) * 100 : 0
    })).sort((a, b) => b.resultadoTotal - a.resultadoTotal);

    const clientes = Array.from(clientesMap.values()).map(c => ({
        ...c,
        margemPercentual: c.receitaTotal ? (c.resultadoTotal / c.receitaTotal) * 100 : 0,
        ticketMedio: c.operacoes ? c.valorTotal / c.operacoes : 0
    })).sort((a, b) => b.valorTotal - a.valorTotal);
    
    const mediaResultado = vendedores.length ? (totalResultado / vendedores.length) : 0;
    const margemPercentual = totalFrete > 0 ? (totalResultado / totalFrete) * 100 : 0;
    
    // Calcular EBTIDA total (Receita - Custos Operacionais, antes dos impostos)
    const totalEBTIDA = totalReceita - totalCustos;
    const ebtidaPercentual = totalReceita ? (totalEBTIDA / totalReceita) * 100 : 0;
    const impostosPercentual = totalReceita ? (totalImpostos / totalReceita) * 100 : 0;
    const custosPercentual = totalReceita ? (totalCustos / totalReceita) * 100 : 0;

    return {
        totalOperacoes,
        totalValor,
        totalFrete,
        totalVolumes,
        totalPeso,
        totalResultado,
        totalCustos,
        totalImpostos,
        totalPrejuizos,
        totalReceita,
        totalColetaCusto,
        totalEntregaCusto,
        totalTransfCusto,
        totalIcms,
        totalDifal,
        totalDespacho,
        totalSeguro,
        totalOutros,
        totalComis,
        totalLucroLiq,
        totalEBTIDA,
        ebtidaPercentual,
        impostosPercentual,
        custosPercentual,
        ticketMedio: totalOperacoes ? totalFrete / totalOperacoes : 0, // Ticket médio baseado no frete (receita bruta)
        mediaResultado,
        margemPercentual,
        vendedores,
        clientes,
        melhorVendedor: vendedores[0] || null,
        piorVendedor: vendedores.length ? vendedores[vendedores.length - 1] : null
    };
}

function renderRelatorioVendedores(mediaResultado) {
    const container = document.getElementById('relatorio-vendedores-list');
    if (!container) return;
    container.innerHTML = '';

    relatorioVendedoresStats.forEach(vendedor => {
        const performance = vendedor.resultadoTotal - mediaResultado;
        const farolClass = performance >= 0 ? 'bg-emerald-500' : 'bg-red-500';
        const trendIcon = performance >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';

        container.insertAdjacentHTML('beforeend', `
            <div class="p-4 hover:bg-muted/40 cursor-pointer transition-colors" onclick="mostrarDetalhesVendedor('${escapeHtml(vendedor.nome)}')">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-semibold text-base">${escapeHtml(vendedor.nome)}</p>
                        <p class="text-xs text-muted-foreground">${vendedor.operacoes} operações · ${vendedor.clientesCount} clientes</p>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold">${formatCurrency(vendedor.resultadoTotal)}</p>
                        <span class="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <span class="w-2 h-2 rounded-full ${farolClass}"></span>
                            <i class="fas ${trendIcon}"></i>
                            ${formatCurrency(vendedor.valorTotal)}
                        </span>
                    </div>
                </div>
            </div>
        `);
    });
}

function renderRelatorioClientes() {
    const tbody = document.getElementById('relatorio-clientes-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const totalOperacoes = relatorioVendedoresStats.reduce((acc, v) => acc + v.operacoes, 0) || 1;

    relatorioClientesStats.forEach(cliente => {
        const frequencia = (cliente.operacoes / totalOperacoes) * 100;
        tbody.insertAdjacentHTML('beforeend', `
            <tr class="hover:bg-muted/30">
                <td class="px-4 py-3 text-sm font-medium">${escapeHtml(cliente.nome)}</td>
                <td class="px-4 py-3 text-sm">${formatNumber(cliente.operacoes)}</td>
                <td class="px-4 py-3 text-sm">${formatCurrency(cliente.valorTotal)}</td>
                <td class="px-4 py-3 text-sm">${formatCurrency(cliente.resultadoTotal)}</td>
                <td class="px-4 py-3 text-sm">${frequencia.toFixed(1)}%</td>
            </tr>
        `);
    });
}

let relatorioVendedorAtual = null;

function mostrarDetalhesVendedor(nomeVendedor) {
    const registros = relatorioRegistros.filter(item => (item.vendedor || 'Sem vendedor') === nomeVendedor);
    relatorioDetalhesAtuais = registros;
    relatorioVendedorAtual = nomeVendedor;

    const detailTitle = document.getElementById('relatorio-detail-title');
    if (detailTitle) {
        detailTitle.textContent = `Detalhes de ${nomeVendedor} (${registros.length})`;
    }

    const tbody = document.getElementById('relatorio-detalhe-tbody');
    if (tbody) {
        tbody.innerHTML = '';
        registros.forEach(item => {
            const dataFormatada = item.data ? formatDateBR(item.data.split('T')[0] || item.data) : '-';
            const minuta = item.id_minuta ?? item.minuta ?? '-';
            tbody.insertAdjacentHTML('beforeend', `
                <tr class="hover:bg-muted/30">
                    <td class="px-4 py-3 text-sm">${escapeHtml(minuta)}</td>
                    <td class="px-4 py-3 text-sm">${dataFormatada}</td>
                    <td class="px-4 py-3 text-sm">${escapeHtml(item.cliente)}</td>
                    <td class="px-4 py-3 text-sm">${escapeHtml(item.destino)}</td>
                    <td class="px-4 py-3 text-sm font-medium text-blue-600">${formatCurrency(item.valor)}</td>
                    <td class="px-4 py-3 text-sm font-medium text-emerald-600">${formatCurrency(item.resultado)}</td>
                    <td class="px-4 py-3 text-sm text-center">${formatNumber(item.quantidade || 1)}</td>
                </tr>
            `);
        });
    }

    const detail = document.getElementById('relatorio-detail');
    detail?.classList.remove('hidden');
    detail?.scrollIntoView({ behavior: 'smooth' });
}

function exportarDetalhesVendedorExcel() {
    if (!relatorioDetalhesAtuais || relatorioDetalhesAtuais.length === 0) {
        alert('Nenhum dado para exportar');
        return;
    }
    
    try {
        // Criar CSV
        let csv = '\uFEFF'; // BOM para Excel
        csv += 'Minuta,Data,Cliente,Destino,Valor,Resultado,Quantidade\n';
        
        relatorioDetalhesAtuais.forEach(item => {
            const dataFormatada = item.data ? formatDateBR(item.data.split('T')[0] || item.data) : '-';
            const minuta = String(item.id_minuta ?? item.minuta ?? '').replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, '');
            const cliente = String(item.cliente || '').replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, '');
            const destino = String(item.destino || '').replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, '');
            const valor = (item.valor || 0).toFixed(2).replace('.', ',');
            const resultado = (item.resultado || 0).toFixed(2).replace('.', ',');
            const quantidade = item.quantidade || 1;
            
            csv += `"${minuta}","${dataFormatada}","${cliente}","${destino}","${valor}","${resultado}","${quantidade}"\n`;
        });
        
        // Criar blob e download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        // Limpar nome do vendedor para nome de arquivo
        const nomeVendedorLimpo = (relatorioVendedorAtual || 'Vendedor')
            .replace(/[^a-zA-Z0-9]/g, '_')
            .substring(0, 50);
        const dataAtual = new Date().toISOString().split('T')[0];
        const nomeArquivo = `Detalhes_Vendedor_${nomeVendedorLimpo}_${dataAtual}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', nomeArquivo);
        link.style.visibility = 'hidden';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Limpar após download
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
        
        console.log(`[Export] Arquivo exportado: ${nomeArquivo} com ${relatorioDetalhesAtuais.length} registros`);
    } catch (error) {
        console.error('[Export] Erro ao exportar:', error);
        alert('Erro ao exportar arquivo. Verifique o console para mais detalhes.');
    }
}

function fecharDetalhesVendedor() {
    document.getElementById('relatorio-detail')?.classList.add('hidden');
    document.getElementById('relatorio-detalhe-tbody')?.replaceChildren();
}

function toggleCardBody(button) {
    const card = button.closest('.rounded-lg.border');
    if (!card) return;
    
    const body = card.querySelector('.card-body');
    if (!body) return;
    
    const icon = button.querySelector('i');
    if (body.classList.contains('hidden')) {
        body.classList.remove('hidden');
        if (icon) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    } else {
        body.classList.add('hidden');
        if (icon) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    }
}

function toggleRankingBody(button) {
    const container = document.getElementById('ranking-body-container');
    if (!container) return;
    
    const icon = button.querySelector('i');
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        if (icon) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    } else {
        container.classList.add('hidden');
        if (icon) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    }
}

// Variáveis globais para gráficos DRE
let dreCharts = {
    composicao: null,
    impostos: null,
    evolucao: null
};
let expandedChartDRE = null;

function renderDREAnalysis(registros) {
    if (!registros || registros.length === 0) return;
    
    // Calcular totais
    let totalROL = 0;
    let totalLucroLiq = 0;
    let totalOperacoes = registros.length;
    
    let totalCustos = 0;
    registros.forEach(r => {
        // ROL = Valor Bruto (Frete) - Custos Operacionais
        const frete = r.frete || 0;
        const custos = r.custos || 0;
        const rol = frete - custos;
        totalROL += rol;
        totalCustos += custos;
        totalLucroLiq += r.lucroLiq || 0;
    });
    
    // Calcular impostos (26.5% do ROL)
    const taxaImpostos = 0.265; // 26.5%
    const taxaCF = 0.15; // 15% - Contribuição Social
    const taxaIF = 0.08; // 8% - Imposto de Renda
    const taxaOutros = 0.035; // 3.5% - Outros
    
    const totalImpostos = totalROL * taxaImpostos;
    const impostoCF = totalROL * taxaCF;
    const impostoIF = totalROL * taxaIF;
    const impostoOutros = totalROL * taxaOutros;
    
    // Lucro Líquido = ROL - Impostos (26,5%)
    const lucroLiquido = totalROL - totalImpostos;
    
    // Atualizar cards de resumo
    document.getElementById('dre-rol-total').textContent = formatCurrency(totalROL);
    document.getElementById('dre-rol-count').textContent = `${totalOperacoes} operações`;
    document.getElementById('dre-impostos-total').textContent = formatCurrency(totalImpostos);
    document.getElementById('dre-impostos-cf').textContent = `C.F: ${(taxaCF * 100).toFixed(1)}%`;
    document.getElementById('dre-impostos-if').textContent = `I.F: ${(taxaIF * 100).toFixed(1)}%`;
    document.getElementById('dre-impostos-outros').textContent = `Outros: ${(taxaOutros * 100).toFixed(1)}%`;
    document.getElementById('dre-lucro-total').textContent = formatCurrency(lucroLiquido);
    const percentLucro = totalROL > 0 ? ((lucroLiquido / totalROL) * 100).toFixed(2) : 0;
    document.getElementById('dre-lucro-percent').textContent = `${percentLucro}% do ROL`;
    document.getElementById('dre-taxa-impostos').textContent = `${(taxaImpostos * 100).toFixed(1)}%`;
    
    // Atualizar breakdown de impostos
    document.getElementById('dre-cf-valor').textContent = formatCurrency(impostoCF);
    document.getElementById('dre-cf-bar').style.width = '100%';
    document.getElementById('dre-if-valor').textContent = formatCurrency(impostoIF);
    document.getElementById('dre-if-bar').style.width = '100%';
    document.getElementById('dre-outros-valor').textContent = formatCurrency(impostoOutros);
    document.getElementById('dre-outros-bar').style.width = '100%';
    
    // Gráfico 1: Composição (ROL vs Impostos vs Lucro Líquido)
    const ctxComposicao = document.getElementById('chart-dre-composicao');
    if (ctxComposicao) {
        if (dreCharts.composicao) dreCharts.composicao.destroy();
        
        dreCharts.composicao = new Chart(ctxComposicao, {
            type: 'doughnut',
            data: {
                labels: ['ROL', 'Impostos (26.5%)', 'Lucro Líquido'],
                datasets: [{
                    data: [totalROL, totalImpostos, lucroLiquido],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)', // Azul - ROL
                        'rgba(249, 115, 22, 0.8)', // Laranja - Impostos
                        'rgba(16, 185, 129, 0.8)'  // Verde - Lucro
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(249, 115, 22)',
                        'rgb(16, 185, 129)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = formatCurrency(context.parsed);
                                const percent = totalROL > 0 ? ((context.parsed / totalROL) * 100).toFixed(2) : 0;
                                return `${label}: ${value} (${percent}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico 2: Breakdown de Impostos
    const ctxImpostos = document.getElementById('chart-dre-impostos');
    if (ctxImpostos) {
        if (dreCharts.impostos) dreCharts.impostos.destroy();
        
        dreCharts.impostos = new Chart(ctxImpostos, {
            type: 'bar',
            data: {
                labels: ['C.F (15%)', 'I.F (8%)', 'Outros (3.5%)'],
                datasets: [{
                    label: 'Impostos',
                    data: [impostoCF, impostoIF, impostoOutros],
                    backgroundColor: [
                        'rgba(249, 115, 22, 0.7)', // Laranja
                        'rgba(239, 68, 68, 0.7)',  // Vermelho
                        'rgba(234, 179, 8, 0.7)'   // Amarelo
                    ],
                    borderColor: [
                        'rgb(249, 115, 22)',
                        'rgb(239, 68, 68)',
                        'rgb(234, 179, 8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = formatCurrency(context.parsed.y);
                                const percent = totalROL > 0 ? ((context.parsed.y / totalROL) * 100).toFixed(2) : 0;
                                return `${value} (${percent}% do ROL)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                            },
                            font: { size: 10 }
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico 3: Evolução (stacked bar)
    const ctxEvolucao = document.getElementById('chart-dre-evolucao');
    if (ctxEvolucao) {
        if (dreCharts.evolucao) dreCharts.evolucao.destroy();
        
        // Agrupar por período (se houver campo data)
        const porData = {};
        registros.forEach(r => {
            if (!r.data) return;
            const dataKey = r.data.split('T')[0] || r.data;
            if (!porData[dataKey]) {
                porData[dataKey] = { rol: 0, impostos: 0, lucro: 0 };
            }
            const rol = r.resultado || (r.valor || 0) - (r.custos || 0);
            const impostosReg = rol * taxaImpostos;
            const lucroReg = r.lucroLiq || (rol - impostosReg);
            porData[dataKey].rol += rol;
            porData[dataKey].impostos += impostosReg;
            porData[dataKey].lucro += lucroReg;
        });
        
        const datas = Object.keys(porData).sort().slice(-10); // Últimas 10 datas
        const labels = datas.map(d => {
            // Formato YYYY-MM-DD para DD/MM/YYYY
            const parts = d.split('-');
            return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : d;
        });
        
        dreCharts.evolucao = new Chart(ctxEvolucao, {
            type: 'bar',
            data: {
                labels: labels.length > 0 ? labels : ['Total'],
                datasets: [
                    {
                        label: 'ROL',
                        data: datas.length > 0 ? datas.map(d => porData[d].rol) : [totalROL],
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1
                    },
                    {
                        label: 'Impostos',
                        data: datas.length > 0 ? datas.map(d => porData[d].impostos) : [totalImpostos],
                        backgroundColor: 'rgba(249, 115, 22, 0.7)',
                        borderColor: 'rgb(249, 115, 22)',
                        borderWidth: 1
                    },
                    {
                        label: 'Lucro Líquido',
                        data: datas.length > 0 ? datas.map(d => porData[d].lucro) : [lucroLiquido],
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgb(16, 185, 129)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { font: { size: 12 }, padding: 10 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: false,
                        ticks: {
                            font: { size: 10 },
                            maxRotation: 45,
                            minRotation: 0
                        }
                    },
                    y: {
                        stacked: false,
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                            },
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }
}

function escapeHtml(value) {
    return String(value || '').replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Variáveis globais para os gráficos
let relatorioCharts = {};
let relatorioTodosVendedores = [];

/**
 * Carrega e renderiza o Relatório de Entregas (Script 376) com:
 * - Velocímetros: No Prazo (positivo) e Fora do Prazo (crítico)
 * - Gráfico pizza agregado
 * - Comparativo por cliente
 * - Tabela por agente
 */
async function carregarGraficoEntregas() {
    const loadingEl = document.getElementById('relatorio-entregas-loading');
    const errorEl = document.getElementById('relatorio-entregas-error');
    const errorMsgEl = document.getElementById('relatorio-entregas-error-msg');
    const chartWrap = document.getElementById('relatorio-entregas-chart-wrap');
    const periodoEl = document.getElementById('relatorio-entregas-periodo');
    const totalEl = document.getElementById('relatorio-entregas-total');

    if (!loadingEl || !chartWrap) return;

    const periodEl = document.getElementById('relatorio-period');
    const dataInicioEl = document.getElementById('relatorio-data-inicio');
    const dataFimEl = document.getElementById('relatorio-data-fim');
    const databaseEl = document.getElementById('relatorio-database');

    let dataInicio = dataInicioEl?.value || '';
    let dataFim = dataFimEl?.value || '';
    const database = databaseEl?.value || 'azportoex';

    if (!dataInicio || !dataFim) {
        const hoje = new Date();
        const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        dataInicio = primeiroDia.toISOString().slice(0, 10);
        dataFim = ultimoDia.toISOString().slice(0, 10);
    }

    loadingEl.classList.remove('hidden');
    errorEl.classList.add('hidden');
    chartWrap.classList.add('hidden');

    ['entregas', 'entregas_por_cliente', 'entregas_ranking_cliente', 'entregas_gauge_no_prazo', 'entregas_gauge_fora_prazo'].forEach(key => {
        if (relatorioCharts[key]) {
            try { relatorioCharts[key].destroy(); } catch (e) {}
            delete relatorioCharts[key];
        }
    });

    try {
        const url = `/api/relatorio-entregas?database=${encodeURIComponent(database)}&data_inicio=${encodeURIComponent(dataInicio)}&data_fim=${encodeURIComponent(dataFim)}`;
        const resp = await fetch(url);
        let data = await resp.json().catch(() => ({}));

        // Fluxo assíncrono: 202 = solicitação criada, aguardar agente processar
        if (resp.status === 202 && data.pending && data.request_id) {
            const requestId = data.request_id;
            const maxAttempts = 60; // ~2 min
            const pollInterval = 2000; // 2s
            for (let i = 0; i < maxAttempts; i++) {
                await new Promise(r => setTimeout(r, pollInterval));
                const statusResp = await fetch(`/api/agent/relatorio-entregas/status/${requestId}`);
                data = await statusResp.json().catch(() => ({}));
                if (!data.pending) break;
            }
        }

        loadingEl.classList.add('hidden');

        if (!data.success && data.pending) {
            if (errorMsgEl) errorMsgEl.textContent = 'Timeout: Agente Local não respondeu. Verifique se o agente está rodando (start_agent.bat).';
            if (errorEl) errorEl.classList.remove('hidden');
            return;
        }
        if (!data.success) {
            if (errorMsgEl) errorMsgEl.textContent = data.error || `Erro ao carregar`;
            if (errorEl) errorEl.classList.remove('hidden');
            return;
        }

        const agregado = data.agregado || {};
        const total = agregado.total || data.total || 0;
        const noPrazo = agregado.no_prazo || 0;
        const foraPrazo = agregado.fora_prazo || 0;
        const semPrevisao = agregado.sem_previsao || 0;
        const porCliente = data.por_cliente || [];
        const porAgente = data.por_agente || [];
        const minutasPorAgente = data.minutas_por_agente || {};
        const minutasPorCliente = _buildMinutasPorCliente(minutasPorAgente);
        window._entregasData = { porCliente, porAgente, minutasPorAgente, minutasPorCliente, agregado, dataInicio: data.data_inicio || dataInicio, dataFim: data.data_fim || dataFim, database: data.database || database };

        if (total === 0) {
            if (errorMsgEl) errorMsgEl.textContent = 'Nenhuma entrega encontrada no período.';
            if (errorEl) errorEl.classList.remove('hidden');
            return;
        }

        if (periodoEl) periodoEl.textContent = `${dataInicio} a ${dataFim} • ${database}`;
        if (totalEl) totalEl.textContent = `Total: ${formatNumber(total)} entregas`;

        // Velocímetro No Prazo: % no prazo (maior = melhor)
        const pctNoPrazo = total ? (noPrazo / total) * 100 : 0;
        const elNoPrazo = document.getElementById('relatorio-entregas-no-prazo-info');
        if (elNoPrazo) elNoPrazo.textContent = `${formatNumber(noPrazo)} entregas (${pctNoPrazo.toFixed(1)}%)`;
        renderEntregasGauge('entregas_gauge_no_prazo', 'chart-entregas-gauge-no-prazo', pctNoPrazo, false);

        // Velocímetro Fora do Prazo: % fora (maior = crítico, invertido)
        const pctForaPrazo = total ? (foraPrazo / total) * 100 : 0;
        const elForaPrazo = document.getElementById('relatorio-entregas-fora-prazo-info');
        if (elForaPrazo) elForaPrazo.textContent = `${formatNumber(foraPrazo)} entregas (${pctForaPrazo.toFixed(1)}%)`;
        renderEntregasGauge('entregas_gauge_fora_prazo', 'chart-entregas-gauge-fora-prazo', pctForaPrazo, true);

        // Gráfico pizza agregado (3 categorias)
        const ctxPizza = document.getElementById('chart-relatorio-entregas');
        if (ctxPizza) {
            relatorioCharts.entregas = new Chart(ctxPizza, {
                type: 'doughnut',
                data: {
                    labels: ['No Prazo', 'Fora do Prazo', 'Sem Previsão'],
                    datasets: [{
                        data: [noPrazo, foraPrazo, semPrevisao],
                        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(107, 114, 128, 0.8)'],
                        borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)', 'rgb(107, 114, 128)'],
                        borderWidth: 1,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right', labels: { font: { size: 11 } } },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {
                                    const v = ctx.raw || 0;
                                    const pct = total ? ((v / total) * 100).toFixed(1) : 0;
                                    return `${ctx.label}: ${formatNumber(v)} (${pct}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Gráfico comparativo por cliente (top 15)
        const topClientes = porCliente.slice(0, 15);
        const ctxCli = document.getElementById('chart-entregas-por-cliente');
        if (ctxCli && topClientes.length > 0) {
            relatorioCharts.entregas_por_cliente = new Chart(ctxCli, {
                type: 'bar',
                data: {
                    labels: topClientes.map(c => (c.cliente || '').length > 25 ? (c.cliente || '').substring(0, 25) + '...' : (c.cliente || '')),
                    datasets: [
                        { label: 'No Prazo', data: topClientes.map(c => c.no_prazo || 0), backgroundColor: 'rgba(34, 197, 94, 0.7)', borderColor: 'rgb(34, 197, 94)', borderWidth: 1 },
                        { label: 'Fora do Prazo', data: topClientes.map(c => c.fora_prazo || 0), backgroundColor: 'rgba(239, 68, 68, 0.7)', borderColor: 'rgb(239, 68, 68)', borderWidth: 1 },
                        { label: 'Sem Previsão', data: topClientes.map(c => c.sem_previsao || 0), backgroundColor: 'rgba(107, 114, 128, 0.7)', borderColor: 'rgb(107, 114, 128)', borderWidth: 1 },
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: { legend: { position: 'top' } },
                    scales: {
                        x: { stacked: true, beginAtZero: true },
                        y: { stacked: true }
                    }
                }
            });
        }

        // Gráfico ranking cliente por performance (% No Prazo)
        const rankingClientes = [...porCliente].filter(c => (c.total || 0) > 0).map(c => ({
            cliente: c.cliente || '',
            pct: ((c.no_prazo || 0) / (c.total || 1) * 100),
            total: c.total || 0
        })).sort((a, b) => b.pct - a.pct).slice(0, 15);
        const ctxRank = document.getElementById('chart-entregas-ranking-cliente');
        if (ctxRank && relatorioCharts.entregas_ranking_cliente) {
            try { relatorioCharts.entregas_ranking_cliente.destroy(); } catch (e) {}
        }
        if (ctxRank && rankingClientes.length > 0) {
            relatorioCharts.entregas_ranking_cliente = new Chart(ctxRank, {
                type: 'bar',
                data: {
                    labels: rankingClientes.map(c => (c.cliente || '').length > 25 ? (c.cliente || '').substring(0, 25) + '...' : (c.cliente || '')),
                    datasets: [{
                        label: '% No Prazo',
                        data: rankingClientes.map(c => c.pct),
                        backgroundColor: rankingClientes.map(c => c.pct >= 90 ? 'rgba(34, 197, 94, 0.8)' : c.pct >= 70 ? 'rgba(250, 204, 21, 0.8)' : 'rgba(239, 68, 68, 0.8)'),
                        borderColor: rankingClientes.map(c => c.pct >= 90 ? 'rgb(34, 197, 94)' : c.pct >= 70 ? 'rgb(250, 204, 21)' : 'rgb(239, 68, 68)'),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { min: 0, max: 100, ticks: { callback: v => v + '%' } },
                        y: {}
                    }
                }
            });
        }

        // Popular filtros
        const selAgente = document.getElementById('filtro-entregas-agente');
        const selCliente = document.getElementById('filtro-entregas-cliente');
        if (selAgente) {
            selAgente.innerHTML = '<option value="">Todos os Agentes</option>' + porAgente.map(ag => `<option value="${escapeHtml(ag.agente || '')}">${escapeHtml(ag.agente || '')}</option>`).join('');
        }
        if (selCliente) {
            selCliente.innerHTML = '<option value="">Todos os Clientes</option>' + porCliente.map(c => `<option value="${escapeHtml(c.cliente || '')}">${escapeHtml((c.cliente || '').length > 35 ? (c.cliente || '').substring(0, 35) + '...' : (c.cliente || ''))}</option>`).join('');
        }

        // Tabela Resumo por Cliente (No Prazo e Fora do Prazo clicáveis)
        const tbodyClientes = document.getElementById('relatorio-entregas-clientes-tbody');
        if (tbodyClientes) {
            tbodyClientes.innerHTML = porCliente.map(c => {
                const t = c.total || 1;
                const pct = ((c.no_prazo || 0) / t * 100).toFixed(1);
                const cliEsc = (c.cliente || '').replace(/"/g, '&quot;');
                const noPrazo = c.no_prazo || 0;
                const foraPrazo = c.fora_prazo || 0;
                const semPrev = c.sem_previsao || 0;
                const noPrazoCell = noPrazo > 0 ? `<span class="cursor-pointer hover:underline" data-cliente="${cliEsc}" data-status="no_prazo" title="Clique para ver minutas">${formatNumber(noPrazo)}</span>` : formatNumber(0);
                const foraPrazoCell = foraPrazo > 0 ? `<span class="cursor-pointer hover:underline" data-cliente="${cliEsc}" data-status="fora_prazo" title="Clique para ver minutas">${formatNumber(foraPrazo)}</span>` : formatNumber(0);
                const semPrevCell = semPrev > 0 ? `<span class="cursor-pointer hover:underline" data-cliente="${cliEsc}" data-status="sem_previsao" title="Clique para ver minutas">${formatNumber(semPrev)}</span>` : formatNumber(0);
                return `<tr class="hover:bg-muted/30">
                    <td class="px-3 py-2 font-medium">${escapeHtml(c.cliente || '')}</td>
                    <td class="px-3 py-2 text-right text-emerald-600">${noPrazoCell}</td>
                    <td class="px-3 py-2 text-right text-red-600">${foraPrazoCell}</td>
                    <td class="px-3 py-2 text-right text-muted-foreground">${semPrevCell}</td>
                    <td class="px-3 py-2 text-right font-medium">${formatNumber(t)}</td>
                    <td class="px-3 py-2 text-right">${pct}%</td>
                </tr>`;
            }).join('') || '<tr><td colspan="6" class="px-3 py-4 text-center text-muted-foreground">Nenhum cliente no período</td></tr>';
            tbodyClientes.querySelectorAll('[data-cliente][data-status]').forEach(el => {
                el.onclick = (e) => { e.stopPropagation(); abrirModalMinutasCliente(el.getAttribute('data-cliente'), el.getAttribute('data-status')); };
            });
        }

        // Tabela por agente (nome clicável=todas minutas; No Prazo/Fora clicáveis=filtrar)
        const tbody = document.getElementById('relatorio-entregas-agentes-tbody');
        if (tbody) {
            tbody.innerHTML = porAgente.map(ag => {
                const t = ag.total || 1;
                const pct = ((ag.no_prazo || 0) / t * 100).toFixed(1);
                const agNome = (ag.agente || '').replace(/"/g, '&quot;');
                const noPrazo = ag.no_prazo || 0;
                const foraPrazo = ag.fora_prazo || 0;
                const semPrev = ag.sem_previsao || 0;
                const noPrazoCell = noPrazo > 0 ? `<span class="cursor-pointer hover:underline" data-agente="${agNome}" data-status="no_prazo" title="Clique para ver minutas">${formatNumber(noPrazo)}</span>` : formatNumber(0);
                const foraPrazoCell = foraPrazo > 0 ? `<span class="cursor-pointer hover:underline" data-agente="${agNome}" data-status="fora_prazo" title="Clique para ver minutas">${formatNumber(foraPrazo)}</span>` : formatNumber(0);
                const semPrevCell = semPrev > 0 ? `<span class="cursor-pointer hover:underline" data-agente="${agNome}" data-status="sem_previsao" title="Clique para ver minutas">${formatNumber(semPrev)}</span>` : formatNumber(0);
                return `<tr class="hover:bg-muted/30">
                    <td class="px-3 py-2 font-medium cursor-pointer" data-agente="${agNome}" title="Clique para ver minutas">${escapeHtml(ag.agente || '')} <i class="fas fa-list text-xs text-muted-foreground"></i></td>
                    <td class="px-3 py-2 text-right text-emerald-600">${noPrazoCell}</td>
                    <td class="px-3 py-2 text-right text-red-600">${foraPrazoCell}</td>
                    <td class="px-3 py-2 text-right text-muted-foreground">${semPrevCell}</td>
                    <td class="px-3 py-2 text-right font-medium">${formatNumber(t)}</td>
                    <td class="px-3 py-2 text-right">${pct}%</td>
                </tr>`;
            }).join('') || '<tr><td colspan="6" class="px-3 py-4 text-center text-muted-foreground">Nenhum agente no período</td></tr>';
            tbody.querySelectorAll('td[data-agente]').forEach(td => {
                td.onclick = () => abrirModalMinutas(td.getAttribute('data-agente'));
            });
            tbody.querySelectorAll('[data-agente][data-status]').forEach(el => {
                el.onclick = (e) => { e.stopPropagation(); abrirModalMinutas(el.getAttribute('data-agente'), el.getAttribute('data-status')); };
            });
        }

        chartWrap.classList.remove('hidden');
    } catch (err) {
        if (loadingEl) loadingEl.classList.add('hidden');
        if (errorMsgEl) errorMsgEl.textContent = err.message || 'Erro ao carregar dados.';
        if (errorEl) errorEl.classList.remove('hidden');
        if (chartWrap) chartWrap.classList.add('hidden');
        console.error('[carregarGraficoEntregas]', err);
    }
}

function _getMinutasPorAgente(agente, minutasPorAgente) {
    if (!agente || !minutasPorAgente) return [];
    const key = String(agente).trim();
    if (minutasPorAgente[key]) return minutasPorAgente[key];
    const keyUpper = key.toUpperCase();
    const found = Object.keys(minutasPorAgente).find(k => String(k).trim().toUpperCase() === keyUpper);
    return found ? minutasPorAgente[found] : [];
}

function _buildMinutasPorCliente(minutasPorAgente) {
    const map = {};
    if (!minutasPorAgente) return map;
    Object.entries(minutasPorAgente).forEach(([ag, arr]) => {
        (arr || []).forEach(m => {
            const cli = (m.cliente || 'N/D').trim() || 'N/D';
            if (!map[cli]) map[cli] = [];
            map[cli].push({ ...m, agente: ag });
        });
    });
    return map;
}

function _filtrarMinutasPorStatus(minutas, status) {
    if (!minutas || !status) return minutas || [];
    const st = (status || '').toUpperCase();
    if (st === 'NO_PRAZO') return minutas.filter(m => /NO PRAZO|ENTREGUE NO PRAZO/.test((m.status || '').toUpperCase()));
    if (st === 'FORA_PRAZO') return minutas.filter(m => /FORA|ENTREGUE FORA/.test((m.status || '').toUpperCase()));
    if (st === 'SEM_PREVISAO') return minutas.filter(m => /SEM PREVISAO|PRAZO CONGELADO/.test((m.status || '').toUpperCase()));
    return minutas;
}

function _renderModalMinutasRows(minutas, agenteContext) {
    return minutas.map(m => {
        const ag = agenteContext || m.agente || '-';
        return `<tr><td class="px-3 py-2">${escapeHtml(String(m.numero || m.id_minuta || '-'))}</td><td class="px-3 py-2">${escapeHtml(m.cte || '-')}</td><td class="px-3 py-2">${escapeHtml(m.ordem_coleta || '-')}</td><td class="px-3 py-2">${escapeHtml(m.cliente || '-')}</td><td class="px-3 py-2">${escapeHtml(ag)}</td><td class="px-3 py-2">${escapeHtml(m.status || '-')}</td></tr>`;
    }).join('') || '<tr><td colspan="6" class="px-3 py-4 text-center text-muted-foreground">Nenhuma minuta</td></tr>';
}

function abrirModalMinutas(agente, statusFiltro) {
    const data = window._entregasData;
    if (!data || !agente) return;
    let minutas = _getMinutasPorAgente(agente, data.minutasPorAgente || {});
    minutas = _filtrarMinutasPorStatus(minutas, statusFiltro);
    const label = statusFiltro === 'no_prazo' ? 'No Prazo' : statusFiltro === 'fora_prazo' ? 'Fora do Prazo' : statusFiltro === 'sem_previsao' ? 'Sem Previsão' : '';
    const titulo = label ? `Minutas de ${agente} - ${label} (${minutas.length})` : `Minutas de ${agente} (${minutas.length})`;
    document.getElementById('modal-minutas-titulo').textContent = titulo;
    const tbody = document.getElementById('modal-minutas-tbody');
    if (tbody) tbody.innerHTML = _renderModalMinutasRows(minutas, agente);
    document.getElementById('modal-entregas-minutas')?.classList.remove('hidden');
}

function abrirModalMinutasCliente(cliente, statusFiltro) {
    const data = window._entregasData;
    if (!data || !cliente) return;
    const minutasPorCliente = data.minutasPorCliente || _buildMinutasPorCliente(data.minutasPorAgente || {});
    const key = String(cliente).trim();
    let minutas = minutasPorCliente[key] || [];
    const keyUpper = key.toUpperCase();
    const found = Object.keys(minutasPorCliente).find(k => String(k).trim().toUpperCase() === keyUpper);
    if (found) minutas = minutasPorCliente[found] || [];
    minutas = _filtrarMinutasPorStatus(minutas, statusFiltro);
    const label = statusFiltro === 'no_prazo' ? 'No Prazo' : statusFiltro === 'fora_prazo' ? 'Fora do Prazo' : statusFiltro === 'sem_previsao' ? 'Sem Previsão' : '';
    const titulo = label ? `Minutas - ${cliente} - ${label} (${minutas.length})` : `Minutas - ${cliente} (${minutas.length})`;
    document.getElementById('modal-minutas-titulo').textContent = titulo;
    const tbody = document.getElementById('modal-minutas-tbody');
    if (tbody) tbody.innerHTML = _renderModalMinutasRows(minutas);
    document.getElementById('modal-entregas-minutas')?.classList.remove('hidden');
}

function fecharModalMinutas(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('modal-entregas-minutas')?.classList.add('hidden');
}

function abrirExpandEntregas(btn) {
    const section = btn.closest('[data-entregas-expand]');
    if (!section) return;
    const titulo = section.getAttribute('data-entregas-expand') || 'Detalhe';
    const body = document.getElementById('modal-expand-body');
    const tituloEl = document.getElementById('modal-expand-titulo');
    if (!body || !tituloEl) return;
    const clone = section.cloneNode(true);
    clone.querySelectorAll('button[onclick*="abrirExpandEntregas"], button[onclick*="toggleEntregas"]').forEach(b => b.remove());
    clone.classList.remove('group');
    const canvases = clone.querySelectorAll('canvas');
    canvases.forEach(clonedCanvas => {
        const origId = clonedCanvas.id;
        const origCanvas = document.getElementById(origId);
        if (origCanvas) {
            const parent = clonedCanvas.parentElement;
            if (parent) parent.style.minHeight = '400px';
            try {
                const img = new Image();
                img.onload = () => {
                    const ctx = clonedCanvas.getContext('2d');
                    clonedCanvas.width = origCanvas.width;
                    clonedCanvas.height = origCanvas.height;
                    if (ctx) ctx.drawImage(img, 0, 0);
                };
                img.src = origCanvas.toDataURL('image/png');
            } catch (e) { console.warn('[expand] canvas copy:', e); }
        }
    });
    body.innerHTML = '';
    body.appendChild(clone);
    tituloEl.textContent = titulo;
    document.getElementById('modal-entregas-expand')?.classList.remove('hidden');
}

function fecharModalExpandEntregas(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('modal-entregas-expand')?.classList.add('hidden');
}

function toggleEntregasPerformanceAgente() {
    const body = document.getElementById('entregas-performance-agente-body');
    const btn = document.getElementById('btn-toggle-performance-agente');
    if (!body || !btn) return;
    const hidden = body.classList.toggle('hidden');
    btn.querySelector('i')?.classList.toggle('fa-chevron-down', !hidden);
    btn.querySelector('i')?.classList.toggle('fa-chevron-up', hidden);
}

function toggleEntregasResumoCliente() {
    const body = document.getElementById('entregas-resumo-cliente-body');
    const btn = document.getElementById('btn-toggle-resumo-cliente');
    if (!body || !btn) return;
    const hidden = body.classList.toggle('hidden');
    btn.querySelector('i')?.classList.toggle('fa-chevron-down', !hidden);
    btn.querySelector('i')?.classList.toggle('fa-chevron-up', hidden);
}

function aplicarFiltrosEntregas() {
    const data = window._entregasData;
    if (!data) return;
    const filtroAgente = document.getElementById('filtro-entregas-agente')?.value || '';
    const filtroCliente = document.getElementById('filtro-entregas-cliente')?.value || '';
    let porCliente = data.porCliente || [];
    let porAgente = data.porAgente || [];
    const minutasPorAgente = data.minutasPorAgente || {};
    if (filtroAgente) {
        porAgente = porAgente.filter(a => (a.agente || '') === filtroAgente);
        let minutas = _getMinutasPorAgente(filtroAgente, minutasPorAgente);
        if (filtroCliente) minutas = minutas.filter(m => (m.cliente || '') === filtroCliente);
        const clienteMap = {};
        minutas.forEach(m => {
            const cli = m.cliente || 'N/D';
            if (!clienteMap[cli]) clienteMap[cli] = { no_prazo: 0, fora_prazo: 0, sem_previsao: 0 };
            const st = (m.status || '').toUpperCase();
            if (st.includes('NO PRAZO') || st.includes('ENTREGUE NO PRAZO')) clienteMap[cli].no_prazo++;
            else if (st.includes('FORA') || st.includes('ENTREGUE FORA')) clienteMap[cli].fora_prazo++;
            else clienteMap[cli].sem_previsao++;
        });
        porCliente = Object.entries(clienteMap).map(([cliente, v]) => ({ cliente, ...v, total: v.no_prazo + v.fora_prazo + v.sem_previsao }));
        porCliente.sort((a, b) => (b.total || 0) - (a.total || 0));
    }
    if (filtroCliente && !filtroAgente) {
        porCliente = porCliente.filter(c => (c.cliente || '') === filtroCliente);
        const agenteMap = {};
        const minutasKeys = Object.keys(minutasPorAgente || {});
        minutasKeys.forEach(ag => {
            const minutas = minutasPorAgente[ag] || [];
            minutas.filter(m => (m.cliente || '') === filtroCliente).forEach(m => {
                if (!agenteMap[ag]) agenteMap[ag] = { no_prazo: 0, fora_prazo: 0, sem_previsao: 0 };
                const st = (m.status || '').toUpperCase();
                if (st.includes('NO PRAZO') || st.includes('ENTREGUE NO PRAZO')) agenteMap[ag].no_prazo++;
                else if (st.includes('FORA') || st.includes('ENTREGUE FORA')) agenteMap[ag].fora_prazo++;
                else agenteMap[ag].sem_previsao++;
            });
        });
        porAgente = Object.entries(agenteMap).map(([agente, v]) => ({ agente, ...v, total: v.no_prazo + v.fora_prazo + v.sem_previsao }));
        porAgente.sort((a, b) => (b.total || 0) - (a.total || 0));
    }
    const total = porCliente.reduce((s, c) => s + (c.total || 0), 0) || porAgente.reduce((s, a) => s + (a.total || 0), 0);
    const noPrazo = porCliente.reduce((s, c) => s + (c.no_prazo || 0), 0) || porAgente.reduce((s, a) => s + (a.no_prazo || 0), 0);
    const foraPrazo = porCliente.reduce((s, c) => s + (c.fora_prazo || 0), 0) || porAgente.reduce((s, a) => s + (a.fora_prazo || 0), 0);
    const semPrevisao = porCliente.reduce((s, c) => s + (c.sem_previsao || 0), 0) || porAgente.reduce((s, a) => s + (a.sem_previsao || 0), 0);
    if (!filtroAgente && !filtroCliente) {
        porCliente = data.porCliente || [];
        porAgente = data.porAgente || [];
    }
    const agregadoFiltrado = { no_prazo: noPrazo, fora_prazo: foraPrazo, sem_previsao: semPrevisao, total };
    const minutasPorCliente = data.minutasPorCliente || _buildMinutasPorCliente(minutasPorAgente);
    renderEntregasComDados({ porCliente, porAgente, agregado: agregadoFiltrado, minutasPorAgente, minutasPorCliente });
}

function renderEntregasComDados(payload) {
    const { porCliente, porAgente, agregado, minutasPorAgente = {}, minutasPorCliente } = payload;
    const total = agregado?.total || 0;
    const noPrazo = agregado?.no_prazo || 0;
    const foraPrazo = agregado?.fora_prazo || 0;
    const semPrevisao = agregado?.sem_previsao || 0;
    const chartWrap = document.getElementById('relatorio-entregas-chart-wrap');
    if (!chartWrap) return;
    const topClientes = porCliente.slice(0, 15);
    const ctxCli = document.getElementById('chart-entregas-por-cliente');
    if (ctxCli && relatorioCharts.entregas_por_cliente) {
        try { relatorioCharts.entregas_por_cliente.destroy(); } catch (e) {}
    }
    if (ctxCli && topClientes.length > 0) {
        relatorioCharts.entregas_por_cliente = new Chart(ctxCli, {
            type: 'bar',
            data: {
                labels: topClientes.map(c => (c.cliente || '').length > 25 ? (c.cliente || '').substring(0, 25) + '...' : (c.cliente || '')),
                datasets: [
                    { label: 'No Prazo', data: topClientes.map(c => c.no_prazo || 0), backgroundColor: 'rgba(34, 197, 94, 0.7)', borderColor: 'rgb(34, 197, 94)', borderWidth: 1 },
                    { label: 'Fora do Prazo', data: topClientes.map(c => c.fora_prazo || 0), backgroundColor: 'rgba(239, 68, 68, 0.7)', borderColor: 'rgb(239, 68, 68)', borderWidth: 1 },
                    { label: 'Sem Previsão', data: topClientes.map(c => c.sem_previsao || 0), backgroundColor: 'rgba(107, 114, 128, 0.7)', borderColor: 'rgb(107, 114, 128)', borderWidth: 1 },
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { position: 'top' } }, scales: { x: { stacked: true, beginAtZero: true }, y: { stacked: true } } }
        });
    }
    // Gráfico ranking cliente por performance (% No Prazo)
    const rankingClientes = [...porCliente].filter(c => (c.total || 0) > 0).map(c => ({
        cliente: c.cliente || '',
        pct: ((c.no_prazo || 0) / (c.total || 1) * 100),
        total: c.total || 0
    })).sort((a, b) => b.pct - a.pct).slice(0, 15);
    const ctxRank = document.getElementById('chart-entregas-ranking-cliente');
    if (ctxRank && relatorioCharts.entregas_ranking_cliente) {
        try { relatorioCharts.entregas_ranking_cliente.destroy(); } catch (e) {}
    }
    if (ctxRank && rankingClientes.length > 0) {
        relatorioCharts.entregas_ranking_cliente = new Chart(ctxRank, {
            type: 'bar',
            data: {
                labels: rankingClientes.map(c => (c.cliente || '').length > 25 ? (c.cliente || '').substring(0, 25) + '...' : (c.cliente || '')),
                datasets: [{
                    label: '% No Prazo',
                    data: rankingClientes.map(c => c.pct),
                    backgroundColor: rankingClientes.map(c => c.pct >= 90 ? 'rgba(34, 197, 94, 0.8)' : c.pct >= 70 ? 'rgba(250, 204, 21, 0.8)' : 'rgba(239, 68, 68, 0.8)'),
                    borderColor: rankingClientes.map(c => c.pct >= 90 ? 'rgb(34, 197, 94)' : c.pct >= 70 ? 'rgb(250, 204, 21)' : 'rgb(239, 68, 68)'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: { min: 0, max: 100, ticks: { callback: v => v + '%' } },
                    y: {}
                }
            }
        });
    }
    const tbodyClientes = document.getElementById('relatorio-entregas-clientes-tbody');
    if (tbodyClientes) {
        const mpc = minutasPorCliente || _buildMinutasPorCliente(minutasPorAgente);
        tbodyClientes.innerHTML = porCliente.map(c => {
            const t = c.total || 1;
            const pct = ((c.no_prazo || 0) / t * 100).toFixed(1);
            const cliEsc = (c.cliente || '').replace(/"/g, '&quot;');
            const noPrazo = c.no_prazo || 0;
            const foraPrazo = c.fora_prazo || 0;
            const semPrev = c.sem_previsao || 0;
            const noPrazoCell = noPrazo > 0 ? `<span class="cursor-pointer hover:underline" data-cliente="${cliEsc}" data-status="no_prazo" title="Clique para ver minutas">${formatNumber(noPrazo)}</span>` : formatNumber(0);
            const foraPrazoCell = foraPrazo > 0 ? `<span class="cursor-pointer hover:underline" data-cliente="${cliEsc}" data-status="fora_prazo" title="Clique para ver minutas">${formatNumber(foraPrazo)}</span>` : formatNumber(0);
            const semPrevCell = semPrev > 0 ? `<span class="cursor-pointer hover:underline" data-cliente="${cliEsc}" data-status="sem_previsao" title="Clique para ver minutas">${formatNumber(semPrev)}</span>` : formatNumber(0);
            return `<tr class="hover:bg-muted/30"><td class="px-3 py-2 font-medium">${escapeHtml(c.cliente || '')}</td><td class="px-3 py-2 text-right text-emerald-600">${noPrazoCell}</td><td class="px-3 py-2 text-right text-red-600">${foraPrazoCell}</td><td class="px-3 py-2 text-right text-muted-foreground">${semPrevCell}</td><td class="px-3 py-2 text-right font-medium">${formatNumber(t)}</td><td class="px-3 py-2 text-right">${pct}%</td></tr>`;
        }).join('') || '<tr><td colspan="6" class="px-3 py-4 text-center text-muted-foreground">Nenhum cliente</td></tr>';
        tbodyClientes.querySelectorAll('[data-cliente][data-status]').forEach(el => {
            el.onclick = (e) => { e.stopPropagation(); abrirModalMinutasCliente(el.getAttribute('data-cliente'), el.getAttribute('data-status')); };
        });
    }
    const tbody = document.getElementById('relatorio-entregas-agentes-tbody');
    if (tbody) {
        tbody.innerHTML = porAgente.map(ag => {
            const t = ag.total || 1;
            const pct = ((ag.no_prazo || 0) / t * 100).toFixed(1);
            const agNome = (ag.agente || '').replace(/"/g, '&quot;');
            const noPrazo = ag.no_prazo || 0;
            const foraPrazo = ag.fora_prazo || 0;
            const semPrev = ag.sem_previsao || 0;
            const noPrazoCell = noPrazo > 0 ? `<span class="cursor-pointer hover:underline" data-agente="${agNome}" data-status="no_prazo" title="Clique para ver minutas">${formatNumber(noPrazo)}</span>` : formatNumber(0);
            const foraPrazoCell = foraPrazo > 0 ? `<span class="cursor-pointer hover:underline" data-agente="${agNome}" data-status="fora_prazo" title="Clique para ver minutas">${formatNumber(foraPrazo)}</span>` : formatNumber(0);
            const semPrevCell = semPrev > 0 ? `<span class="cursor-pointer hover:underline" data-agente="${agNome}" data-status="sem_previsao" title="Clique para ver minutas">${formatNumber(semPrev)}</span>` : formatNumber(0);
            return `<tr class="hover:bg-muted/30"><td class="px-3 py-2 font-medium cursor-pointer" data-agente="${agNome}" title="Clique para ver minutas">${escapeHtml(ag.agente || '')} <i class="fas fa-list text-xs text-muted-foreground"></i></td><td class="px-3 py-2 text-right text-emerald-600">${noPrazoCell}</td><td class="px-3 py-2 text-right text-red-600">${foraPrazoCell}</td><td class="px-3 py-2 text-right text-muted-foreground">${semPrevCell}</td><td class="px-3 py-2 text-right font-medium">${formatNumber(t)}</td><td class="px-3 py-2 text-right">${pct}%</td></tr>`;
        }).join('') || '<tr><td colspan="6" class="px-3 py-4 text-center text-muted-foreground">Nenhum agente</td></tr>';
        tbody.querySelectorAll('td[data-agente]').forEach(td => {
            if (!td.querySelector('[data-status]')) td.onclick = () => abrirModalMinutas(td.getAttribute('data-agente'));
        });
        tbody.querySelectorAll('[data-agente][data-status]').forEach(el => {
            el.onclick = (e) => { e.stopPropagation(); abrirModalMinutas(el.getAttribute('data-agente'), el.getAttribute('data-status')); };
        });
    }
    const totalEl = document.getElementById('relatorio-entregas-total');
    if (totalEl) totalEl.textContent = `Total: ${formatNumber(total)} entregas`;
    const elNoPrazo = document.getElementById('relatorio-entregas-no-prazo-info');
    const elForaPrazo = document.getElementById('relatorio-entregas-fora-prazo-info');
    if (elNoPrazo) elNoPrazo.textContent = `${formatNumber(noPrazo)} entregas (${total ? (noPrazo / total * 100).toFixed(1) : 0}%)`;
    if (elForaPrazo) elForaPrazo.textContent = `${formatNumber(foraPrazo)} entregas (${total ? (foraPrazo / total * 100).toFixed(1) : 0}%)`;
    if (relatorioCharts.entregas) {
        relatorioCharts.entregas.data.datasets[0].data = [noPrazo, foraPrazo, semPrevisao];
        relatorioCharts.entregas.update();
    }
    renderEntregasGauge('entregas_gauge_no_prazo', 'chart-entregas-gauge-no-prazo', total ? (noPrazo / total) * 100 : 0, false);
    renderEntregasGauge('entregas_gauge_fora_prazo', 'chart-entregas-gauge-fora-prazo', total ? (foraPrazo / total) * 100 : 0, true);
}

/**
 * Renderiza velocímetro de entregas.
 * @param {boolean} invertido - Se true (fora do prazo): 0=ok, 100=crítico (cores invertidas)
 */
function renderEntregasGauge(chartKey, canvasId, value, invertido) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (relatorioCharts[chartKey]) {
        try { relatorioCharts[chartKey].destroy(); } catch (e) {}
        delete relatorioCharts[chartKey];
    }

    const wrapper = ctx.closest('[data-gauge-wrapper]');
    const syncSize = () => {
        if (!wrapper) return;
        const w = Math.round(wrapper.clientWidth || wrapper.getBoundingClientRect().width || 0);
        if (!w) return;
        const h = Number(wrapper.dataset.gaugeHeight) || 200;
        wrapper.style.height = h + 'px';
    };
    syncSize();

    const safeValue = Number.isFinite(value) ? value : 0;
    const valueClamped = Math.max(0, Math.min(safeValue, 100));

    const segmentColors = invertido
        ? ['#4ade80', '#fef08a', '#fde047', '#fb923c', '#f87171']  // 0=verde, 100=vermelho
        : ['#f87171', '#fb923c', '#fde047', '#fef08a', '#4ade80']; // 0=vermelho, 100=verde

    const segments = [20, 20, 20, 20, 20];
    const gaugeNeedlePlugin = {
        id: 'gaugeNeedle',
        afterDraw(chart) {
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return;
            const cx = (chartArea.left + chartArea.right) / 2;
            const cy = chartArea.bottom - 6;
            const r = Math.min((chartArea.right - chartArea.left) / 2, (chartArea.bottom - chartArea.top));
            const angle = Math.PI + (Math.PI * (valueClamped / 100));
            c.save();
            c.translate(cx, cy);
            c.rotate(angle);
            c.beginPath();
            c.moveTo(0, -4);
            c.lineTo(r * 0.82, 0);
            c.lineTo(0, 4);
            c.fillStyle = '#111827';
            c.fill();
            c.restore();
            c.beginPath();
            c.arc(cx, cy, 6, 0, Math.PI * 2);
            c.fillStyle = '#111827';
            c.fill();
        }
    };

    relatorioCharts[chartKey] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['A', 'B', 'C', 'D', 'E'],
            datasets: [{
                data: segments,
                backgroundColor: segmentColors,
                borderWidth: 0,
            }]
        },
        options: {
            circumference: 180,
            rotation: 270,
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        },
        plugins: [gaugeNeedlePlugin]
    });
}

function popularFiltroVendedor(vendedores) {
    relatorioTodosVendedores = vendedores || [];
    const select = document.getElementById('filtro-vendedor-grafico');
    if (!select) return;
    
    // Limpar opções existentes (exceto "Todos")
    select.innerHTML = '<option value="">Todos os Vendedores</option>';
    
    // Adicionar vendedores
    vendedores.forEach(vendedor => {
        const option = document.createElement('option');
        option.value = vendedor.nome;
        option.textContent = vendedor.nome;
        select.appendChild(option);
    });
}

function filtrarGraficosPorVendedor() {
    const vendedorSelecionado = document.getElementById('filtro-vendedor-grafico')?.value;
    
    if (!vendedorSelecionado) {
        // Mostrar gráficos gerais
        renderGraficosVendedores(relatorioTodosVendedores);
    } else {
        // Mostrar gráficos específicos do vendedor por cliente
        renderGraficosVendedorPorCliente(vendedorSelecionado);
    }
}

function renderGraficosVendedorPorCliente(nomeVendedor) {
    // Destruir apenas os gráficos de vendedores (preservar gauge_frete, gauge_custos, etc.)
    const vendedoresChartKeys = ['resultado', 'operacoes', 'custos', 'margem', 'gauge_margem', 'gauge_ebtida'];
    vendedoresChartKeys.forEach((key) => {
        if (relatorioCharts[key]) {
            relatorioCharts[key].destroy();
            delete relatorioCharts[key];
        }
    });

    // Filtrar registros do vendedor
    const registrosVendedor = relatorioRegistros.filter(r => (r.vendedor || 'Sem vendedor') === nomeVendedor);
    if (registrosVendedor.length === 0) return;

    const { metaValor, metaPercentual } = getRelatorioMetaSettings();

    // Agrupar por cliente
    const clientesMap = new Map();
    registrosVendedor.forEach(reg => {
        const clienteKey = reg.cliente || 'Cliente não informado';
        if (!clientesMap.has(clienteKey)) {
            clientesMap.set(clienteKey, {
                nome: clienteKey,
                operacoes: 0,
                valorTotal: 0,
                resultadoTotal: 0,
                custosTotal: 0,
                impostosTotal: 0,
                receitaTotal: 0
            });
        }
        const cliente = clientesMap.get(clienteKey);
        cliente.operacoes += reg.quantidade || 1;
        cliente.valorTotal += reg.valor || 0;
        cliente.resultadoTotal += reg.resultado || 0;
        cliente.custosTotal += reg.custos || 0;
        cliente.impostosTotal += reg.impostos || 0;
        cliente.receitaTotal += reg.receita || reg.valor || 0;
    });

    const clientes = Array.from(clientesMap.values())
        .map(c => ({
            ...c,
            margemPercentual: c.receitaTotal ? (c.resultadoTotal / c.receitaTotal) * 100 : 0
        }))
        .sort((a, b) => b.valorTotal - a.valorTotal)
        .slice(0, 8); // Top 8 clientes

    const labels = clientes.map(c => c.nome.length > 18 ? c.nome.substring(0, 18) + '...' : c.nome);

    // Gráfico 1: Resultado por Cliente
    const ctx1 = document.getElementById('chart-vendedores-resultado');
    if (ctx1) {
        const resultadoDatasets = [{
            label: 'Resultado (R$)',
            data: clientes.map(c => c.resultadoTotal),
            backgroundColor: clientes.map(c => c.resultadoTotal >= 0 ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'),
            borderColor: clientes.map(c => c.resultadoTotal >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'),
            borderWidth: 1
        }];
        if (metaValor > 0) {
            resultadoDatasets.push({
                type: 'line',
                label: 'Meta (R$)',
                data: labels.map(() => metaValor),
                borderColor: 'rgba(99, 102, 241, 0.9)',
                borderDash: [6, 4],
                borderWidth: 2,
                pointRadius: 0,
                tension: 0
            });
        }
        relatorioCharts.resultado = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: resultadoDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: { top: 10, bottom: 10, left: 10, right: 10 }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Resultado: ' + formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 0,
                            minRotation: 0,
                            font: { size: 11 },
                            autoSkip: true,
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                            },
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }

    // Gráfico 2: Distribuição de Operações
    const ctx2 = document.getElementById('chart-vendedores-operacoes');
    if (ctx2) {
        relatorioCharts.operacoes = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: clientes.map(c => c.operacoes),
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(251, 191, 36, 0.7)',
                        'rgba(239, 68, 68, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(236, 72, 153, 0.7)',
                        'rgba(20, 184, 166, 0.7)', 'rgba(245, 158, 11, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: { top: 10, bottom: 10, left: 10, right: 10 }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            boxWidth: 12, 
                            font: { size: 10 }, 
                            padding: 10, 
                            usePointStyle: true,
                            maxWidth: 200,
                            textAlign: 'left'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = clientes.reduce((acc, c) => acc + c.operacoes, 0);
                                const percent = ((context.parsed / total) * 100).toFixed(1);
                                return context.label + ': ' + context.parsed + ' (' + percent + '%)';
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico 3: Custos vs Receita
    const ctx3 = document.getElementById('chart-vendedores-custos');
    if (ctx3) {
        relatorioCharts.custos = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Receita',
                        data: clientes.map(c => c.receitaTotal),
                        backgroundColor: 'rgba(34, 197, 94, 0.7)',
                        borderColor: 'rgb(34, 197, 94)',
                        borderWidth: 1
                    },
                    {
                        label: 'Custos',
                        data: clientes.map(c => c.custosTotal + c.impostosTotal),
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: 'rgb(239, 68, 68)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: { top: 10, bottom: 10, left: 10, right: 10 }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { font: { size: 10 }, padding: 8 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 0,
                            minRotation: 0,
                            font: { size: 11 },
                            autoSkip: true,
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                            },
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }

    // Gráfico 4: Margem de Lucro (%)
    const ctx4 = document.getElementById('chart-vendedores-margem');
    if (ctx4) {
        const margemDatasets = [{
            label: 'Margem (%)',
            data: clientes.map(c => c.margemPercentual),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
        }];
        if (metaPercentual > 0) {
            margemDatasets.push({
                label: 'Meta (%)',
                data: labels.map(() => metaPercentual),
                borderColor: 'rgba(16, 185, 129, 0.9)',
                borderDash: [6, 4],
                borderWidth: 2,
                pointRadius: 0,
                tension: 0,
                fill: false
            });
        }
        relatorioCharts.margem = new Chart(ctx4, {
            type: 'line',
            data: {
                labels: labels,
                datasets: margemDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: { top: 10, bottom: 10, left: 10, right: 10 }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Margem: ' + context.parsed.y.toFixed(2) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 0,
                            minRotation: 0,
                            font: { size: 11 },
                            autoSkip: true,
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            },
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico 5: EBTIDA por Cliente (se existir o canvas)
    const ctx5 = document.getElementById('chart-ebtida-vendedores');
    if (ctx5) {
        // Calcular EBTIDA para cada cliente
        const ebtidaData = clientes.map(c => {
            const ebtida = c.receitaTotal - c.custosTotal - c.impostosTotal;
            return ebtida;
        });
        
        relatorioCharts.ebtida = new Chart(ctx5, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'EBTIDA (R$)',
                    data: ebtidaData,
                    backgroundColor: ebtidaData.map(e => e >= 0 ? 'rgba(59, 130, 246, 0.7)' : 'rgba(239, 68, 68, 0.7)'),
                    borderColor: ebtidaData.map(e => e >= 0 ? 'rgb(59, 130, 246)' : 'rgb(239, 68, 68)'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: { top: 10, bottom: 30, left: 10, right: 10 }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'EBTIDA: ' + formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 0,
                            minRotation: 0,
                            font: { size: 9 },
                            autoSkip: true,
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                            },
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }

    const vendedorResumo = relatorioTodosVendedores.find(v => v.nome === nomeVendedor);
    if (vendedorResumo) {
        renderGaugeChart('gauge_margem', 'chart-vendedores-gauge-margem', vendedorResumo.margemPercentual || 0, 'Margem (%)');
        renderGaugeChart('gauge_ebtida', 'chart-vendedores-gauge-ebtida', vendedorResumo.ebtidaPercentual || 0, 'EBTIDA (%)');
    }
}

function renderGaugeChart(chartKey, canvasId, value, label, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (relatorioCharts[chartKey]) {
        relatorioCharts[chartKey].destroy();
        delete relatorioCharts[chartKey];
    }

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    const wrapper = ctx.closest('[data-gauge-wrapper]');
    const infoEl = document.querySelector(`[data-gauge-info-for="${canvasId}"]`);
    const detailEl = document.querySelector(`[data-gauge-detail-for="${canvasId}"]`);
    const syncGaugeSize = (chart) => {
        if (!wrapper) return false;
        const width = Math.round(wrapper.clientWidth || wrapper.getBoundingClientRect().width || 0);
        if (!width) return false;
        const fixedHeight = Number(wrapper.dataset.gaugeHeight) || 0;
        const height = fixedHeight || Math.max(240, Math.min(420, Math.round(width / 2)));
        wrapper.style.height = `${height}px`;
        ctx.width = width;
        ctx.height = height;
        ctx.style.width = '100%';
        ctx.style.height = '100%';
        if (chart) {
            chart.resize();
            chart.update();
        }
        return true;
    };
    syncGaugeSize();

    const safeValue = Number.isFinite(value) ? value : 0;
    const maxValue = 100;
    const valueClamped = Math.max(0, Math.min(safeValue, maxValue));
    const status =
        valueClamped >= 80 ? 'Bom'
        : valueClamped >= 60 ? 'Atenção'
        : 'Crítico';
    const valueText = options.valueText || `${valueClamped.toFixed(1)}%`;
    if (infoEl) infoEl.textContent = valueText;
    if (detailEl) {
        const metaLine = options.metaText ? `<div class="mt-1">${options.metaText}</div>` : '';
        const detailHtml = options.detailHtml
            || `${label}: <strong>${valueText}</strong> · Status: <strong>${status}</strong>${metaLine}`;
        detailEl.innerHTML = detailHtml;
    }
    const segments = [20, 20, 20, 20, 20];
    const segmentLabels = ['Nível E', 'Nível D', 'Nível C', 'Nível B', 'Nível A'];
    const segmentRanges = ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'];
    const segmentColors = [
        '#f87171', // E
        '#fb923c', // D
        '#fde047', // C
        '#fef08a', // B
        '#4ade80'  // A
    ];

    const gaugeNeedlePlugin = {
        id: 'gaugeNeedle',
        afterDraw(chart) {
            const { ctx, chartArea } = chart;
            if (!chartArea) return;
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = chartArea.bottom - 6;
            const radius = Math.min(
                (chartArea.right - chartArea.left) / 2,
                (chartArea.bottom - chartArea.top)
            );
            // Semicírculo horizontal: esquerda (pi) -> direita (2pi)
            const angle = Math.PI + (Math.PI * (valueClamped / maxValue));

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, -4);
            ctx.lineTo(radius * 0.82, 0);
            ctx.lineTo(0, 4);
            ctx.fillStyle = '#111827';
            ctx.fill();
            ctx.restore();

            // Center dot
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#111827';
            ctx.fill();
            ctx.restore();

        }
    };

    relatorioCharts[chartKey] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: segmentLabels,
            datasets: [{
                data: segments,
                radius: '100%',
                backgroundColor: (context) => {
                    const { chart, dataIndex } = context;
                    const { ctx, chartArea } = chart;
                    const base = segmentColors[dataIndex] || '#e2e8f0';
                    if (!chartArea) return base;
                    const gradient = ctx.createLinearGradient(
                        chartArea.left,
                        chartArea.top,
                        chartArea.right,
                        chartArea.bottom
                    );
                    gradient.addColorStop(0, `${base}cc`);
                    gradient.addColorStop(1, `${base}66`);
                    return gradient;
                },
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.7)',
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { top: 0, bottom: 0, left: 0, right: 0 }
            },
            rotation: -90,
            circumference: 180,
            cutout: '65%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        title: (items) => items?.[0]?.label || '',
                        label: (item) => segmentRanges[item.dataIndex] || ''
                    }
                }
            }
        },
        plugins: [gaugeNeedlePlugin]
    });

    if (wrapper && !wrapper._gaugeObserver) {
        const observer = new ResizeObserver(() => {
            syncGaugeSize(relatorioCharts[chartKey]);
        });
        observer.observe(wrapper);
        wrapper._gaugeObserver = observer;
    }
    requestAnimationFrame(() => syncGaugeSize(relatorioCharts[chartKey]));

    const clickTarget = wrapper || ctx;
    if (canvasId !== 'chart-gauge-frete' && clickTarget && !clickTarget.dataset.gaugeClickBound) {
        clickTarget.dataset.gaugeClickBound = 'true';
        clickTarget.style.cursor = 'pointer';
        clickTarget.addEventListener('click', () => {
            if (!detailEl) return;
            detailEl.classList.toggle('hidden');
        });
    }
}

function renderGraficosVendedores(vendedores) {
    // Destruir apenas os gráficos de vendedores (não os velocímetros dos cards: gauge_frete, gauge_custos, gauge_impostos, gauge_margem_global)
    const vendedoresChartKeys = ['resultado', 'operacoes', 'custos', 'margem', 'gauge_margem', 'gauge_ebtida'];
    vendedoresChartKeys.forEach((key) => {
        if (relatorioCharts[key]) {
            relatorioCharts[key].destroy();
            delete relatorioCharts[key];
        }
    });

    if (!vendedores || vendedores.length === 0) return;

    const { metaValor, metaPercentual } = getRelatorioMetaSettings();

    // Limitar a 10 vendedores para melhor visualização, mas ajustar labels conforme necessário
    const topVendedores = vendedores.slice(0, 10);
    // Truncar nomes para caber na horizontal: 8 caracteres para gráficos de barras
    const labels = topVendedores.map(v => {
        const nome = v.nome || 'Sem vendedor';
        return nome.length > 8 ? nome.substring(0, 8) + '...' : nome;
    });
    
    // Labels sempre na horizontal
    const rotacaoLabels = 0;
    const paddingBottom = 30; // Espaço para labels horizontais
    const fontSize = 9; // Fonte menor para caber mais nomes
    
    // Gráfico 1: Resultado por Vendedor
    const ctx1 = document.getElementById('chart-vendedores-resultado');
    if (ctx1) {
        const resultadoDatasets = [{
            label: 'Resultado (R$)',
            data: topVendedores.map(v => v.resultadoTotal),
            backgroundColor: topVendedores.map(v => v.resultadoTotal >= 0 ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'),
            borderColor: topVendedores.map(v => v.resultadoTotal >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'),
            borderWidth: 1
        }];
        if (metaValor > 0) {
            resultadoDatasets.push({
                type: 'line',
                label: 'Meta (R$)',
                data: labels.map(() => metaValor),
                borderColor: 'rgba(99, 102, 241, 0.9)',
                borderDash: [6, 4],
                borderWidth: 2,
                pointRadius: 0,
                tension: 0
            });
        }
        relatorioCharts.resultado = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: resultadoDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        bottom: paddingBottom,
                        left: 10,
                        right: 10
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                // Mostrar nome completo no tooltip
                                const index = context[0].dataIndex;
                                return topVendedores[index]?.nome || 'Sem vendedor';
                            },
                            label: function(context) {
                                return 'Resultado: ' + formatCurrency(context.parsed.y);
                            }
                        }
                    },
                    onClick: function(evt, elements) {
                        if (elements.length > 0) {
                            const element = elements[0];
                            const index = element.index;
                            showChartDetail('resultado', topVendedores[index]);
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: rotacaoLabels,
                            minRotation: rotacaoLabels,
                            font: { size: fontSize },
                            autoSkip: false,
                            maxTicksLimit: topVendedores.length
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                            },
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }

    // Gráfico 2: Distribuição de Operações
    const ctx2 = document.getElementById('chart-vendedores-operacoes');
    if (ctx2) {
        relatorioCharts.operacoes = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: topVendedores.map(v => v.operacoes),
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(251, 191, 36, 0.7)',
                        'rgba(239, 68, 68, 0.7)',
                        'rgba(139, 92, 246, 0.7)',
                        'rgba(236, 72, 153, 0.7)',
                        'rgba(20, 184, 166, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(249, 115, 22, 0.7)',
                        'rgba(168, 85, 247, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            boxWidth: 12, 
                            font: { size: 10 },
                            padding: 10,
                            usePointStyle: true,
                            maxWidth: 200,
                            textAlign: 'left'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = topVendedores.reduce((acc, v) => acc + v.operacoes, 0);
                                const percent = ((context.parsed / total) * 100).toFixed(1);
                                return context.label + ': ' + context.parsed + ' (' + percent + '%)';
                            }
                        }
                    },
                    onClick: function(evt, elements) {
                        if (elements.length > 0) {
                            const element = elements[0];
                            const index = element.index;
                            showChartDetail('operacoes', topVendedores[index]);
                        }
                    }
                }
            }
        });
    }

    const margemMedia = topVendedores.length
        ? topVendedores.reduce((acc, v) => acc + (v.margemPercentual || 0), 0) / topVendedores.length
        : 0;
    const ebtidaMedia = topVendedores.length
        ? topVendedores.reduce((acc, v) => acc + (v.ebtidaPercentual || 0), 0) / topVendedores.length
        : 0;
    renderGaugeChart('gauge_margem', 'chart-vendedores-gauge-margem', margemMedia, 'Margem (%)');
    renderGaugeChart('gauge_ebtida', 'chart-vendedores-gauge-ebtida', ebtidaMedia, 'EBTIDA (%)');

    // Gráfico 3: Custos vs Receita
    const ctx3 = document.getElementById('chart-vendedores-custos');
    if (ctx3) {
        relatorioCharts.custos = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Receita',
                        data: topVendedores.map(v => v.receitaTotal),
                        backgroundColor: 'rgba(34, 197, 94, 0.7)',
                        borderColor: 'rgb(34, 197, 94)',
                        borderWidth: 1
                    },
                    {
                        label: 'Custos',
                        data: topVendedores.map(v => v.custosTotal + v.impostosTotal),
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: 'rgb(239, 68, 68)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        bottom: paddingBottom,
                        left: 10,
                        right: 10
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { font: { size: 10 }, padding: 8 }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                // Mostrar nome completo no tooltip
                                const index = context[0].dataIndex;
                                return topVendedores[index]?.nome || 'Sem vendedor';
                            },
                            label: function(context) {
                                return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                            }
                        }
                    },
                    onClick: function(evt, elements) {
                        if (elements.length > 0) {
                            const element = elements[0];
                            const index = element.index;
                            showChartDetail('custos', topVendedores[index]);
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: rotacaoLabels,
                            minRotation: rotacaoLabels,
                            font: { size: fontSize },
                            autoSkip: false,
                            maxTicksLimit: topVendedores.length
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                            },
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }

    // Gráfico 4: Margem de Lucro (%)
    const ctx4 = document.getElementById('chart-vendedores-margem');
    if (ctx4) {
        const margemDatasets = [{
            label: 'Margem (%)',
            data: topVendedores.map(v => v.margemPercentual),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
        }];
        if (metaPercentual > 0) {
            margemDatasets.push({
                label: 'Meta (%)',
                data: labels.map(() => metaPercentual),
                borderColor: 'rgba(16, 185, 129, 0.9)',
                borderDash: [6, 4],
                borderWidth: 2,
                pointRadius: 0,
                tension: 0,
                fill: false
            });
        }
        relatorioCharts.margem = new Chart(ctx4, {
            type: 'line',
            data: {
                labels: labels,
                datasets: margemDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        bottom: paddingBottom,
                        left: 10,
                        right: 10
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                // Mostrar nome completo no tooltip
                                const index = context[0].dataIndex;
                                return topVendedores[index]?.nome || 'Sem vendedor';
                            },
                            label: function(context) {
                                return 'Margem: ' + context.parsed.y.toFixed(2) + '%';
                            }
                        }
                    },
                    onClick: function(evt, elements) {
                        if (elements.length > 0) {
                            const element = elements[0];
                            const index = element.index;
                            showChartDetail('margem', topVendedores[index]);
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: rotacaoLabels,
                            minRotation: rotacaoLabels,
                            font: { size: fontSize },
                            autoSkip: false,
                            maxTicksLimit: topVendedores.length
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            },
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }
}

// Variável global para controlar gráfico expandido
let expandedChartType = null;
const chartTypes = ['resultado', 'operacoes', 'custos', 'margem', 'ebtida'];

// Funções para expansão e detalhamento de gráficos
function toggleChartExpand(chartType) {
    // Encontrar o card que contém os gráficos (Análise Detalhada por Vendedor)
    const chartContainer = document.querySelector(`[data-chart="${chartType}"]`);
    if (!chartContainer) return;
    
    // Encontrar o card pai que contém todos os gráficos
    const cardContainer = chartContainer.closest('.rounded-lg.border.bg-card.shadow-sm');
    if (!cardContainer) return;
    
    const gridContainer = cardContainer.querySelector('.grid.gap-6');
    if (!gridContainer) return;
    
    // Se já está expandido, recolher
    if (expandedChartType === chartType) {
        // Recolher todos os gráficos
        cardContainer.querySelectorAll('.chart-container').forEach(container => {
            const wrapper = container.querySelector('.chart-wrapper');
            if (wrapper) {
                wrapper.style.height = container.dataset.chart === 'ebtida' ? '320px' : '280px';
            }
            container.classList.remove('col-span-2', 'row-span-2', 'w-full');
            const wasHidden = container.dataset.prevHidden === 'true';
            if (wasHidden) container.classList.add('hidden');
            else container.classList.remove('hidden');
            delete container.dataset.prevHidden;
        });
        
        // Restaurar grid
        gridContainer.classList.remove('grid-cols-1');
        gridContainer.classList.add('md:grid-cols-2');
        
        // Remover navegação
        const navDiv = document.getElementById('chart-navigation');
        if (navDiv) navDiv.remove();
        
        expandedChartType = null;
        
        // Atualizar todos os gráficos
        Object.keys(relatorioCharts).forEach(ct => {
            if (relatorioCharts[ct]) {
                setTimeout(() => relatorioCharts[ct].resize(), 50);
            }
        });
        return;
    }
    
    // Expandir gráfico selecionado
    expandedChartType = chartType;
    
    // Ocultar todos os outros gráficos e expandir o selecionado
    cardContainer.querySelectorAll('.chart-container').forEach(container => {
        container.dataset.prevHidden = container.classList.contains('hidden') ? 'true' : 'false';
        if (container.dataset.chart !== chartType) {
            container.classList.add('hidden');
        } else {
            container.classList.remove('hidden');
            container.classList.add('col-span-2', 'row-span-2', 'w-full');
            const wrapper = container.querySelector('.chart-wrapper');
            if (wrapper) {
                // Calcular altura baseada no card disponível
                const cardBody = cardContainer.querySelector('.card-body');
                const cardBodyHeight = cardBody ? cardBody.offsetHeight : 600;
                const headerHeight = cardContainer.querySelector('.border-b')?.offsetHeight || 60;
                const padding = 48; // p-6 = 24px * 2
                const titleHeight = 30; // Altura do título do gráfico
                const navHeight = 50; // Espaço para navegação
                const availableHeight = cardBodyHeight - headerHeight - padding - titleHeight - navHeight;
                
                // Usar altura calculada ou mínimo de 500px
                wrapper.style.height = `${Math.max(500, availableHeight)}px`;
                wrapper.style.width = '100%';
            }
        }
    });
    
    // Mudar grid para 1 coluna
    gridContainer.classList.remove('md:grid-cols-2');
    gridContainer.classList.add('grid-cols-1');
    
    // Adicionar navegação entre gráficos
    if (chartContainer) {
        let navDiv = document.getElementById('chart-navigation');
        if (!navDiv) {
            navDiv = document.createElement('div');
            navDiv.id = 'chart-navigation';
            navDiv.className = 'flex items-center justify-center gap-2 mt-4 p-2 bg-muted/30 rounded-lg flex-wrap';
            chartContainer.appendChild(navDiv);
        }
        
        const chartNames = {
            'resultado': 'Resultado',
            'operacoes': 'Operações',
            'custos': 'Custos',
            'margem': 'Margem',
            'ebtida': 'EBTIDA'
        };
        
        let navHtml = `<span class="text-xs text-muted-foreground mr-2">Navegar:</span>`;
        chartTypes.forEach(ct => {
            const isActive = ct === chartType;
            navHtml += `<button onclick="toggleChartExpand('${ct}')" 
                class="px-2 py-1 text-xs rounded-md ${isActive ? 'bg-primary text-white' : 'bg-background border hover:bg-muted'}"
                ${isActive ? 'disabled' : ''}>
                ${chartNames[ct]}
            </button>`;
        });
        navHtml += `<button onclick="toggleChartExpand('${chartType}')" class="ml-2 px-2 py-1 text-xs rounded-md bg-background border hover:bg-muted">
            <i class="fas fa-compress"></i> Recolher
        </button>`;
        
        navDiv.innerHTML = navHtml;
    }
    
    // Atualizar gráfico para ajustar ao novo tamanho
    if (relatorioCharts[chartType]) {
        setTimeout(() => {
            relatorioCharts[chartType].resize();
        }, 150);
    }
}

function showChartDetail(chartType, vendedor, datasetIndex) {
    const detailDiv = document.getElementById(`chart-detail-${chartType}`);
    if (!detailDiv || !vendedor) return;
    
    // Toggle do detalhe
    if (detailDiv.classList.contains('hidden')) {
        detailDiv.classList.remove('hidden');
    } else {
        // Se já está aberto e é o mesmo vendedor, fecha
        const currentVendedor = detailDiv.getAttribute('data-vendedor');
        if (currentVendedor === vendedor.nome) {
            detailDiv.classList.add('hidden');
            return;
        }
    }
    
    detailDiv.setAttribute('data-vendedor', vendedor.nome);
    
    let html = `<div class="space-y-3">`;
    html += `<div class="flex items-center justify-between border-b pb-2">`;
    html += `<h5 class="font-semibold text-sm">Detalhes: ${escapeHtml(vendedor.nome)}</h5>`;
    html += `<button onclick="document.getElementById('chart-detail-${chartType}').classList.add('hidden')" class="text-xs text-muted-foreground hover:text-foreground">`;
    html += `<i class="fas fa-times"></i></button></div>`;
    
    if (chartType === 'resultado') {
        html += `<div class="grid grid-cols-2 gap-4 text-sm">`;
        html += `<div><span class="text-muted-foreground">Resultado Total:</span> <span class="font-semibold ${vendedor.resultadoTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}">${formatCurrency(vendedor.resultadoTotal)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Operações:</span> <span class="font-semibold">${formatNumber(vendedor.operacoes)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Resultado Médio:</span> <span class="font-semibold">${formatCurrency(vendedor.resultadoMedio)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Margem:</span> <span class="font-semibold">${vendedor.margemPercentual.toFixed(2)}%</span></div>`;
        html += `</div>`;
    } else if (chartType === 'operacoes') {
        html += `<div class="grid grid-cols-2 gap-4 text-sm">`;
        html += `<div><span class="text-muted-foreground">Total de Operações:</span> <span class="font-semibold">${formatNumber(vendedor.operacoes)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Clientes Únicos:</span> <span class="font-semibold">${vendedor.clientesCount || 0}</span></div>`;
        html += `</div>`;
    } else if (chartType === 'custos') {
        html += `<div class="grid grid-cols-2 gap-4 text-sm">`;
        html += `<div><span class="text-muted-foreground">Receita Total:</span> <span class="font-semibold text-emerald-600">${formatCurrency(vendedor.receitaTotal)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Custos Operacionais:</span> <span class="font-semibold text-red-600">${formatCurrency(vendedor.custosTotal)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Impostos:</span> <span class="font-semibold text-orange-600">${formatCurrency(vendedor.impostosTotal)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Total de Custos:</span> <span class="font-semibold text-red-600">${formatCurrency(vendedor.custosTotal + vendedor.impostosTotal)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Resultado:</span> <span class="font-semibold ${vendedor.resultadoTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}">${formatCurrency(vendedor.resultadoTotal)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Margem:</span> <span class="font-semibold">${vendedor.margemPercentual.toFixed(2)}%</span></div>`;
        html += `</div>`;
    } else if (chartType === 'margem') {
        html += `<div class="grid grid-cols-2 gap-4 text-sm">`;
        html += `<div><span class="text-muted-foreground">Margem Percentual:</span> <span class="font-semibold ${vendedor.margemPercentual >= 0 ? 'text-emerald-600' : 'text-red-600'}">${vendedor.margemPercentual.toFixed(2)}%</span></div>`;
        html += `<div><span class="text-muted-foreground">Receita Total:</span> <span class="font-semibold">${formatCurrency(vendedor.receitaTotal)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Resultado Total:</span> <span class="font-semibold ${vendedor.resultadoTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}">${formatCurrency(vendedor.resultadoTotal)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Operações:</span> <span class="font-semibold">${formatNumber(vendedor.operacoes)}</span></div>`;
        html += `</div>`;
    } else if (chartType === 'ebtida') {
        html += `<div class="grid grid-cols-2 gap-4 text-sm">`;
        html += `<div><span class="text-muted-foreground">EBTIDA:</span> <span class="font-semibold ${(vendedor.ebtida || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}">${formatCurrency(vendedor.ebtida || 0)}</span></div>`;
        html += `<div><span class="text-muted-foreground">% EBTIDA:</span> <span class="font-semibold">${vendedor.ebtidaPercentual.toFixed(2)}%</span></div>`;
        html += `<div><span class="text-muted-foreground">Receita Total:</span> <span class="font-semibold text-emerald-600">${formatCurrency(vendedor.receitaTotal)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Custos Operacionais:</span> <span class="font-semibold text-red-600">${formatCurrency(vendedor.custosTotal)}</span></div>`;
        html += `<div><span class="text-muted-foreground">Impostos:</span> <span class="font-semibold text-orange-600">${formatCurrency(vendedor.impostosTotal)}</span></div>`;
        html += `<div><span class="text-muted-foreground">% Impostos:</span> <span class="font-semibold">${vendedor.impostosPercentual.toFixed(2)}%</span></div>`;
        html += `</div>`;
    }
    
    html += `</div>`;
    detailDiv.innerHTML = html;
}

function renderFarolClientes(clientes) {
    if (!clientes || clientes.length === 0) return;

    // Ordenar clientes por resultado
    const clientesOrdenados = [...clientes].sort((a, b) => b.resultadoTotal - a.resultadoTotal);
    const mediaResultado = clientes.reduce((acc, c) => acc + c.resultadoTotal, 0) / clientes.length;
    
    // Top 10 melhores clientes (farol verde)
    const topClientes = clientesOrdenados.slice(0, 10).filter(c => c.resultadoTotal > 0);
    const containerTop = document.getElementById('relatorio-top-clientes');
    if (containerTop) {
        containerTop.innerHTML = '';
        if (topClientes.length === 0) {
            containerTop.innerHTML = '<p class="p-4 text-sm text-muted-foreground text-center">Nenhum cliente com resultado positivo</p>';
        } else {
            topClientes.forEach((cliente, idx) => {
                const badge = idx < 3 ? `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Top ${idx + 1}</span>` : '';
                containerTop.insertAdjacentHTML('beforeend', `
                    <div class="p-4 hover:bg-muted/40">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                                    <p class="font-semibold text-sm">${escapeHtml(cliente.nome)}</p>
                                    ${badge}
                                </div>
                                <p class="text-xs text-muted-foreground mt-1">${cliente.operacoes} operações · Vendedor: ${escapeHtml(cliente.vendedor)}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-bold text-emerald-600">${formatCurrency(cliente.resultadoTotal)}</p>
                                <p class="text-xs text-muted-foreground">${formatCurrency(cliente.valorTotal)}</p>
                            </div>
                        </div>
                    </div>
                `);
            });
        }
    }

    // Clientes em risco (farol vermelho) - resultado negativo ou muito baixo
    const riscoClientes = clientesOrdenados.filter(c => c.resultadoTotal < 0 || (c.resultadoTotal < mediaResultado * 0.3 && c.operacoes > 0)).slice(0, 10);
    const containerRisco = document.getElementById('relatorio-risco-clientes');
    if (containerRisco) {
        containerRisco.innerHTML = '';
        if (riscoClientes.length === 0) {
            containerRisco.innerHTML = '<p class="p-4 text-sm text-muted-foreground text-center">Nenhum cliente em risco identificado</p>';
        } else {
            riscoClientes.forEach(cliente => {
                const riscoClass = cliente.resultadoTotal < 0 ? 'text-red-600' : 'text-orange-600';
                containerRisco.insertAdjacentHTML('beforeend', `
                    <div class="p-4 hover:bg-muted/40">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full bg-red-500"></span>
                                    <p class="font-semibold text-sm">${escapeHtml(cliente.nome)}</p>
                                </div>
                                <p class="text-xs text-muted-foreground mt-1">${cliente.operacoes} operações · Vendedor: ${escapeHtml(cliente.vendedor)}</p>
                                <p class="text-xs ${riscoClass} mt-1">Margem: ${cliente.margemPercentual.toFixed(1)}%</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-bold ${riscoClass}">${formatCurrency(cliente.resultadoTotal)}</p>
                                <p class="text-xs text-muted-foreground">${formatCurrency(cliente.valorTotal)}</p>
                            </div>
                        </div>
                    </div>
                `);
            });
        }
    }
}

// Variável global para armazenar dados de churn
let relatorioChurnData = {
    clientes: [],
    registros: []
};

function renderChurnAnalysis(clientes, registros) {
    if (!clientes || clientes.length === 0 || !registros || registros.length === 0) return;

    // Armazenar dados globalmente para análise detalhada
    relatorioChurnData.clientes = clientes;
    relatorioChurnData.registros = registros;

    // Agrupar registros por cliente e data para detectar redução de atividade
    const clientesPorData = {};
    registros.forEach(reg => {
        const clienteKey = reg.cliente || 'Cliente não informado';
        if (!clientesPorData[clienteKey]) {
            clientesPorData[clienteKey] = [];
        }
        if (reg.data) {
            clientesPorData[clienteKey].push(reg.data);
        }
    });

    // Identificar clientes com redução significativa de atividade (churn)
    const churnClientes = [];
    clientes.forEach(cliente => {
        const datas = clientesPorData[cliente.nome] || [];
        if (datas.length === 0) return;

        // Ordenar datas
        const datasOrdenadas = datas.sort();
        const primeiraData = new Date(datasOrdenadas[0]);
        const ultimaData = new Date(datasOrdenadas[datasOrdenadas.length - 1]);
        const diasTotal = Math.ceil((ultimaData - primeiraData) / (1000 * 60 * 60 * 24)) || 1;
        
        // Calcular frequência média
        const frequenciaMedia = cliente.operacoes / Math.max(diasTotal, 1);
        
        // Identificar se há redução recente (últimos 30% do período)
        const periodoRecente = Math.ceil(datasOrdenadas.length * 0.3);
        const operacoesRecentes = periodoRecente;
        const frequenciaRecente = operacoesRecentes / Math.max(30, 1); // Assumindo últimos 30 dias
        
        // Churn: frequência recente < 50% da frequência média
        if (frequenciaRecente < frequenciaMedia * 0.5 && cliente.operacoes > 5) {
            churnClientes.push({
                ...cliente,
                frequenciaMedia: frequenciaMedia,
                frequenciaRecente: frequenciaRecente,
                reducaoPercentual: ((frequenciaMedia - frequenciaRecente) / frequenciaMedia * 100),
                datasOperacoes: datasOrdenadas,
                primeiraData: primeiraData,
                ultimaData: ultimaData,
                diasTotal: diasTotal
            });
        }
    });
    
    // Armazenar churnClientes globalmente
    relatorioChurnData.churnClientes = churnClientes;
    
    // Armazenar também o índice para acesso rápido
    churnClientes.forEach((cliente, index) => {
        cliente._index = index;
    });

    // Ordenar por redução percentual
    churnClientes.sort((a, b) => b.reducaoPercentual - a.reducaoPercentual);

    const container = document.getElementById('relatorio-churn-content');
    if (container) {
        container.innerHTML = '';
        if (churnClientes.length === 0) {
            container.innerHTML = '<p class="text-sm text-muted-foreground text-center py-4">Nenhum cliente com redução significativa de atividade detectado</p>';
        } else {
            container.innerHTML = `
                <div class="mb-4">
                    <p class="text-sm text-muted-foreground">${churnClientes.length} cliente(s) com redução significativa de atividade identificado(s)</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="px-4 py-3 text-left font-medium">Cliente</th>
                                <th class="px-4 py-3 text-left font-medium">Vendedor</th>
                                <th class="px-4 py-3 text-right font-medium">Operações</th>
                                <th class="px-4 py-3 text-right font-medium">Redução</th>
                                <th class="px-4 py-3 text-right font-medium">Último Valor</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border">
                            ${churnClientes.slice(0, 15).map((cliente, index) => `
                                <tr class="hover:bg-muted/30">
                                    <td class="px-4 py-3 font-medium">${escapeHtml(cliente.nome)}</td>
                                    <td class="px-4 py-3 text-muted-foreground">${escapeHtml(cliente.vendedor)}</td>
                                    <td class="px-4 py-3 text-right">${cliente.operacoes}</td>
                                    <td class="px-4 py-3 text-right">
                                        <button onclick="mostrarDetalhesChurn(${index})" class="text-red-600 font-medium hover:text-red-700 hover:underline cursor-pointer" title="Clique para ver análise detalhada">
                                            ${cliente.reducaoPercentual.toFixed(1)}%
                                        </button>
                                    </td>
                                    <td class="px-4 py-3 text-right">${formatCurrency(cliente.valorTotal)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
}

function formatDateBR(dateString) {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Tentar parsear formato brasileiro
            const parts = dateString.split('/');
            if (parts.length === 3) {
                return dateString; // Já está no formato BR
            }
            return dateString;
        }
        return date.toLocaleDateString('pt-BR');
    } catch (e) {
        return dateString;
    }
}

function mostrarDetalhesChurn(index) {
    const churnClientes = relatorioChurnData.churnClientes || [];
    if (!churnClientes[index]) return;
    
    const cliente = churnClientes[index];
    const registrosCliente = relatorioChurnData.registros.filter(r => 
        (r.cliente || 'Cliente não informado') === cliente.nome
    );
    
    // Calcular período anterior (primeira metade) vs período recente (última metade)
    const datasOrdenadas = cliente.datasOperacoes || [];
    if (datasOrdenadas.length === 0) return;
    
    const meioPeriodo = Math.floor(datasOrdenadas.length / 2);
    const periodoAnterior = datasOrdenadas.slice(0, meioPeriodo);
    const periodoRecente = datasOrdenadas.slice(meioPeriodo);
    
    // Agrupar operações por data
    const operacoesPorData = {};
    registrosCliente.forEach(reg => {
        if (!reg.data) return;
        const dataKey = reg.data.split('T')[0] || reg.data;
        if (!operacoesPorData[dataKey]) {
            operacoesPorData[dataKey] = {
                data: dataKey,
                operacoes: 0,
                valor: 0,
                resultado: 0
            };
        }
        operacoesPorData[dataKey].operacoes += reg.quantidade || 1;
        operacoesPorData[dataKey].valor += reg.valor || 0;
        operacoesPorData[dataKey].resultado += reg.resultado || 0;
    });
    
    // Separar por período
    const operacoesPeriodoAnterior = periodoAnterior.map(d => operacoesPorData[d.split('T')[0] || d] || { data: d, operacoes: 0, valor: 0, resultado: 0 });
    const operacoesPeriodoRecente = periodoRecente.map(d => operacoesPorData[d.split('T')[0] || d] || { data: d, operacoes: 0, valor: 0, resultado: 0 });
    
    // Calcular totais
    const totalAnterior = {
        operacoes: operacoesPeriodoAnterior.reduce((acc, op) => acc + op.operacoes, 0),
        valor: operacoesPeriodoAnterior.reduce((acc, op) => acc + op.valor, 0),
        resultado: operacoesPeriodoAnterior.reduce((acc, op) => acc + op.resultado, 0),
        dias: periodoAnterior.length
    };
    
    const totalRecente = {
        operacoes: operacoesPeriodoRecente.reduce((acc, op) => acc + op.operacoes, 0),
        valor: operacoesPeriodoRecente.reduce((acc, op) => acc + op.valor, 0),
        resultado: operacoesPeriodoRecente.reduce((acc, op) => acc + op.resultado, 0),
        dias: periodoRecente.length
    };
    
    // Calcular médias por dia
    const mediaAnterior = {
        operacoes: totalAnterior.dias > 0 ? (totalAnterior.operacoes / totalAnterior.dias) : 0,
        valor: totalAnterior.dias > 0 ? (totalAnterior.valor / totalAnterior.dias) : 0,
        resultado: totalAnterior.dias > 0 ? (totalAnterior.resultado / totalAnterior.dias) : 0
    };
    
    const mediaRecente = {
        operacoes: totalRecente.dias > 0 ? (totalRecente.operacoes / totalRecente.dias) : 0,
        valor: totalRecente.dias > 0 ? (totalRecente.valor / totalRecente.dias) : 0,
        resultado: totalRecente.dias > 0 ? (totalRecente.resultado / totalRecente.dias) : 0
    };
    
    // Calcular reduções
    const reducaoOperacoes = totalAnterior.operacoes > 0 ? ((totalAnterior.operacoes - totalRecente.operacoes) / totalAnterior.operacoes * 100) : 0;
    const reducaoValor = totalAnterior.valor > 0 ? ((totalAnterior.valor - totalRecente.valor) / totalAnterior.valor * 100) : 0;
    const reducaoResultado = totalAnterior.resultado > 0 ? ((totalAnterior.resultado - totalRecente.resultado) / totalAnterior.resultado * 100) : 0;
    
    // Calcular impacto
    const impactoOperacoes = totalAnterior.operacoes - totalRecente.operacoes;
    const impactoValor = totalAnterior.valor - totalRecente.valor;
    const impactoResultado = totalAnterior.resultado - totalRecente.resultado;
    
    // Formatar datas
    const dataInicio = periodoAnterior[0] ? formatDateBR(periodoAnterior[0].split('T')[0] || periodoAnterior[0]) : '-';
    const dataMeio = periodoRecente[0] ? formatDateBR(periodoRecente[0].split('T')[0] || periodoRecente[0]) : '-';
    const dataFim = periodoRecente[periodoRecente.length - 1] ? formatDateBR(periodoRecente[periodoRecente.length - 1].split('T')[0] || periodoRecente[periodoRecente.length - 1]) : '-';
    
    // Montar HTML
    let html = `
        <div class="space-y-6">
            <!-- Quadro Comparativo -->
            <div class="rounded-lg border bg-muted/30 p-4">
                <h4 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-balance-scale text-primary"></i>
                    Quadro Comparativo de Operações
                </h4>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-background rounded-lg p-4 border">
                        <h5 class="text-sm font-medium text-muted-foreground mb-3">Período Anterior</h5>
                        <p class="text-xs text-muted-foreground mb-2">${dataInicio} a ${dataMeio}</p>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-sm">Operações:</span>
                                <span class="font-semibold">${formatNumber(totalAnterior.operacoes)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm">Valor Total:</span>
                                <span class="font-semibold">${formatCurrency(totalAnterior.valor)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm">Resultado:</span>
                                <span class="font-semibold ${totalAnterior.resultado >= 0 ? 'text-emerald-600' : 'text-red-600'}">${formatCurrency(totalAnterior.resultado)}</span>
                            </div>
                            <div class="flex justify-between border-t pt-2 mt-2">
                                <span class="text-sm font-medium">Média por Dia:</span>
                                <span class="text-sm text-muted-foreground">${mediaAnterior.operacoes.toFixed(2)} ops/dia</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-background rounded-lg p-4 border">
                        <h5 class="text-sm font-medium text-muted-foreground mb-3">Período Recente</h5>
                        <p class="text-xs text-muted-foreground mb-2">${dataMeio} a ${dataFim}</p>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-sm">Operações:</span>
                                <span class="font-semibold">${formatNumber(totalRecente.operacoes)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm">Valor Total:</span>
                                <span class="font-semibold">${formatCurrency(totalRecente.valor)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm">Resultado:</span>
                                <span class="font-semibold ${totalRecente.resultado >= 0 ? 'text-emerald-600' : 'text-red-600'}">${formatCurrency(totalRecente.resultado)}</span>
                            </div>
                            <div class="flex justify-between border-t pt-2 mt-2">
                                <span class="text-sm font-medium">Média por Dia:</span>
                                <span class="text-sm text-muted-foreground">${mediaRecente.operacoes.toFixed(2)} ops/dia</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Análise de Redução -->
            <div class="rounded-lg border bg-red-50 dark:bg-red-950/20 p-4">
                <h4 class="font-semibold mb-4 flex items-center gap-2 text-red-600">
                    <i class="fas fa-exclamation-triangle"></i>
                    Análise da Redução
                </h4>
                <div class="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <span class="text-muted-foreground">Redução de Operações:</span>
                        <p class="font-semibold text-red-600">${reducaoOperacoes.toFixed(1)}%</p>
                        <p class="text-xs text-muted-foreground">${impactoOperacoes > 0 ? '-' : '+'}${formatNumber(Math.abs(impactoOperacoes))} operações</p>
                    </div>
                    <div>
                        <span class="text-muted-foreground">Redução de Valor:</span>
                        <p class="font-semibold text-red-600">${reducaoValor.toFixed(1)}%</p>
                        <p class="text-xs text-muted-foreground">${impactoValor > 0 ? '-' : '+'}${formatCurrency(Math.abs(impactoValor))}</p>
                    </div>
                    <div>
                        <span class="text-muted-foreground">Redução de Resultado:</span>
                        <p class="font-semibold text-red-600">${reducaoResultado.toFixed(1)}%</p>
                        <p class="text-xs text-muted-foreground">${impactoResultado > 0 ? '-' : '+'}${formatCurrency(Math.abs(impactoResultado))}</p>
                    </div>
                </div>
            </div>
            
            <!-- Explicação -->
            <div class="rounded-lg border bg-blue-50 dark:bg-blue-950/20 p-4">
                <h4 class="font-semibold mb-3 flex items-center gap-2 text-blue-600">
                    <i class="fas fa-info-circle"></i>
                    Explicação da Redução
                </h4>
                <div class="space-y-2 text-sm">
                    <p><strong>Motivo da Redução:</strong> O cliente apresentou uma redução de <strong>${reducaoOperacoes.toFixed(1)}%</strong> nas operações comparando o período anterior com o período recente.</p>
                    <p><strong>Operações por Dia:</strong> A média de operações caiu de <strong>${mediaAnterior.operacoes.toFixed(2)} operações/dia</strong> para <strong>${mediaRecente.operacoes.toFixed(2)} operações/dia</strong>, representando uma queda de <strong>${(mediaAnterior.operacoes - mediaRecente.operacoes).toFixed(2)} operações por dia</strong>.</p>
                    <p><strong>Impacto no Período:</strong> No período analisado (${dataMeio} a ${dataFim}), o cliente deixou de realizar aproximadamente <strong>${formatNumber(Math.abs(impactoOperacoes))} operações</strong>, resultando em uma perda de receita de <strong>${formatCurrency(Math.abs(impactoValor))}</strong> e impacto no resultado de <strong>${formatCurrency(Math.abs(impactoResultado))}</strong>.</p>
                    <p class="text-xs text-muted-foreground mt-3"><strong>Vendedor Responsável:</strong> ${escapeHtml(cliente.vendedor || 'Não informado')}</p>
                </div>
            </div>
            
            <!-- Gráfico de Operações por Dia -->
            <div class="rounded-lg border bg-muted/30 p-4">
                <h4 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-chart-area text-primary"></i>
                    Operações por Dia
                </h4>
                <div class="relative" style="height: 300px;">
                    <canvas id="churn-detail-chart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Preencher conteúdo
    document.getElementById('churn-detail-cliente-nome').textContent = `Análise de Churn: ${escapeHtml(cliente.nome)}`;
    document.getElementById('churn-detail-content').innerHTML = html;
    
    // Mostrar modal
    document.getElementById('churn-detail-modal').classList.remove('hidden');
    
    // Criar gráfico
    setTimeout(() => {
        criarGraficoChurnDetalhes(operacoesPorData, periodoAnterior, periodoRecente);
    }, 100);
}

function fecharDetalhesChurn() {
    document.getElementById('churn-detail-modal').classList.add('hidden');
    // Destruir gráfico se existir
    if (window.churnDetailChart) {
        window.churnDetailChart.destroy();
        window.churnDetailChart = null;
    }
}

function criarGraficoChurnDetalhes(operacoesPorData, periodoAnterior, periodoRecente) {
    const ctx = document.getElementById('churn-detail-chart');
    if (!ctx) return;
    
    // Destruir gráfico anterior se existir
    if (window.churnDetailChart) {
        window.churnDetailChart.destroy();
    }
    
    // Preparar dados
    const todasDatas = [...new Set([...periodoAnterior, ...periodoRecente])].sort();
    const labels = todasDatas.map(d => {
        const data = d.split('T')[0] || d;
        return formatDateBR(data);
    });
    
    const dadosAnterior = periodoAnterior.map(d => {
        const dataKey = d.split('T')[0] || d;
        const op = operacoesPorData[dataKey];
        return op ? op.operacoes : 0;
    });
    
    const dadosRecente = periodoRecente.map(d => {
        const dataKey = d.split('T')[0] || d;
        const op = operacoesPorData[dataKey];
        return op ? op.operacoes : 0;
    });
    
    // Preencher com zeros onde não há dados
    const dadosAnteriorCompleto = todasDatas.map(d => {
        const idx = periodoAnterior.indexOf(d);
        return idx >= 0 ? dadosAnterior[idx] : 0;
    });
    
    const dadosRecenteCompleto = todasDatas.map(d => {
        const idx = periodoRecente.indexOf(d);
        return idx >= 0 ? dadosRecente[idx] : 0;
    });
    
    window.churnDetailChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Período Anterior',
                    data: dadosAnteriorCompleto,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Período Recente',
                    data: dadosRecenteCompleto,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' operações';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

function mostrarDetalhesMetrica(tipoMetrica) {
    if (!relatorioRegistros || relatorioRegistros.length === 0) {
        alert('Nenhum dado disponível para análise.');
        return;
    }
    
    const resumo = calcularResumoRelatorio(relatorioRegistros);
    let html = '';
    let titulo = '';
    let icone = '';
    
    switch(tipoMetrica) {
        case 'operacoes':
            titulo = 'Detalhes: Total de Operações';
            icone = 'fa-stream';
            html = gerarDetalhesOperacoes(resumo, relatorioRegistros);
            break;
        case 'frete':
            titulo = 'Detalhes: Total de Frete';
            icone = 'fa-truck';
            html = gerarDetalhesFrete(resumo, relatorioRegistros);
            break;
        case 'valor-nf':
            titulo = 'Detalhes: Valor NF';
            icone = 'fa-file-invoice-dollar';
            html = gerarDetalhesValorNF(resumo, relatorioRegistros);
            break;
        case 'valor':
            titulo = 'Detalhes: Valor Bruto';
            icone = 'fa-money-bill-wave';
            html = gerarDetalhesValor(resumo, relatorioRegistros);
            break;
        case 'resultado':
            titulo = 'Detalhes: Resultado Líquido';
            icone = 'fa-coins';
            html = gerarDetalhesResultado(resumo, relatorioRegistros);
            break;
        case 'ticket-medio':
            titulo = 'Detalhes: Ticket Médio';
            icone = 'fa-receipt';
            html = gerarDetalhesTicketMedio(resumo, relatorioRegistros);
            break;
        case 'custos':
            titulo = 'Detalhes: Total de Custos';
            icone = 'fa-dollar-sign';
            html = gerarDetalhesCustos(resumo, relatorioRegistros);
            break;
        case 'impostos':
            titulo = 'Detalhes: Total de Impostos';
            icone = 'fa-receipt';
            html = gerarDetalhesImpostos(resumo, relatorioRegistros);
            break;
        case 'prejuizos':
            titulo = 'Detalhes: Prejuízos';
            icone = 'fa-exclamation-triangle';
            html = gerarDetalhesPrejuizos(resumo, relatorioRegistros);
            break;
        case 'margem':
            titulo = 'Detalhes: Margem Percentual';
            icone = 'fa-percentage';
            html = gerarDetalhesMargem(resumo, relatorioRegistros);
            break;
        default:
            return;
    }
    
    document.getElementById('metrica-detail-title').innerHTML = `<i class="fas ${icone} text-primary"></i> ${titulo}`;
    document.getElementById('metrica-detail-content').innerHTML = html;
    if (tipoMetrica === 'frete') {
        switchFreteTab('meta');
    }
    document.getElementById('metrica-detail-modal').classList.remove('hidden');
}

function fecharDetalhesMetrica() {
    document.getElementById('metrica-detail-modal').classList.add('hidden');
}

function gerarDetalhesOperacoes(resumo, registros) {
    const totalOperacoes = resumo.totalOperacoes;
    const operacoesPorVendedor = {};
    const operacoesPorCliente = {};
    
    registros.forEach(reg => {
        const ops = reg.quantidade || 1;
        const vendedor = reg.vendedor || 'Sem vendedor';
        const cliente = reg.cliente || 'Cliente não informado';
        
        operacoesPorVendedor[vendedor] = (operacoesPorVendedor[vendedor] || 0) + ops;
        operacoesPorCliente[cliente] = (operacoesPorCliente[cliente] || 0) + ops;
    });
    
    const topVendedores = Object.entries(operacoesPorVendedor)
        .map(([nome, ops]) => ({ nome, ops }))
        .sort((a, b) => b.ops - a.ops)
        .slice(0, 10);
    
    const topClientes = Object.entries(operacoesPorCliente)
        .map(([nome, ops]) => ({ nome, ops }))
        .sort((a, b) => b.ops - a.ops)
        .slice(0, 10);
    
    return `
        <div class="space-y-6">
            <div class="rounded-lg border bg-muted/30 p-4">
                <h4 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-calculator text-primary"></i>
                    Cálculo do Total de Operações
                </h4>
                <div class="space-y-3 text-sm">
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Fórmula:</strong></p>
                        <p class="font-mono bg-muted p-2 rounded">Total de Operações = Σ (quantidade de cada registro)</p>
                    </div>
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Processo de Cálculo:</strong></p>
                        <ol class="list-decimal list-inside space-y-1 ml-2">
                            <li>Para cada registro no período, somar o campo <code class="bg-muted px-1 rounded">quantidade</code> (ou 1 se não informado)</li>
                            <li>Total de registros processados: <strong>${formatNumber(registros.length)}</strong></li>
                            <li>Soma de todas as quantidades: <strong>${formatNumber(totalOperacoes)}</strong> operações</li>
                        </ol>
                    </div>
                    <div class="bg-emerald-50 dark:bg-emerald-950/20 rounded p-3 border border-emerald-200 dark:border-emerald-800">
                        <p class="font-semibold text-emerald-700 dark:text-emerald-300">Resultado Final:</p>
                        <p class="text-2xl font-bold text-emerald-600">${formatNumber(totalOperacoes)} operações</p>
                    </div>
                </div>
            </div>
            
            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-lg border bg-muted/30 p-4">
                    <h5 class="font-semibold mb-3">Top 10 Vendedores por Operações</h5>
                    <div class="space-y-2 text-sm">
                        ${topVendedores.map((v, idx) => `
                            <div class="flex justify-between items-center p-2 bg-background rounded">
                                <span class="flex items-center gap-2">
                                    <span class="text-xs text-muted-foreground">${idx + 1}.</span>
                                    <span>${escapeHtml(v.nome)}</span>
                                </span>
                                <span class="font-semibold">${formatNumber(v.ops)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="rounded-lg border bg-muted/30 p-4">
                    <h5 class="font-semibold mb-3">Top 10 Clientes por Operações</h5>
                    <div class="space-y-2 text-sm">
                        ${topClientes.map((c, idx) => `
                            <div class="flex justify-between items-center p-2 bg-background rounded">
                                <span class="flex items-center gap-2">
                                    <span class="text-xs text-muted-foreground">${idx + 1}.</span>
                                    <span>${escapeHtml(c.nome)}</span>
                                </span>
                                <span class="font-semibold">${formatNumber(c.ops)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function gerarDetalhesFrete(resumo, registros) {
    const totalFrete = resumo.totalFrete || 0;
    const fretePorVendedor = {};
    const fretePorCliente = {};
    const { metaValor } = getRelatorioMetaSettings();
    const pctMetaRaw = metaValor > 0 ? (totalFrete / metaValor) * 100 : 0;
    const pctMetaSafe = Number.isFinite(pctMetaRaw) ? pctMetaRaw : 0;
    const pctMeta = metaValor > 0 ? Math.min(100, Math.max(0, pctMetaSafe)) : 0;
    const pctExtra = metaValor > 0 && pctMetaSafe > 100 ? ` (+${(pctMetaSafe - 100).toFixed(1)}%)` : '';
    const dailyInfo = getRelatorioDailyFreteInfo(registros || [], metaValor);
    const metaDia = dailyInfo.metaDia;
    const businessDays = dailyInfo.businessDays;
    const businessDaysSet = dailyInfo.businessDaysSet;
    const progressStyles = getRelatorioProgressStyles(pctMetaSafe);
    const fretePorDia = {};
    registros.forEach((reg) => {
        const iso = relatorioDateToISO(reg.data);
        if (!iso || !businessDaysSet.has(iso)) return;
        fretePorDia[iso] = (fretePorDia[iso] || 0) + (reg.frete || 0);
    });
    const fmtDateBR = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dailyRows = businessDays.map((iso) => {
        const totalDia = fretePorDia[iso] || 0;
        const pctDia = metaDia > 0 ? (totalDia / metaDia) * 100 : 0;
        const statusClass = pctDia >= 100 ? 'text-emerald-600' : pctDia >= 80 ? 'text-amber-600' : 'text-red-600';
        const day = new Date(`${iso}T00:00:00`);
        return `
            <tr class="border-t border-border">
                <td class="px-3 py-2 text-xs">${fmtDateBR(iso)} · ${weekdays[day.getDay()]}</td>
                <td class="px-3 py-2 text-right text-xs">${formatCurrency(metaDia)}</td>
                <td class="px-3 py-2 text-right text-xs">${formatCurrency(totalDia)}</td>
                <td class="px-3 py-2 text-right text-xs ${statusClass}">${metaDia > 0 ? pctDia.toFixed(1) + '%' : '—'}</td>
            </tr>
        `;
    }).join('');
    
    registros.forEach(reg => {
        const frete = reg.frete || 0;
        const vendedor = reg.vendedor || 'Sem vendedor';
        const cliente = reg.cliente || 'Cliente não informado';
        
        fretePorVendedor[vendedor] = (fretePorVendedor[vendedor] || 0) + frete;
        fretePorCliente[cliente] = (fretePorCliente[cliente] || 0) + frete;
    });
    
    const topVendedores = Object.entries(fretePorVendedor)
        .map(([nome, frete]) => ({ nome, frete }))
        .sort((a, b) => b.frete - a.frete)
        .slice(0, 10);
    
    const topClientes = Object.entries(fretePorCliente)
        .map(([nome, frete]) => ({ nome, frete }))
        .sort((a, b) => b.frete - a.frete)
        .slice(0, 10);

    const chartLabels = businessDays.map((iso) => {
        const day = new Date(`${iso}T00:00:00`);
        return `${fmtDateBR(iso)} · ${weekdays[day.getDay()]}`;
    });
    const chartValues = businessDays.map((iso) => fretePorDia[iso] || 0);
    const chartMeta = businessDays.map(() => metaDia);
    relatorioFreteMetaChartData = {
        labels: chartLabels,
        valores: chartValues,
        metas: chartMeta
    };
    
    return `
        <div class="space-y-6">
            <div class="rounded-lg border bg-muted/30 p-4">
                <div class="flex gap-2 mb-4">
                    <button type="button" onclick="switchFreteTab('meta')" data-frete-tab-btn="meta"
                            class="px-3 py-1 rounded-md text-xs font-medium border border-input bg-background text-foreground">
                        Meta
                    </button>
                    <button type="button" onclick="switchFreteTab('grafico')" data-frete-tab-btn="grafico"
                            class="px-3 py-1 rounded-md text-xs font-medium border border-input bg-muted/40 text-muted-foreground">
                        Gráfico
                    </button>
                    <button type="button" onclick="switchFreteTab('calc')" data-frete-tab-btn="calc"
                            class="px-3 py-1 rounded-md text-xs font-medium border border-input bg-muted/40 text-muted-foreground">
                        Cálculo
                    </button>
                </div>
                <div data-frete-tab="meta">
                    <h4 class="font-semibold mb-4 flex items-center gap-2">
                        <i class="fas fa-bullseye text-primary"></i>
                        Faixa Frete x Meta
                    </h4>
                    <div class="space-y-3 text-sm">
                        <div class="bg-background rounded p-3">
                            <p><strong>Frete atual:</strong> ${formatCurrency(totalFrete)}</p>
                            <p><strong>Meta:</strong> ${metaValor > 0 ? formatCurrency(metaValor) : '—'}</p>
                        </div>
                        <div class="bg-background rounded p-3">
                            <p class="mb-2"><strong>Progresso:</strong> ${pctMetaSafe.toFixed(1)}%${pctExtra}</p>
                            ${renderRelatorioProgressBar(progressStyles.pct)}
                        </div>
                        <div class="bg-background rounded p-3">
                            <p><strong>Dias úteis no mês:</strong> ${businessDays.length}</p>
                            <p><strong>Meta diária:</strong> ${metaDia > 0 ? formatCurrency(metaDia) : '—'}</p>
                            <p><strong>Hoje (${dailyInfo.refISO ? fmtDateBR(dailyInfo.refISO) : '—'}):</strong> ${formatCurrency(dailyInfo.totalDia)} (${dailyInfo.metaDia > 0 ? dailyInfo.pctDia.toFixed(1) + '%' : '—'})</p>
                        </div>
                        <div class="bg-background rounded p-3">
                            <div class="flex items-center justify-between mb-2">
                                <p class="font-semibold">Atingimento diário (dias úteis)</p>
                                <button type="button" onclick="toggleFreteDailyTable(this)"
                                        class="text-xs text-muted-foreground hover:text-foreground">
                                    Expandir
                                </button>
                            </div>
                            <div class="overflow-auto rounded border border-border" data-frete-table-wrap style="max-height: 15rem;">
                                <table class="w-full text-xs">
                                    <thead class="bg-muted/50 sticky top-0">
                                        <tr>
                                            <th class="px-3 py-2 text-left">Dia</th>
                                            <th class="px-3 py-2 text-right">Meta/dia</th>
                                            <th class="px-3 py-2 text-right">Realizado</th>
                                            <th class="px-3 py-2 text-right">% Dia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${dailyRows || '<tr><td colspan="4" class="px-3 py-3 text-center text-muted-foreground">Sem dados por dia útil.</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="bg-blue-50 dark:bg-blue-950/20 rounded p-3 border border-blue-200 dark:border-blue-800">
                            <p class="text-xs text-muted-foreground mb-1">Observação:</p>
                            <p class="text-xs">A meta de frete é o parâmetro base para o valor bruto do mês.</p>
                        </div>
                    </div>
                </div>
                <div data-frete-tab="grafico" class="hidden">
                    <h4 class="font-semibold mb-4 flex items-center gap-2">
                        <i class="fas fa-chart-bar text-primary"></i>
                        Gráfico diário (Meta x Realizado)
                    </h4>
                    <div class="bg-background rounded p-3">
                        <div class="relative w-full h-[280px]">
                            <canvas id="chart-frete-meta-diario" class="w-full h-full"></canvas>
                        </div>
                    </div>
                </div>
                <div data-frete-tab="calc" class="hidden">
                <h4 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-calculator text-primary"></i>
                    Cálculo do Total de Frete
                </h4>
                <div class="space-y-3 text-sm">
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Fórmula:</strong></p>
                        <p class="font-mono bg-muted p-2 rounded">Total Frete = Σ (frete de cada operação)</p>
                    </div>
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Processo de Cálculo:</strong></p>
                        <ol class="list-decimal list-inside space-y-1 ml-2">
                            <li>Para cada registro, somar o campo <code class="bg-muted px-1 rounded">frete</code></li>
                            <li>Total de registros processados: <strong>${formatNumber(registros.length)}</strong></li>
                            <li>Soma de todos os fretes: <strong>${formatCurrency(totalFrete)}</strong></li>
                        </ol>
                    </div>
                    <div class="bg-blue-50 dark:bg-blue-950/20 rounded p-3 border border-blue-200 dark:border-blue-800">
                        <p class="font-semibold text-blue-700 dark:text-blue-300">Resultado Final:</p>
                        <p class="text-2xl font-bold text-blue-600">${formatCurrency(totalFrete)}</p>
                    </div>
                    <div class="bg-blue-50 dark:bg-blue-950/20 rounded p-3 border border-blue-200 dark:border-blue-800">
                        <p class="text-xs text-muted-foreground mb-1">Importante:</p>
                        <p class="text-xs">O Frete é o valor recebido pelo transportador pela prestação do serviço de transporte. Este é o valor usado para cálculo da margem.</p>
                    </div>
                </div>
                </div>
            </div>
            
            <div class="grid gap-4 md:grid-cols-2 hidden" data-frete-extra="tops">
                <div class="rounded-lg border bg-muted/30 p-4">
                    <h5 class="font-semibold mb-3">Top 10 Vendedores por Frete</h5>
                    <div class="space-y-2 text-sm">
                        ${topVendedores.map((v, idx) => `
                            <div class="flex justify-between items-center p-2 bg-background rounded">
                                <span class="flex items-center gap-2">
                                    <span class="text-xs text-muted-foreground">${idx + 1}.</span>
                                    <span>${escapeHtml(v.nome)}</span>
                                </span>
                                <span class="font-semibold text-blue-600">${formatCurrency(v.frete)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="rounded-lg border bg-muted/30 p-4">
                    <h5 class="font-semibold mb-3">Top 10 Clientes por Frete</h5>
                    <div class="space-y-2 text-sm">
                        ${topClientes.map((c, idx) => `
                            <div class="flex justify-between items-center p-2 bg-background rounded">
                                <span class="flex items-center gap-2">
                                    <span class="text-xs text-muted-foreground">${idx + 1}.</span>
                                    <span>${escapeHtml(c.nome)}</span>
                                </span>
                                <span class="font-semibold text-blue-600">${formatCurrency(c.frete)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function switchFreteTab(tab) {
    document.querySelectorAll('[data-frete-tab]').forEach((el) => {
        el.classList.toggle('hidden', el.getAttribute('data-frete-tab') !== tab);
    });
    document.querySelectorAll('[data-frete-extra]').forEach((el) => {
        el.classList.toggle('hidden', tab === 'meta' || tab === 'grafico');
    });
    document.querySelectorAll('[data-frete-tab-btn]').forEach((btn) => {
        const active = btn.getAttribute('data-frete-tab-btn') === tab;
        btn.classList.toggle('bg-background', active);
        btn.classList.toggle('text-foreground', active);
        btn.classList.toggle('bg-muted/40', !active);
        btn.classList.toggle('text-muted-foreground', !active);
    });
    if (tab === 'grafico') {
        renderRelatorioFreteMetaChart();
    }
}

function toggleFreteDailyTable(button) {
    const wrap = button?.closest('[data-frete-tab="meta"]')?.querySelector('[data-frete-table-wrap]');
    if (!wrap) return;
    const expanded = wrap.dataset.expanded === 'true';
    wrap.dataset.expanded = expanded ? 'false' : 'true';
    wrap.style.maxHeight = expanded ? '15rem' : '70vh';
    if (button) button.textContent = expanded ? 'Expandir' : 'Recolher';
}

function renderRelatorioFreteMetaChart() {
    const ctx = document.getElementById('chart-frete-meta-diario');
    if (!ctx) return;
    const data = relatorioFreteMetaChartData;
    if (!data || !Array.isArray(data.labels)) return;

    if (relatorioCharts.freteMetaDaily) {
        relatorioCharts.freteMetaDaily.destroy();
    }

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');

    relatorioCharts.freteMetaDaily = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Realizado',
                    data: data.valores || [],
                    backgroundColor: gradient,
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Meta/Dia',
                    data: data.metas || [],
                    backgroundColor: 'rgba(16, 185, 129, 0.35)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y || 0)}`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { maxRotation: 0, minRotation: 0, autoSkip: true, maxTicksLimit: 12 }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => formatCurrency(value)
                    }
                }
            }
        }
    });
}

function gerarDetalhesValorNF(resumo, registros) {
    const totalValorNF = resumo.totalValor;
    const valorNFPorVendedor = {};
    const valorNFPorCliente = {};
    
    registros.forEach(reg => {
        const valorNF = reg.valor || 0; // total_nf_valor
        const vendedor = reg.vendedor || 'Sem vendedor';
        const cliente = reg.cliente || 'Cliente não informado';
        
        valorNFPorVendedor[vendedor] = (valorNFPorVendedor[vendedor] || 0) + valorNF;
        valorNFPorCliente[cliente] = (valorNFPorCliente[cliente] || 0) + valorNF;
    });
    
    const topVendedores = Object.entries(valorNFPorVendedor)
        .map(([nome, valorNF]) => ({ nome, valorNF }))
        .sort((a, b) => b.valorNF - a.valorNF)
        .slice(0, 10);
    
    const topClientes = Object.entries(valorNFPorCliente)
        .map(([nome, valorNF]) => ({ nome, valorNF }))
        .sort((a, b) => b.valorNF - a.valorNF)
        .slice(0, 10);
    
    return `
        <div class="space-y-6">
            <div class="rounded-lg border bg-muted/30 p-4">
                <h4 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-calculator text-primary"></i>
                    Cálculo do Valor NF (Nota Fiscal)
                </h4>
                <div class="space-y-3 text-sm">
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Fórmula:</strong></p>
                        <p class="font-mono bg-muted p-2 rounded">Valor NF = Σ (total_nf_valor de cada operação)</p>
                    </div>
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Processo de Cálculo:</strong></p>
                        <ol class="list-decimal list-inside space-y-1 ml-2">
                            <li>Para cada registro, somar o campo <code class="bg-muted px-1 rounded">total_nf_valor</code> (valor da nota fiscal)</li>
                            <li>Total de registros processados: <strong>${formatNumber(registros.length)}</strong></li>
                            <li>Soma de todos os valores NF: <strong>${formatCurrency(totalValorNF)}</strong></li>
                        </ol>
                    </div>
                    <div class="bg-purple-50 dark:bg-purple-950/20 rounded p-3 border border-purple-200 dark:border-purple-800">
                        <p class="font-semibold text-purple-700 dark:text-purple-300">Resultado Final:</p>
                        <p class="text-2xl font-bold text-purple-600">${formatCurrency(totalValorNF)}</p>
                    </div>
                    <div class="bg-purple-50 dark:bg-purple-950/20 rounded p-3 border border-purple-200 dark:border-purple-800">
                        <p class="text-xs text-muted-foreground mb-1">Definição:</p>
                        <p class="text-xs">O Valor NF representa o valor total das notas fiscais dos clientes. Este é diferente do Frete, que é o valor recebido pelo transportador.</p>
                    </div>
                </div>
            </div>
            
            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-lg border bg-muted/30 p-4">
                    <h5 class="font-semibold mb-3">Top 10 Vendedores por Valor NF</h5>
                    <div class="space-y-2 text-sm">
                        ${topVendedores.map((v, idx) => `
                            <div class="flex justify-between items-center p-2 bg-background rounded">
                                <span class="flex items-center gap-2">
                                    <span class="text-xs text-muted-foreground">${idx + 1}.</span>
                                    <span>${escapeHtml(v.nome)}</span>
                                </span>
                                <span class="font-semibold text-purple-600">${formatCurrency(v.valorNF)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="rounded-lg border bg-muted/30 p-4">
                    <h5 class="font-semibold mb-3">Top 10 Clientes por Valor NF</h5>
                    <div class="space-y-2 text-sm">
                        ${topClientes.map((c, idx) => `
                            <div class="flex justify-between items-center p-2 bg-background rounded">
                                <span class="flex items-center gap-2">
                                    <span class="text-xs text-muted-foreground">${idx + 1}.</span>
                                    <span>${escapeHtml(c.nome)}</span>
                                </span>
                                <span class="font-semibold text-purple-600">${formatCurrency(c.valorNF)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function gerarDetalhesValor(resumo, registros) {
    const totalValor = resumo.totalValor;
    const valorPorVendedor = {};
    const valorPorCliente = {};
    
    registros.forEach(reg => {
        const valor = reg.valor || 0;
        const vendedor = reg.vendedor || 'Sem vendedor';
        const cliente = reg.cliente || 'Cliente não informado';
        
        valorPorVendedor[vendedor] = (valorPorVendedor[vendedor] || 0) + valor;
        valorPorCliente[cliente] = (valorPorCliente[cliente] || 0) + valor;
    });
    
    const topVendedores = Object.entries(valorPorVendedor)
        .map(([nome, valor]) => ({ nome, valor }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 10);
    
    const topClientes = Object.entries(valorPorCliente)
        .map(([nome, valor]) => ({ nome, valor }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 10);
    
    return `
        <div class="space-y-6">
            <div class="rounded-lg border bg-muted/30 p-4">
                <h4 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-calculator text-primary"></i>
                    Cálculo do Valor Bruto
                </h4>
                <div class="space-y-3 text-sm">
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Fórmula:</strong></p>
                        <p class="font-mono bg-muted p-2 rounded">Valor Bruto = Σ (valor de cada operação)</p>
                    </div>
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Processo de Cálculo:</strong></p>
                        <ol class="list-decimal list-inside space-y-1 ml-2">
                            <li>Para cada registro, somar o campo <code class="bg-muted px-1 rounded">valor</code> (frete/receita)</li>
                            <li>Total de registros processados: <strong>${formatNumber(registros.length)}</strong></li>
                            <li>Soma de todos os valores: <strong>${formatCurrency(totalValor)}</strong></li>
                        </ol>
                    </div>
                    <div class="bg-emerald-50 dark:bg-emerald-950/20 rounded p-3 border border-emerald-200 dark:border-emerald-800">
                        <p class="font-semibold text-emerald-700 dark:text-emerald-300">Resultado Final:</p>
                        <p class="text-2xl font-bold text-emerald-600">${formatCurrency(totalValor)}</p>
                    </div>
                </div>
            </div>
            
            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-lg border bg-muted/30 p-4">
                    <h5 class="font-semibold mb-3">Top 10 Vendedores por Valor</h5>
                    <div class="space-y-2 text-sm">
                        ${topVendedores.map((v, idx) => `
                            <div class="flex justify-between items-center p-2 bg-background rounded">
                                <span class="flex items-center gap-2">
                                    <span class="text-xs text-muted-foreground">${idx + 1}.</span>
                                    <span>${escapeHtml(v.nome)}</span>
                                </span>
                                <span class="font-semibold text-emerald-600">${formatCurrency(v.valor)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="rounded-lg border bg-muted/30 p-4">
                    <h5 class="font-semibold mb-3">Top 10 Clientes por Valor</h5>
                    <div class="space-y-2 text-sm">
                        ${topClientes.map((c, idx) => `
                            <div class="flex justify-between items-center p-2 bg-background rounded">
                                <span class="flex items-center gap-2">
                                    <span class="text-xs text-muted-foreground">${idx + 1}.</span>
                                    <span>${escapeHtml(c.nome)}</span>
                                </span>
                                <span class="font-semibold text-emerald-600">${formatCurrency(c.valor)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function gerarDetalhesResultado(resumo, registros) {
    const totalResultado = resumo.totalResultado;
    const totalFrete = resumo.totalFrete || 0;
    const totalCustos = resumo.totalCustos;
    const totalImpostos = resumo.totalImpostos;
    
    return `
        <div class="space-y-6">
            <div class="rounded-lg border bg-muted/30 p-4">
                <h4 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-calculator text-primary"></i>
                    Cálculo do Resultado Líquido
                </h4>
                <div class="space-y-3 text-sm">
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Fórmula:</strong></p>
                        <p class="font-mono bg-muted p-2 rounded">Resultado Líquido = Total Frete - Custos - Impostos</p>
                    </div>
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Processo de Cálculo Passo a Passo:</strong></p>
                        <div class="space-y-2">
                            <div class="flex justify-between items-center p-2 bg-muted rounded">
                                <span>1. Total Frete = Σ (frete de cada operação):</span>
                                <span class="font-semibold text-emerald-600">${formatCurrency(totalFrete)}</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-muted rounded">
                                <span>2. Total de Custos Operacionais:</span>
                                <span class="font-semibold text-red-600">- ${formatCurrency(totalCustos)}</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-muted rounded">
                                <span>3. Total de Impostos:</span>
                                <span class="font-semibold text-orange-600">- ${formatCurrency(totalImpostos)}</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded mt-3">
                                <span class="font-semibold">Resultado Líquido:</span>
                                <span class="text-2xl font-bold ${totalResultado >= 0 ? 'text-emerald-600' : 'text-red-600'}">${formatCurrency(totalResultado)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-blue-50 dark:bg-blue-950/20 rounded p-3 border border-blue-200 dark:border-blue-800">
                        <p class="text-xs text-muted-foreground mb-1">Observação:</p>
                        <p class="text-xs">O Resultado Líquido representa o lucro/prejuízo após deduzir todos os custos operacionais e impostos da receita bruta.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function gerarDetalhesTicketMedio(resumo, registros) {
    const ticketMedio = resumo.ticketMedio;
    const totalFrete = resumo.totalFrete || 0;
    const totalValor = resumo.totalValor;
    const totalOperacoes = resumo.totalOperacoes;
    const baseUsada = totalFrete > 0 ? 'Frete' : 'Valor NF';
    const valorBase = totalFrete > 0 ? totalFrete : totalValor;
    
    return `
        <div class="space-y-6">
            <div class="rounded-lg border bg-muted/30 p-4">
                <h4 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-calculator text-primary"></i>
                    Cálculo do Ticket Médio
                </h4>
                <div class="space-y-3 text-sm">
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Fórmula:</strong></p>
                        <p class="font-mono bg-muted p-2 rounded">Ticket Médio = ${baseUsada} Total ÷ Total de Operações</p>
                    </div>
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Processo de Cálculo Passo a Passo:</strong></p>
                        <div class="space-y-2">
                            <div class="flex justify-between items-center p-2 bg-muted rounded">
                                <span>1. ${baseUsada} Total:</span>
                                <span class="font-semibold ${totalFrete > 0 ? 'text-blue-600' : 'text-emerald-600'}">${formatCurrency(valorBase)}</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-muted rounded">
                                <span>2. Total de Operações:</span>
                                <span class="font-semibold">${formatNumber(totalOperacoes)}</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-muted rounded">
                                <span>3. Cálculo:</span>
                                <span class="font-mono text-xs">${formatCurrency(valorBase)} ÷ ${formatNumber(totalOperacoes)}</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded mt-3">
                                <span class="font-semibold">Ticket Médio:</span>
                                <span class="text-2xl font-bold text-blue-600">${formatCurrency(ticketMedio)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-blue-50 dark:bg-blue-950/20 rounded p-3 border border-blue-200 dark:border-blue-800">
                        <p class="text-xs text-muted-foreground mb-1">Definição:</p>
                        <p class="text-xs">O Ticket Médio representa o valor médio de frete por operação, calculado dividindo o total de frete pela quantidade de operações. ${totalFrete > 0 ? 'Baseado no frete (valor recebido pelo transportador).' : 'Baseado no valor NF (valor da nota fiscal).'}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function gerarDetalhesCustos(resumo, registros) {
    const totalCustos = resumo.totalCustos;
    const custosPorVendedor = {};
    const custosPorCliente = {};
    
    registros.forEach(reg => {
        const custos = reg.custos || 0;
        const vendedor = reg.vendedor || 'Sem vendedor';
        const cliente = reg.cliente || 'Cliente não informado';
        
        custosPorVendedor[vendedor] = (custosPorVendedor[vendedor] || 0) + custos;
        custosPorCliente[cliente] = (custosPorCliente[cliente] || 0) + custos;
    });
    
    const topVendedores = Object.entries(custosPorVendedor)
        .map(([nome, custos]) => ({ nome, custos }))
        .sort((a, b) => b.custos - a.custos)
        .slice(0, 10);
    
    return `
        <div class="space-y-6">
            <div class="rounded-lg border bg-muted/30 p-4">
                <h4 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-calculator text-primary"></i>
                    Cálculo do Total de Custos
                </h4>
                <div class="space-y-3 text-sm">
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Fórmula:</strong></p>
                        <p class="font-mono bg-muted p-2 rounded">Total Custos = Σ (custos operacionais de cada registro)</p>
                    </div>
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Processo de Cálculo:</strong></p>
                        <ol class="list-decimal list-inside space-y-1 ml-2">
                            <li>Para cada registro, somar o campo <code class="bg-muted px-1 rounded">custos</code> (custos operacionais)</li>
                            <li>Total de registros processados: <strong>${formatNumber(registros.length)}</strong></li>
                            <li>Soma de todos os custos: <strong>${formatCurrency(totalCustos)}</strong></li>
                        </ol>
                    </div>
                    <div class="bg-red-50 dark:bg-red-950/20 rounded p-3 border border-red-200 dark:border-red-800">
                        <p class="font-semibold text-red-700 dark:text-red-300">Resultado Final:</p>
                        <p class="text-2xl font-bold text-red-600">${formatCurrency(totalCustos)}</p>
                    </div>
                </div>
            </div>
            
            <div class="rounded-lg border bg-muted/30 p-4">
                <h5 class="font-semibold mb-3">Top 10 Vendedores por Custos</h5>
                <div class="space-y-2 text-sm">
                    ${topVendedores.map((v, idx) => `
                        <div class="flex justify-between items-center p-2 bg-background rounded">
                            <span class="flex items-center gap-2">
                                <span class="text-xs text-muted-foreground">${idx + 1}.</span>
                                <span>${escapeHtml(v.nome)}</span>
                            </span>
                            <span class="font-semibold text-red-600">${formatCurrency(v.custos)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function gerarDetalhesImpostos(resumo, registros) {
    const totalImpostos = resumo.totalImpostos;
    const impostosPorVendedor = {};
    
    registros.forEach(reg => {
        const impostos = reg.impostos || 0;
        const vendedor = reg.vendedor || 'Sem vendedor';
        impostosPorVendedor[vendedor] = (impostosPorVendedor[vendedor] || 0) + impostos;
    });
    
    const topVendedores = Object.entries(impostosPorVendedor)
        .map(([nome, impostos]) => ({ nome, impostos }))
        .sort((a, b) => b.impostos - a.impostos)
        .slice(0, 10);
    
    return `
        <div class="space-y-6">
            <div class="rounded-lg border bg-muted/30 p-4">
                <h4 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-calculator text-primary"></i>
                    Cálculo do Total de Impostos
                </h4>
                <div class="space-y-3 text-sm">
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Fórmula:</strong></p>
                        <p class="font-mono bg-muted p-2 rounded">Total Impostos = Σ (impostos de cada registro)</p>
                    </div>
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Processo de Cálculo:</strong></p>
                        <ol class="list-decimal list-inside space-y-1 ml-2">
                            <li>Para cada registro, somar o campo <code class="bg-muted px-1 rounded">impostos</code></li>
                            <li>Total de registros processados: <strong>${formatNumber(registros.length)}</strong></li>
                            <li>Soma de todos os impostos: <strong>${formatCurrency(totalImpostos)}</strong></li>
                        </ol>
                    </div>
                    <div class="bg-orange-50 dark:bg-orange-950/20 rounded p-3 border border-orange-200 dark:border-orange-800">
                        <p class="font-semibold text-orange-700 dark:text-orange-300">Resultado Final:</p>
                        <p class="text-2xl font-bold text-orange-600">${formatCurrency(totalImpostos)}</p>
                    </div>
                </div>
            </div>
            
            <div class="rounded-lg border bg-muted/30 p-4">
                <h5 class="font-semibold mb-3">Top 10 Vendedores por Impostos</h5>
                <div class="space-y-2 text-sm">
                    ${topVendedores.map((v, idx) => `
                        <div class="flex justify-between items-center p-2 bg-background rounded">
                            <span class="flex items-center gap-2">
                                <span class="text-xs text-muted-foreground">${idx + 1}.</span>
                                <span>${escapeHtml(v.nome)}</span>
                            </span>
                            <span class="font-semibold text-orange-600">${formatCurrency(v.impostos)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function gerarDetalhesPrejuizos(resumo, registros) {
    const totalPrejuizos = resumo.totalPrejuizos;
    const prejuizosPorVendedor = {};
    const prejuizosPorCliente = {};
    const registrosComPrejuizo = registros.filter(r => (r.prejuizo || 0) > 0);
    
    registrosComPrejuizo.forEach(reg => {
        const prejuizo = reg.prejuizo || 0;
        const vendedor = reg.vendedor || 'Sem vendedor';
        const cliente = reg.cliente || 'Cliente não informado';
        
        prejuizosPorVendedor[vendedor] = (prejuizosPorVendedor[vendedor] || 0) + prejuizo;
        prejuizosPorCliente[cliente] = (prejuizosPorCliente[cliente] || 0) + prejuizo;
    });
    
    const topVendedores = Object.entries(prejuizosPorVendedor)
        .map(([nome, prejuizo]) => ({ nome, prejuizo }))
        .sort((a, b) => b.prejuizo - a.prejuizo)
        .slice(0, 10);
    
    const topClientes = Object.entries(prejuizosPorCliente)
        .map(([nome, prejuizo]) => ({ nome, prejuizo }))
        .sort((a, b) => b.prejuizo - a.prejuizo)
        .slice(0, 10);
    
    return `
        <div class="space-y-6">
            <div class="rounded-lg border bg-muted/30 p-4">
                <h4 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-calculator text-primary"></i>
                    Cálculo dos Prejuízos
                </h4>
                <div class="space-y-3 text-sm">
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Fórmula:</strong></p>
                        <p class="font-mono bg-muted p-2 rounded">Prejuízos = Σ (prejuízo de cada registro onde resultado < 0)</p>
                    </div>
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Processo de Cálculo:</strong></p>
                        <ol class="list-decimal list-inside space-y-1 ml-2">
                            <li>Identificar registros com resultado negativo (prejuízo)</li>
                            <li>Total de registros com prejuízo: <strong>${formatNumber(registrosComPrejuizo.length)}</strong></li>
                            <li>Soma de todos os prejuízos: <strong>${formatCurrency(totalPrejuizos)}</strong></li>
                        </ol>
                    </div>
                    <div class="bg-red-50 dark:bg-red-950/20 rounded p-3 border border-red-200 dark:border-red-800">
                        <p class="font-semibold text-red-700 dark:text-red-300">Resultado Final:</p>
                        <p class="text-2xl font-bold text-red-600">${formatCurrency(totalPrejuizos)}</p>
                    </div>
                </div>
            </div>
            
            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-lg border bg-muted/30 p-4">
                    <h5 class="font-semibold mb-3">Top 10 Vendedores com Prejuízos</h5>
                    <div class="space-y-2 text-sm">
                        ${topVendedores.length > 0 ? topVendedores.map((v, idx) => `
                            <div class="flex justify-between items-center p-2 bg-background rounded">
                                <span class="flex items-center gap-2">
                                    <span class="text-xs text-muted-foreground">${idx + 1}.</span>
                                    <span>${escapeHtml(v.nome)}</span>
                                </span>
                                <span class="font-semibold text-red-600">${formatCurrency(v.prejuizo)}</span>
                            </div>
                        `).join('') : '<p class="text-muted-foreground text-center py-4">Nenhum prejuízo identificado</p>'}
                    </div>
                </div>
                <div class="rounded-lg border bg-muted/30 p-4">
                    <h5 class="font-semibold mb-3">Top 10 Clientes com Prejuízos</h5>
                    <div class="space-y-2 text-sm">
                        ${topClientes.length > 0 ? topClientes.map((c, idx) => `
                            <div class="flex justify-between items-center p-2 bg-background rounded">
                                <span class="flex items-center gap-2">
                                    <span class="text-xs text-muted-foreground">${idx + 1}.</span>
                                    <span>${escapeHtml(c.nome)}</span>
                                </span>
                                <span class="font-semibold text-red-600">${formatCurrency(c.prejuizo)}</span>
                            </div>
                        `).join('') : '<p class="text-muted-foreground text-center py-4">Nenhum prejuízo identificado</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function gerarDetalhesMargem(resumo, registros) {
    const margemPercentual = resumo.margemPercentual;
    const totalResultado = resumo.totalResultado;
    const totalValor = resumo.totalValor;
    
    return `
        <div class="space-y-6">
            <div class="rounded-lg border bg-muted/30 p-4">
                <h4 class="font-semibold mb-4 flex items-center gap-2">
                    <i class="fas fa-calculator text-primary"></i>
                    Cálculo da Margem Percentual
                </h4>
                <div class="space-y-3 text-sm">
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Fórmula:</strong></p>
                        <p class="font-mono bg-muted p-2 rounded">Margem % = (Resultado Líquido ÷ Valor Bruto) × 100</p>
                    </div>
                    <div class="bg-background rounded p-3">
                        <p class="mb-2"><strong>Processo de Cálculo Passo a Passo:</strong></p>
                        <div class="space-y-2">
                            <div class="flex justify-between items-center p-2 bg-muted rounded">
                                <span>1. Resultado Líquido:</span>
                                <span class="font-semibold ${totalResultado >= 0 ? 'text-emerald-600' : 'text-red-600'}">${formatCurrency(totalResultado)}</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-muted rounded">
                                <span>2. Valor Bruto (Receita):</span>
                                <span class="font-semibold text-emerald-600">${formatCurrency(totalValor)}</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-muted rounded">
                                <span>3. Cálculo:</span>
                                <span class="font-mono text-xs">(${formatCurrency(totalResultado)} ÷ ${formatCurrency(totalValor)}) × 100</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded mt-3">
                                <span class="font-semibold">Margem Percentual:</span>
                                <span class="text-2xl font-bold ${margemPercentual >= 0 ? 'text-blue-600' : 'text-red-600'}">${margemPercentual.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-blue-50 dark:bg-blue-950/20 rounded p-3 border border-blue-200 dark:border-blue-800">
                        <p class="text-xs text-muted-foreground mb-1">Definição:</p>
                        <p class="text-xs">A Margem Percentual indica qual porcentagem do valor bruto representa o lucro líquido após deduzir custos e impostos.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAnaliseFinanceiraDetalhada(resumo) {
    // Atualizar cards de resumo
    document.getElementById('analise-receita-total').textContent = formatCurrency(resumo.totalReceita);
    document.getElementById('analise-custos-operacionais').textContent = formatCurrency(resumo.totalCustos);
    document.getElementById('analise-ebtida').textContent = formatCurrency(resumo.totalEBTIDA);
    document.getElementById('analise-ebtida-percentual').textContent = resumo.ebtidaPercentual.toFixed(2) + '% da receita';
    document.getElementById('analise-impostos-total').textContent = formatCurrency(resumo.totalImpostos);
    document.getElementById('analise-impostos-percentual').textContent = resumo.impostosPercentual.toFixed(2) + '% da receita';

    // Gráfico 1: Composição Financeira (Barras Empilhadas)
    const ctx1 = document.getElementById('chart-composicao-financeira');
    if (ctx1) {
        // Destruir gráfico anterior se existir
        if (relatorioCharts.composicao) {
            relatorioCharts.composicao.destroy();
        }
        
        relatorioCharts.composicao = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Composição Financeira'],
                datasets: [
                    {
                        label: 'Receita',
                        data: [resumo.totalReceita],
                        backgroundColor: 'rgba(34, 197, 94, 0.7)',
                        borderColor: 'rgb(34, 197, 94)',
                        borderWidth: 1
                    },
                    {
                        label: 'Custos Operacionais',
                        data: [resumo.totalCustos],
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: 'rgb(239, 68, 68)',
                        borderWidth: 1
                    },
                    {
                        label: 'Impostos',
                        data: [resumo.totalImpostos],
                        backgroundColor: 'rgba(249, 115, 22, 0.7)',
                        borderColor: 'rgb(249, 115, 22)',
                        borderWidth: 1
                    },
                    {
                        label: 'EBTIDA',
                        data: [resumo.totalEBTIDA],
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: { top: 10, bottom: 10, left: 10, right: 10 }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 11 },
                            padding: 12,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = formatCurrency(context.parsed.x);
                                const total = resumo.totalReceita;
                                const percent = total > 0 ? ((context.parsed.x / total) * 100).toFixed(2) : 0;
                                return `${label}: ${value} (${percent}% da receita)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: false,
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                            },
                            font: { size: 10 }
                        }
                    },
                    y: {
                        stacked: false,
                        ticks: {
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }

    // Gráfico 2: EBTIDA por Vendedor
    const ctx2 = document.getElementById('chart-ebtida-vendedores');
    if (ctx2) {
        // Destruir gráfico anterior se existir
        if (relatorioCharts.ebtida) {
            relatorioCharts.ebtida.destroy();
        }

        const topVendedores = resumo.vendedores.slice(0, 10);
        // Truncar nomes para caber na horizontal: 8 caracteres
        const labels = topVendedores.map(v => {
            const nome = v.nome || 'Sem vendedor';
            return nome.length > 8 ? nome.substring(0, 8) + '...' : nome;
        });

        relatorioCharts.ebtida = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'EBTIDA',
                        data: topVendedores.map(v => v.ebtida || 0),
                        backgroundColor: topVendedores.map(v => (v.ebtida || 0) >= 0 ? 'rgba(59, 130, 246, 0.7)' : 'rgba(239, 68, 68, 0.7)'),
                        borderColor: topVendedores.map(v => (v.ebtida || 0) >= 0 ? 'rgb(59, 130, 246)' : 'rgb(239, 68, 68)'),
                        borderWidth: 1
                    },
                    {
                        label: 'Impostos',
                        data: topVendedores.map(v => v.impostosTotal),
                        backgroundColor: 'rgba(249, 115, 22, 0.7)',
                        borderColor: 'rgb(249, 115, 22)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: { top: 10, bottom: 30, left: 10, right: 10 }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { font: { size: 10 }, padding: 8 }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                // Mostrar nome completo no tooltip
                                const index = context[0].dataIndex;
                                return topVendedores[index]?.nome || 'Sem vendedor';
                            },
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = formatCurrency(context.parsed.y);
                                const vendedor = topVendedores[context.dataIndex];
                                if (label === 'EBTIDA' && vendedor) {
                                    const percent = vendedor.receitaTotal > 0 ? ((vendedor.ebtida || 0) / vendedor.receitaTotal * 100).toFixed(2) : 0;
                                    return `${label}: ${value} (${percent}% da receita)`;
                                } else if (label === 'Impostos' && vendedor) {
                                    const percent = vendedor.receitaTotal > 0 ? (vendedor.impostosTotal / vendedor.receitaTotal * 100).toFixed(2) : 0;
                                    return `${label}: ${value} (${percent}% da receita)`;
                                }
                                return `${label}: ${value}`;
                            }
                        }
                    },
                    onClick: function(evt, elements) {
                        if (elements.length > 0) {
                            const element = elements[0];
                            const index = element.index;
                            const datasetIndex = element.datasetIndex;
                            showChartDetail('ebtida', topVendedores[index], datasetIndex);
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 0,
                            minRotation: 0,
                            font: { size: 9 },
                            autoSkip: false,
                            maxTicksLimit: topVendedores.length
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                            },
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }

    // Tabela detalhada de custos
    const tbody = document.getElementById('analise-custos-tbody');
    if (tbody) {
        tbody.innerHTML = '';
        
        const metricas = [
            {
                nome: 'Receita Total',
                valor: resumo.totalReceita,
                percentReceita: 100,
                percentEBTIDA: '-',
                classe: 'text-emerald-600'
            },
            {
                nome: 'Custos Operacionais',
                valor: resumo.totalCustos,
                percentReceita: resumo.custosPercentual,
                percentEBTIDA: resumo.totalEBTIDA !== 0 ? (resumo.totalCustos / Math.abs(resumo.totalEBTIDA) * 100).toFixed(2) + '%' : '-',
                classe: 'text-red-600'
            },
            {
                nome: 'EBTIDA (Receita - Custos)',
                valor: resumo.totalEBTIDA,
                percentReceita: resumo.ebtidaPercentual,
                percentEBTIDA: '100%',
                classe: 'text-blue-600 font-semibold'
            },
            {
                nome: 'Impostos',
                valor: resumo.totalImpostos,
                percentReceita: resumo.impostosPercentual,
                percentEBTIDA: resumo.totalEBTIDA !== 0 ? (resumo.totalImpostos / Math.abs(resumo.totalEBTIDA) * 100).toFixed(2) + '%' : '-',
                classe: 'text-orange-600'
            },
            {
                nome: 'Resultado Líquido (EBTIDA - Impostos)',
                valor: resumo.totalResultado,
                percentReceita: resumo.margemPercentual,
                percentEBTIDA: resumo.totalEBTIDA !== 0 ? (resumo.totalResultado / Math.abs(resumo.totalEBTIDA) * 100).toFixed(2) + '%' : '-',
                classe: 'text-emerald-700 font-semibold'
            }
        ];

        metricas.forEach(metrica => {
            const percentReceitaStr = typeof metrica.percentReceita === 'number' ? metrica.percentReceita.toFixed(2) + '%' : metrica.percentReceita;
            const percentEBTIDAStr = typeof metrica.percentEBTIDA === 'string' ? metrica.percentEBTIDA : metrica.percentEBTIDA.toFixed(2) + '%';
            tbody.insertAdjacentHTML('beforeend', `
                <tr class="hover:bg-muted/30">
                    <td class="px-4 py-3 font-medium ${metrica.classe}">${escapeHtml(metrica.nome)}</td>
                    <td class="px-4 py-3 text-right font-semibold ${metrica.classe}">${formatCurrency(metrica.valor)}</td>
                    <td class="px-4 py-3 text-right text-muted-foreground">${percentReceitaStr}</td>
                    <td class="px-4 py-3 text-right text-muted-foreground">${percentEBTIDAStr}</td>
                </tr>
            `);
        });
    }

    // Indicadores renderizados em fluxo dedicado (renderRelatorioIndicadores)
}
