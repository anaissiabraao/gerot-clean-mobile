# -*- coding: utf-8 -*-
"""
Modulo de Indicadores Executivos para GEROT
Adiciona calculos financeiros e leituras executivas sem alterar estrutura existente
"""
from typing import Dict, List, Any, Optional
from datetime import datetime, date
from collections import defaultdict


def calcular_faturamento(operacoes: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Calcula faturamento total e por periodo
    Retorna: {
        'total': float,
        'mensal': float,
        'acumulado': float
    }
    """
    total = 0.0
    hoje = datetime.now().date()
    mes_atual_inicio = date(hoje.year, hoje.month, 1)
    ano_atual_inicio = date(hoje.year, 1, 1)
    
    mensal = 0.0
    acumulado = 0.0
    
    for op in operacoes:
        valor_nf = float(op.get('valor_nf') or op.get('total_nf_valor') or op.get('faturamento') or op.get('receita') or 0)
        total += valor_nf
        
        data_op = _extrair_data_operacao(op)
        if data_op:
            if data_op >= mes_atual_inicio:
                mensal += valor_nf
            if data_op >= ano_atual_inicio:
                acumulado += valor_nf
    
    return {
        'total': round(total, 2),
        'mensal': round(mensal, 2),
        'acumulado': round(acumulado, 2)
    }


def calcular_resultado_geral(operacoes: List[Dict[str, Any]], custos_dia: Optional[float] = None) -> Dict[str, Any]:
    """
    Calcula resultado geral (faturamento - custos)
    Se custos nao disponiveis, retorna apenas faturamento
    """
    faturamento = calcular_faturamento(operacoes)
    
    # Tentar calcular custos se disponivel
    custos_total = 0.0
    if custos_dia is not None:
        # Aproximacao: custos do dia * numero de dias uteis no periodo
        custos_total = custos_dia * 22  # Aproximacao mensal
    
    resultado = faturamento['acumulado'] - custos_total if custos_total > 0 else None
    
    return {
        'faturamento': faturamento,
        'custos_total': custos_total if custos_total > 0 else None,
        'resultado': round(resultado, 2) if resultado is not None else None,
        'margem_percent': round((resultado / faturamento['acumulado'] * 100), 2) if resultado and faturamento['acumulado'] > 0 else None
    }


def calcular_performance_entrega_on_time(operacoes: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calcula performance de entrega On Time (%)
    Considera entregas com data prevista vs data real
    """
    entregas = [op for op in operacoes if op.get('tipo_operacao', '').lower() in ['entrega', 'minuta'] or 'entrega' in str(op.get('tipo', '')).lower()]
    
    if not entregas:
        return {
            'total_entregas': 0,
            'on_time': 0,
            'atrasadas': 0,
            'percent_on_time': 0.0,
            'percent_atrasadas': 0.0
        }
    
    on_time = 0
    atrasadas = 0
    sem_data_prevista = 0
    
    for entrega in entregas:
        data_prev = _extrair_data_prevista(entrega)
        data_real = _extrair_data_real(entrega)
        
        if not data_prev:
            sem_data_prevista += 1
            continue
        
        if data_real:
            if data_real <= data_prev:
                on_time += 1
            else:
                atrasadas += 1
        else:
            # Se nao tem data real, considera pendente (nao conta como atrasada ainda)
            sem_data_prevista += 1
    
    total_com_data = on_time + atrasadas
    percent_on_time = (on_time / total_com_data * 100) if total_com_data > 0 else 0.0
    percent_atrasadas = (atrasadas / total_com_data * 100) if total_com_data > 0 else 0.0
    
    return {
        'total_entregas': len(entregas),
        'on_time': on_time,
        'atrasadas': atrasadas,
        'sem_data_prevista': sem_data_prevista,
        'percent_on_time': round(percent_on_time, 2),
        'percent_atrasadas': round(percent_atrasadas, 2)
    }


def calcular_operacoes_negativas(operacoes: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calcula valor total de operacoes com prejuizo
    Considera operacoes onde custo > faturamento (se custo disponivel)
    Ou operacoes com valor_nf muito baixo/zero
    """
    operacoes_negativas = []
    valor_total_prejuizo = 0.0
    
    for op in operacoes:
        valor_nf = float(op.get('valor_nf') or op.get('total_nf_valor') or op.get('faturamento') or op.get('receita') or 0)
        resultado = float(op.get('resultado') or op.get('resultado_liquido') or op.get('lucro_liq') or 0)
        
        # Considera negativo se resultado < 0 ou valor_nf muito baixo
        if resultado < 0 or (valor_nf == 0 or valor_nf < 10):
            operacoes_negativas.append({
                'id': op.get('id_coleta') or op.get('id_minuta') or op.get('id_operacao') or op.get('id'),
                'valor_nf': valor_nf,
                'resultado': resultado,
                'tipo': op.get('tipo_operacao', 'N/A')
            })
            if resultado < 0:
                valor_total_prejuizo += abs(resultado)
            else:
                valor_total_prejuizo += abs(valor_nf - 10)  # Aproximacao
    
    return {
        'quantidade': len(operacoes_negativas),
        'valor_total': round(valor_total_prejuizo, 2),
        'operacoes': operacoes_negativas[:20]  # Limitar a 20 para nao sobrecarregar
    }


def calcular_resultado_por_servico(operacoes: List[Dict[str, Any]]) -> Dict[str, Dict[str, float]]:
    """
    Calcula resultado (faturamento) por servico
    """
    resultado_por_servico = defaultdict(lambda: {'faturamento': 0.0, 'quantidade': 0})
    
    for op in operacoes:
        servico = op.get('servico') or op.get('servico_nome') or op.get('tipo_servico') or 'Nao especificado'
        valor_nf = float(op.get('valor_nf') or op.get('total_nf_valor') or op.get('faturamento') or op.get('receita') or 0)
        
        resultado_por_servico[servico]['faturamento'] += valor_nf
        resultado_por_servico[servico]['quantidade'] += 1
    
    # Converter para dict normal e arredondar
    resultado = {}
    for servico, dados in resultado_por_servico.items():
        resultado[servico] = {
            'faturamento': round(dados['faturamento'], 2),
            'quantidade': dados['quantidade']
        }
    
    return resultado


def calcular_participacao_faturamento(operacoes: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calcula participacao no faturamento: Corporativo x Vendedores
    Base 147 = identificacao de origem corporativa vs vendedores
    """
    faturamento_corporativo = 0.0
    faturamento_vendedores = 0.0
    quantidade_corporativo = 0
    quantidade_vendedores = 0
    
    for op in operacoes:
        valor_nf = float(op.get('valor_nf') or op.get('total_nf_valor') or op.get('faturamento') or op.get('receita') or 0)
        
        # Identificar origem (base 147 = corporativo)
        # Em producao, isso deveria vir de um campo especifico
        vendedor = op.get('vendedor_nome') or op.get('vendedor') or ''
        
        # Heuristica: se tem vendedor nomeado, e vendedor; senao, corporativo
        if vendedor and vendedor.strip() and vendedor.lower() not in ['n/a', 'none', '']:
            faturamento_vendedores += valor_nf
            quantidade_vendedores += 1
        else:
            faturamento_corporativo += valor_nf
            quantidade_corporativo += 1
    
    total = faturamento_corporativo + faturamento_vendedores
    
    return {
        'faturamento_corporativo': round(faturamento_corporativo, 2),
        'faturamento_vendedores': round(faturamento_vendedores, 2),
        'total': round(total, 2),
        'percent_corporativo': round((faturamento_corporativo / total * 100), 2) if total > 0 else 0.0,
        'percent_vendedores': round((faturamento_vendedores / total * 100), 2) if total > 0 else 0.0,
        'quantidade_corporativo': quantidade_corporativo,
        'quantidade_vendedores': quantidade_vendedores
    }


def calcular_inadimplencia(operacoes: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calcula inadimplencia (% e valor)
    Considera operacoes finalizadas ha mais de 30 dias sem pagamento
    """
    hoje = datetime.now().date()
    limite_dias = 30
    
    inadimplentes = []
    valor_inadimplente = 0.0
    
    for op in operacoes:
        status = (op.get('status_descricao') or op.get('status') or '').lower()
        
        # Considera finalizada se status contem 'final' ou 'conclu'
        if 'final' in status or 'conclu' in status:
            data_op = _extrair_data_operacao(op)
            if data_op:
                dias_em_aberto = (hoje - data_op).days
                if dias_em_aberto > limite_dias:
                    valor_nf = float(op.get('valor_nf') or op.get('total_nf_valor') or op.get('faturamento') or op.get('receita') or 0)
                    inadimplentes.append({
                        'id': op.get('id_coleta') or op.get('id_minuta') or op.get('id'),
                        'valor': valor_nf,
                        'dias_em_aberto': dias_em_aberto
                    })
                    valor_inadimplente += valor_nf
    
    faturamento = calcular_faturamento(operacoes)
    percent_inadimplencia = (valor_inadimplente / faturamento['total'] * 100) if faturamento['total'] > 0 else 0.0
    
    return {
        'quantidade': len(inadimplentes),
        'valor_total': round(valor_inadimplente, 2),
        'percent': round(percent_inadimplencia, 2),
        'operacoes': inadimplentes[:20]  # Limitar
    }


def calcular_nivel_operacao_atendimento(operacoes: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calcula Nivel de Operacao e Atendimento (1-2-3-4)
    Baseado em multiplos fatores: taxa atendimento, tempo medio, criticidade
    """
    total_operacoes = len(operacoes)
    if total_operacoes == 0:
        return {
            'nivel': 4,
            'descricao': 'Sem operacoes',
            'cor': 'gray',
            'indicadores': {}
        }
    
    # Taxa de atendimento (operacoes definidas / total)
    operacoes_definidas = sum(1 for op in operacoes if 'pend' not in (op.get('status_descricao') or op.get('status') or '').lower())
    taxa_atendimento = (operacoes_definidas / total_operacoes * 100) if total_operacoes > 0 else 0
    
    # Tempo medio (aproximacao)
    hoje = datetime.now().date()
    tempos = []
    for op in operacoes:
        data_op = _extrair_data_operacao(op)
        if data_op:
            dias = (hoje - data_op).days
            tempos.append(dias)
    tempo_medio = sum(tempos) / len(tempos) if tempos else 0
    
    # Criticidade
    criticidade_alta = sum(1 for op in operacoes if _classificar_criticidade_simples(op) in ['Critica', 'Alta'])
    percent_criticidade = (criticidade_alta / total_operacoes * 100) if total_operacoes > 0 else 0
    
    # Calcular nivel (1 = Excelente, 4 = Critico)
    nivel = 1
    if taxa_atendimento < 80 or tempo_medio > 3 or percent_criticidade > 20:
        nivel = 4
    elif taxa_atendimento < 90 or tempo_medio > 2 or percent_criticidade > 10:
        nivel = 3
    elif taxa_atendimento < 95 or tempo_medio > 1 or percent_criticidade > 5:
        nivel = 2
    
    descricoes = {
        1: 'Excelente',
        2: 'Bom',
        3: 'Atencao',
        4: 'Critico'
    }
    cores = {
        1: 'green',
        2: 'blue',
        3: 'yellow',
        4: 'red'
    }
    
    return {
        'nivel': nivel,
        'descricao': descricoes.get(nivel, 'Indefinido'),
        'cor': cores.get(nivel, 'gray'),
        'indicadores': {
            'taxa_atendimento': round(taxa_atendimento, 1),
            'tempo_medio_dias': round(tempo_medio, 1),
            'percent_criticidade': round(percent_criticidade, 1)
        }
    }


def calcular_resultado_composicoes_rotas(operacoes: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calcula resultado das composicoes de rotas do dia
    Agrupa por veiculo/rota e calcula eficiencia
    """
    hoje = datetime.now().date()
    rotas_hoje = defaultdict(lambda: {
        'operacoes': 0,
        'faturamento': 0.0,
        'peso_total': 0.0,
        'cubagem_total': 0.0
    })
    
    for op in operacoes:
        data_op = _extrair_data_operacao(op)
        if data_op == hoje:
            placa = (op.get('placa') or op.get('veiculo') or '').strip()
            if placa:
                rotas_hoje[placa]['operacoes'] += 1
                rotas_hoje[placa]['faturamento'] += float(op.get('valor_nf') or op.get('total_nf_valor') or op.get('faturamento') or op.get('receita') or 0)
                rotas_hoje[placa]['peso_total'] += float(op.get('peso') or op.get('peso_num') or op.get('total_peso') or 0)
                rotas_hoje[placa]['cubagem_total'] += float(op.get('cubagem') or op.get('total_cubo') or 0)
    
    total_rotas = len(rotas_hoje)
    faturamento_total = sum(r['faturamento'] for r in rotas_hoje.values())
    operacoes_total = sum(r['operacoes'] for r in rotas_hoje.values())
    
    return {
        'total_rotas': total_rotas,
        'faturamento_total': round(faturamento_total, 2),
        'operacoes_total': operacoes_total,
        'faturamento_medio_por_rota': round(faturamento_total / total_rotas, 2) if total_rotas > 0 else 0,
        'detalhes_rotas': {placa: {
            'operacoes': dados['operacoes'],
            'faturamento': round(dados['faturamento'], 2),
            'peso_total': round(dados['peso_total'], 2),
            'cubagem_total': round(dados['cubagem_total'], 2)
        } for placa, dados in rotas_hoje.items()}
    }


def calcular_fluxo_caixa(operacoes: List[Dict[str, Any]], custos_dia: Optional[float] = None) -> Dict[str, Any]:
    """
    Calcula valor atual do fluxo de caixa
    Faturamento - Custos (se disponivel)
    """
    faturamento = calcular_faturamento(operacoes)
    custos_total = custos_dia * 22 if custos_dia else None  # Aproximacao mensal
    
    fluxo = faturamento['acumulado'] - custos_total if custos_total else faturamento['acumulado']
    
    return {
        'valor_atual': round(fluxo, 2) if fluxo else None,
        'faturamento_acumulado': faturamento['acumulado'],
        'custos_total': round(custos_total, 2) if custos_total else None,
        'status': 'positivo' if (fluxo and fluxo > 0) else ('negativo' if fluxo else 'indefinido')
    }


def calcular_projetos(operacoes: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calcula metricas de projetos (se aplicavel)
    Por enquanto, retorna estrutura basica
    """
    # Em producao, isso deveria buscar dados reais de projetos
    # Por enquanto, retorna estrutura vazia
    return {
        'projetos_ativos': 0,
        'projetos_concluidos': 0,
        'projetos_atraso': 0,
        'prazo_medio_dias': None,
        'gargalos': []
    }


def gerar_leitura_executiva_ceo(indicadores: Dict[str, Any]) -> str:
    """
    Gera leitura executiva para CEO
    """
    faturamento = indicadores.get('faturamento', {})
    resultado = indicadores.get('resultado_geral', {})
    performance = indicadores.get('performance_entrega', {})
    operacoes_neg = indicadores.get('operacoes_negativas', {})
    fluxo_caixa = indicadores.get('fluxo_caixa', {})
    
    leitura = []
    
    # Saude Financeira
    resultado_valor = resultado.get('resultado') if resultado else None
    if resultado_valor is not None:
        if resultado_valor > 0:
            leitura.append(f"OK: Saude financeira positiva. Resultado acumulado de R$ {resultado_valor:,.2f}.")
        else:
            leitura.append(f"ALERTA: Saude financeira em atencao. Resultado acumulado negativo de R$ {abs(resultado_valor):,.2f}.")
    else:
        fat_acum = faturamento.get('acumulado', 0)
        leitura.append(f"INFO: Faturamento acumulado de R$ {fat_acum:,.2f}.")
    
    # Qualidade da Execucao
    percent_on_time = performance.get('percent_on_time', 0) if performance else 0
    if percent_on_time >= 95:
        leitura.append(f"OK: Qualidade da execucao excelente. {percent_on_time:.1f}% das entregas no prazo.")
    elif percent_on_time >= 85:
        leitura.append(f"ALERTA: Qualidade da execucao boa, mas pode melhorar. {percent_on_time:.1f}% das entregas no prazo.")
    else:
        leitura.append(f"CRITICO: Qualidade da execucao requer atencao. Apenas {percent_on_time:.1f}% das entregas no prazo.")
    
    # Risco Operacional
    qtd_neg = operacoes_neg.get('quantidade', 0) if operacoes_neg else 0
    if qtd_neg > 0:
        valor_neg = operacoes_neg.get('valor_total', 0)
        leitura.append(f"ALERTA: Risco operacional. {qtd_neg} operacoes com indicativo de prejuizo (R$ {valor_neg:,.2f}).")
    else:
        leitura.append("OK: Risco operacional baixo. Nenhuma operacao negativa identificada.")
    
    # Pressao de Caixa
    status_caixa = fluxo_caixa.get('status', 'indefinido') if fluxo_caixa else 'indefinido'
    if status_caixa == 'positivo':
        valor_caixa = fluxo_caixa.get('valor_atual', 0)
        leitura.append(f"OK: Pressao de caixa baixa. Fluxo positivo de R$ {valor_caixa:,.2f}.")
    elif status_caixa == 'negativo':
        valor_caixa = fluxo_caixa.get('valor_atual', 0)
        leitura.append(f"CRITICO: Pressao de caixa alta. Fluxo negativo de R$ {abs(valor_caixa):,.2f}.")
    else:
        leitura.append("INFO: Pressao de caixa indefinida. Dados de custos nao disponiveis.")
    
    # Onde agir primeiro
    acoes = []
    if percent_on_time < 85:
        acoes.append("Melhorar performance de entrega")
    if qtd_neg > 0:
        acoes.append("Revisar operacoes com prejuizo")
    if status_caixa == 'negativo':
        acoes.append("Reduzir custos ou aumentar faturamento")
    
    if acoes:
        leitura.append(f"ACAO: Onde agir primeiro: {', '.join(acoes)}.")
    else:
        leitura.append("OK: Onde agir primeiro: Manter foco em continuidade operacional.")
    
    return " ".join(leitura)


def gerar_leitura_executiva_diretoria(indicadores: Dict[str, Any]) -> str:
    """
    Gera leitura executiva para Diretoria (Financeiro & Comercial)
    """
    resultado_servico = indicadores.get('resultado_por_servico', {})
    faturamento = indicadores.get('faturamento', {})
    operacoes_neg = indicadores.get('operacoes_negativas', {})
    inadimplencia = indicadores.get('inadimplencia', {})
    participacao = indicadores.get('participacao_faturamento', {})
    fluxo_caixa = indicadores.get('fluxo_caixa', {})
    
    leitura = []
    
    # Faturamento
    fat_mensal = faturamento.get('mensal', 0)
    fat_acum = faturamento.get('acumulado', 0)
    leitura.append(f"INFO: Faturamento mensal R$ {fat_mensal:,.2f} | acumulado R$ {fat_acum:,.2f}.")
    
    # Resultado por servico
    if resultado_servico:
        top_servico = max(resultado_servico.items(), key=lambda x: x[1]['faturamento'], default=None)
        if top_servico:
            leitura.append(f"INFO: Maior faturamento por servico: {top_servico[0]} (R$ {top_servico[1]['faturamento']:,.2f}).")
    
    # Operacoes com prejuizo
    qtd_neg = operacoes_neg.get('quantidade', 0)
    if qtd_neg > 0:
        valor_neg = operacoes_neg.get('valor_total', 0)
        leitura.append(f"ALERTA: Operacoes com prejuizo: {qtd_neg} embarques (R$ {valor_neg:,.2f}).")
    
    # Inadimplencia
    percent_inad = inadimplencia.get('percent', 0)
    if percent_inad > 5:
        valor_inad = inadimplencia.get('valor_total', 0)
        leitura.append(f"CRITICO: Inadimplencia {percent_inad:.1f}% (R$ {valor_inad:,.2f}). Acao imediata necessaria.")
    elif percent_inad > 0:
        valor_inad = inadimplencia.get('valor_total', 0)
        leitura.append(f"ALERTA: Inadimplencia {percent_inad:.1f}% (R$ {valor_inad:,.2f}). Monitorar.")
    else:
        leitura.append("OK: Inadimplencia controlada.")
    
    # Participacao
    if participacao:
        perc_corp = participacao.get('percent_corporativo', 0)
        perc_vend = participacao.get('percent_vendedores', 0)
        leitura.append(f"INFO: Participacao faturamento: Corporativo {perc_corp:.1f}% | Vendedores {perc_vend:.1f}%.")
    
    # Fluxo de caixa
    status_caixa = fluxo_caixa.get('status', 'indefinido')
    if status_caixa == 'positivo':
        leitura.append("OK: Fluxo de caixa positivo.")
    elif status_caixa == 'negativo':
        leitura.append("CRITICO: Fluxo de caixa negativo. Revisar custos.")
    
    return " ".join(leitura)


def gerar_leitura_executiva_operacional(indicadores: Dict[str, Any]) -> str:
    """
    Gera leitura executiva para Operacional & Atendimento
    """
    performance = indicadores.get('performance_entrega', {})
    resultado_rotas = indicadores.get('resultado_composicoes_rotas', {})
    faturamento = indicadores.get('faturamento', {})
    nivel_op = indicadores.get('nivel_operacao_atendimento', {})
    
    leitura = []
    
    # Performance de entrega
    percent_on_time = performance.get('percent_on_time', 0)
    total_entregas = performance.get('total_entregas', 0)
    if percent_on_time >= 95:
        leitura.append(f"OK: Performance de entrega {percent_on_time:.1f}% On Time ({total_entregas} entregas).")
    elif percent_on_time >= 85:
        leitura.append(f"ALERTA: Performance de entrega {percent_on_time:.1f}% On Time. Melhorar.")
    else:
        leitura.append(f"CRITICO: Performance de entrega {percent_on_time:.1f}% On Time. Critico.")
    
    # Resultado das rotas
    if resultado_rotas:
        total_rotas = resultado_rotas.get('total_rotas', 0)
        fat_rotas = resultado_rotas.get('faturamento_total', 0)
        leitura.append(f"INFO: Rotas do dia {total_rotas} rotas ativas (R$ {fat_rotas:,.2f}).")
    
    # Faturamento
    fat_mensal = faturamento.get('mensal', 0)
    fat_acum = faturamento.get('acumulado', 0)
    leitura.append(f"INFO: Faturamento mensal R$ {fat_mensal:,.2f} | acumulado R$ {fat_acum:,.2f}.")
    
    # Nivel de Operacao
    nivel = nivel_op.get('nivel', 0)
    descricao = nivel_op.get('descricao', 'Indefinido')
    if nivel == 1:
        leitura.append(f"OK: Nivel de Operacao {descricao} (Nivel {nivel}).")
    elif nivel == 2:
        leitura.append(f"ALERTA: Nivel de Operacao {descricao} (Nivel {nivel}).")
    else:
        leitura.append(f"CRITICO: Nivel de Operacao {descricao} (Nivel {nivel}). Acao imediata.")
    
    return " ".join(leitura)


def gerar_leitura_executiva_projetos(indicadores: Dict[str, Any]) -> str:
    """
    Gera leitura executiva para Projetos
    """
    projetos = indicadores.get('projetos', {})
    
    leitura = []
    
    ativos = projetos.get('projetos_ativos', 0)
    concluidos = projetos.get('projetos_concluidos', 0)
    atraso = projetos.get('projetos_atraso', 0)
    prazo_medio = projetos.get('prazo_medio_dias', None)
    gargalos = projetos.get('gargalos', [])
    
    leitura.append(f"INFO: Projetos: {ativos} ativos, {concluidos} concluidos.")
    
    if atraso > 0:
        leitura.append(f"ALERTA: Projetos em atraso: {atraso}. Revisar prazos.")
    
    if prazo_medio:
        leitura.append(f"INFO: Prazo medio: {prazo_medio} dias.")
    
    if gargalos:
        leitura.append(f"CRITICO: Gargalos identificados: {', '.join(gargalos[:3])}.")
    else:
        leitura.append("OK: Nenhum gargalo critico identificado.")
    
    return " ".join(leitura)


def montar_indicadores_executivos(operacoes: List[Dict[str, Any]], custos_dia: Optional[float] = None) -> Dict[str, Any]:
    """Monta indicadores e leituras executivas por painel."""
    faturamento = calcular_faturamento(operacoes)
    resultado_geral = calcular_resultado_geral(operacoes, custos_dia)
    performance_entrega = calcular_performance_entrega_on_time(operacoes)
    operacoes_negativas = calcular_operacoes_negativas(operacoes)
    resultado_por_servico = calcular_resultado_por_servico(operacoes)
    inadimplencia = calcular_inadimplencia(operacoes)
    participacao_faturamento = calcular_participacao_faturamento(operacoes)
    fluxo_caixa = calcular_fluxo_caixa(operacoes, custos_dia)
    nivel_operacao_atendimento = calcular_nivel_operacao_atendimento(operacoes)
    resultado_composicoes_rotas = calcular_resultado_composicoes_rotas(operacoes)
    projetos = calcular_projetos(operacoes)

    indicadores = {
        "faturamento": faturamento,
        "resultado_geral": resultado_geral,
        "performance_entrega": performance_entrega,
        "operacoes_negativas": operacoes_negativas,
        "resultado_por_servico": resultado_por_servico,
        "inadimplencia": inadimplencia,
        "participacao_faturamento": participacao_faturamento,
        "fluxo_caixa": fluxo_caixa,
        "nivel_operacao_atendimento": nivel_operacao_atendimento,
        "resultado_composicoes_rotas": resultado_composicoes_rotas,
        "projetos": projetos
    }

    return {
        "indicadores": {
            "ceo_panel": {
                "resultado_geral_acumulado_d5": resultado_geral.get("resultado"),
                "performance_entrega_on_time_percent": performance_entrega.get("percent_on_time"),
                "faturamento_mensal_d0": faturamento.get("mensal"),
                "faturamento_acumulado_d0": faturamento.get("acumulado"),
                "valor_operacoes_negativas_d5": operacoes_negativas.get("valor_total"),
                "fluxo_caixa_atual": fluxo_caixa.get("valor_atual"),
                "status": {
                    "resultado_geral": _status_valor(resultado_geral.get("resultado")),
                    "performance_entrega": _status_percent(performance_entrega.get("percent_on_time")),
                    "operacoes_negativas": _status_inverso(operacoes_negativas.get("valor_total")),
                    "fluxo_caixa": fluxo_caixa.get("status", "indefinido")
                },
                "referencias": {
                    "resultado_geral": "D+5",
                    "performance_entrega": "D+5",
                    "faturamento_mensal": "D+0",
                    "faturamento_acumulado": "D+0",
                    "operacoes_negativas": "D+5",
                    "fluxo_caixa": "D+5"
                }
            },
            "diretoria_panel": {
                "resultado_por_servico_d5": resultado_por_servico,
                "faturamento_mensal_d0": faturamento.get("mensal"),
                "faturamento_acumulado_d0": faturamento.get("acumulado"),
                "valor_embarques_prejuizo_d5": operacoes_negativas.get("valor_total"),
                "inadimplencia_percent": inadimplencia.get("percent"),
                "inadimplencia_valor": inadimplencia.get("valor_total"),
                "participacao_corporativo_percent": participacao_faturamento.get("percent_corporativo"),
                "participacao_vendedores_percent": participacao_faturamento.get("percent_vendedores"),
                "custos_dia": custos_dia,
                "lucro_liquido_sobre_faturamento": resultado_geral.get("margem_percent"),
                "fluxo_caixa_d5": fluxo_caixa.get("valor_atual"),
                "status": {
                    "inadimplencia": _status_inadimplencia(inadimplencia.get("percent")),
                    "operacoes_negativas": _status_inverso(operacoes_negativas.get("valor_total")),
                    "fluxo_caixa": fluxo_caixa.get("status", "indefinido")
                }
            },
            "operacional_panel": {
                "performance_entrega_on_time_percent": performance_entrega.get("percent_on_time"),
                "resultado_composicoes_rotas_dia": resultado_composicoes_rotas,
                "faturamento_mensal_d0": faturamento.get("mensal"),
                "faturamento_acumulado_d0": faturamento.get("acumulado"),
                "nivel_operacao_atendimento": nivel_operacao_atendimento,
                "status": {
                    "performance_entrega": _status_percent(performance_entrega.get("percent_on_time")),
                    "nivel_operacao": nivel_operacao_atendimento.get("cor", "gray")
                }
            },
            "projetos_panel": {
                "projetos_ativos": projetos.get("projetos_ativos"),
                "projetos_concluidos": projetos.get("projetos_concluidos"),
                "projetos_atraso": projetos.get("projetos_atraso"),
                "prazo_medio_dias": projetos.get("prazo_medio_dias"),
                "gargalos": projetos.get("gargalos"),
                "status": {
                    "projetos_atraso": "red" if projetos.get("projetos_atraso", 0) > 0 else "green"
                }
            }
        },
        "leituras_executivas": {
            "ceo": gerar_leitura_executiva_ceo(indicadores),
            "diretoria": gerar_leitura_executiva_diretoria(indicadores),
            "operacional": gerar_leitura_executiva_operacional(indicadores),
            "projetos": gerar_leitura_executiva_projetos(indicadores)
        }
    }


# Funcoes auxiliares privadas

def _extrair_data_operacao(op: Dict[str, Any]) -> Optional[date]:
    """Extrai data da operacao"""
    candidatos = [
        op.get('coleta_data'),
        op.get('data_operacao'),
        op.get('data'),
        op.get('data_original'),
        op.get('data_coleta'),
        op.get('data_entrega')
    ]
    for candidato in candidatos:
        if candidato:
            try:
                if isinstance(candidato, date):
                    return candidato
                if isinstance(candidato, datetime):
                    return candidato.date()
                if isinstance(candidato, str):
                    for fmt in ["%Y-%m-%d", "%d/%m/%Y"]:
                        try:
                            return datetime.strptime(candidato[:10], fmt).date()
                        except ValueError:
                            continue
            except:
                pass
    return None


def _extrair_data_prevista(op: Dict[str, Any]) -> Optional[date]:
    """Extrai data prevista de entrega"""
    candidatos = [
        op.get('prev_entrega_data'),
        op.get('prev_entrega'),
        op.get('data_prev_entrega'),
        op.get('data_prevista')
    ]
    for candidato in candidatos:
        if candidato:
            try:
                if isinstance(candidato, date):
                    return candidato
                if isinstance(candidato, datetime):
                    return candidato.date()
                if isinstance(candidato, str):
                    for fmt in ["%Y-%m-%d", "%d/%m/%Y"]:
                        try:
                            return datetime.strptime(candidato[:10], fmt).date()
                        except ValueError:
                            continue
            except:
                pass
    return None


def _extrair_data_real(op: Dict[str, Any]) -> Optional[date]:
    """Extrai data real de entrega"""
    candidatos = [
        op.get('entrega_data'),
        op.get('data_entrega'),
        op.get('data_finalizacao'),
        op.get('data_real')
    ]
    for candidato in candidatos:
        if candidato:
            try:
                if isinstance(candidato, date):
                    return candidato
                if isinstance(candidato, datetime):
                    return candidato.date()
                if isinstance(candidato, str):
                    for fmt in ["%Y-%m-%d", "%d/%m/%Y"]:
                        try:
                            return datetime.strptime(candidato[:10], fmt).date()
                        except ValueError:
                            continue
            except:
                pass
    return None


def _classificar_criticidade_simples(op: Dict[str, Any]) -> str:
    """Classificacao simples de criticidade"""
    status = (op.get('status_descricao') or op.get('status') or '').lower()
    data_ref = _extrair_data_operacao(op)
    
    if 'final' in status:
        return 'Baixa'
    if 'control' in status:
        return 'Alta'
    
    dias_em_aberto = 0
    if data_ref:
        dias_em_aberto = (datetime.now().date() - data_ref).days
    
    if dias_em_aberto >= 3:
        return 'Critica'
    if dias_em_aberto >= 2:
        return 'Alta'
    if dias_em_aberto >= 1:
        return 'Media'
    return 'Baixa'


def _status_percent(valor: Optional[float]) -> str:
    if valor is None:
        return "indefinido"
    if valor >= 95:
        return "green"
    if valor >= 85:
        return "yellow"
    return "red"


def _status_valor(valor: Optional[float]) -> str:
    if valor is None:
        return "indefinido"
    if valor > 0:
        return "green"
    if valor == 0:
        return "yellow"
    return "red"


def _status_inverso(valor: Optional[float]) -> str:
    if valor is None:
        return "indefinido"
    if valor <= 0:
        return "green"
    if valor <= 1000:
        return "yellow"
    return "red"


def _status_inadimplencia(percent: Optional[float]) -> str:
    if percent is None:
        return "indefinido"
    if percent <= 0:
        return "green"
    if percent <= 5:
        return "yellow"
    return "red"
