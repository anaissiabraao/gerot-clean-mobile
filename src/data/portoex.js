export const PORTOEX_CATEGORIES = [
  { id: 'cliente', label: 'Cliente', emoji: '👤', color: 'chart-1' },
  { id: 'comercial', label: 'Comercial', emoji: '💼', color: 'chart-2' },
  { id: 'atendimento', label: 'Atendimento', emoji: '🎧', color: 'chart-5' },
  { id: 'operacao', label: 'Operação', emoji: '⚙️', color: 'chart-3' },
  { id: 'armazem', label: 'Armazém', emoji: '📦', color: 'chart-4' },
  { id: 'financeiro', label: 'Financeiro', emoji: '💰', color: 'chart-6' },
  { id: 'planejamento', label: 'Planejamento', emoji: '📋', color: 'chart-1' },
  { id: 'motorista', label: 'Motorista', emoji: '🚛', color: 'chart-2' },
  { id: 'externo', label: 'Externo', emoji: '🌧️', color: 'chart-5' },
]

export const PORTOEX_SUBCATEGORIES = {
  cliente: [
    { id: 'mudanca-endereco', label: 'Mudança de endereço' },
    { id: 'pendencia-financeira', label: 'Pendência financeira' },
    { id: 'horario-incorreto', label: 'Horário incorreto' },
    { id: 'cnpj-errado', label: 'CNPJ errado' },
    { id: 'carga-nao-pronta', label: 'Carga não pronta' },
  ],
  comercial: [
    { id: 'info-incorreta', label: 'Informação incorreta do pedido' },
    { id: 'prazo-inviavel', label: 'Prazo inviável prometido' },
    { id: 'falta-alinhamento', label: 'Falta de alinhamento' },
  ],
  atendimento: [
    { id: 'falha-comunicacao', label: 'Falha na comunicação' },
    { id: 'atraso-resposta', label: 'Atraso na resposta' },
    { id: 'info-divergente', label: 'Informação divergente' },
  ],
  operacao: [
    { id: 'programacao-incorreta', label: 'Programação incorreta' },
    { id: 'saida-atrasada', label: 'Saída atrasada' },
    { id: 'veiculo-errado', label: 'Veículo errado' },
    { id: 'rota-inadequada', label: 'Rota inadequada' },
  ],
  armazem: [
    { id: 'nf-nao-liberada', label: 'NF não liberada' },
    { id: 'mercadoria-nao-pronta', label: 'Mercadoria não pronta' },
    { id: 'pedido-suspenso', label: 'Pedido suspenso' },
    { id: 'erro-separacao', label: 'Erro de separação' },
  ],
  financeiro: [
    { id: 'bloqueio-credito', label: 'Bloqueio de crédito' },
    { id: 'cobranca-pendente', label: 'Cobrança pendente' },
  ],
  planejamento: [
    { id: 'capacidade-excedida', label: 'Capacidade excedida' },
    { id: 'janela-incompativel', label: 'Janela incompatível' },
    { id: 'falta-recurso', label: 'Falta de recurso' },
  ],
  motorista: [
    { id: 'atraso-motorista', label: 'Atraso do motorista' },
    { id: 'problema-veiculo', label: 'Problema no veículo' },
    { id: 'documentacao', label: 'Documentação irregular' },
  ],
  externo: [
    { id: 'clima', label: 'Condições climáticas' },
    { id: 'transito', label: 'Trânsito / acidente' },
    { id: 'shopping-restricao', label: 'Restrição shopping/condomínio' },
    { id: 'fiscalizacao', label: 'Fiscalização / barreira' },
  ],
}

export const PORTOEX_STATUS_OPTIONS = ['Aberto', 'Tratado', 'Recorrente', 'Encerrado']
export const PORTOEX_IMPACT_OPTIONS = ['Baixo', 'Médio', 'Alto', 'Crítico']
export const PORTOEX_FILIAIS = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Salvador', 'Recife']
export const PORTOEX_TIPOS = ['Entrega', 'Coleta', 'Dedicado', 'Light', 'Transferência', 'Devolução']
