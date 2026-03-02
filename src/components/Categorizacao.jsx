import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Tags, Target, TrendingUp } from 'lucide-react'

const CATEGORIES = [
  {
    id: 'cliente',
    label: 'Cliente',
    emoji: '👤',
    subcategories: ['Mudança de endereço', 'Pendência financeira', 'Horário incorreto', 'CNPJ errado', 'Carga não pronta']
  },
  {
    id: 'comercial',
    label: 'Comercial',
    emoji: '💼',
    subcategories: []
  },
  {
    id: 'atendimento',
    label: 'Atendimento',
    emoji: '📞',
    subcategories: []
  },
  {
    id: 'operacao',
    label: 'Operação',
    emoji: '🚚',
    subcategories: ['Programação incorreta', 'Saída atrasada', 'Veículo errado']
  },
  {
    id: 'armazem',
    label: 'Armazém',
    emoji: '🏭',
    subcategories: ['NF não liberada', 'Mercadoria não pronta', 'Pedido suspenso']
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    emoji: '💰',
    subcategories: []
  },
  {
    id: 'planejamento',
    label: 'Planejamento',
    emoji: '📋',
    subcategories: []
  },
  {
    id: 'motorista',
    label: 'Motorista',
    emoji: '👷',
    subcategories: []
  },
  {
    id: 'externo',
    label: 'Externo',
    emoji: '🌍',
    subcategories: []
  }
]

export default function Categorizacao() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Tags className="h-6 w-6" />
          Categorização Inteligente
        </h2>
        <p className="text-muted-foreground">
          Categorias e subcategorias padronizadas para identificação de padrões
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <Card key={cat.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="text-xl">{cat.emoji}</span>
                {cat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {cat.subcategories.map((sub, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs font-normal bg-muted/50"
                  >
                    {sub}
                  </Badge>
                ))}
                {cat.subcategories.length === 0 && (
                  <span className="text-xs text-muted-foreground">Sem subcategorias definidas</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">🎯 Por que categorizar?</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Análise Estratégica
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Identificar se 40% das falhas são do armazém</li>
                <li>• Saber quanto custa por mês falha de liberação</li>
                <li>• Ver quais clientes precisam de reunião</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Melhoria Contínua
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Saber se o problema é planejamento ou atendimento</li>
                <li>• Criar meta de redução de ocorrências por categoria</li>
                <li>• Focar nas causas raiz dos problemas mais frequentes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">9</div>
              <p className="text-sm text-muted-foreground">Categorias Principais</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">11</div>
              <p className="text-sm text-muted-foreground">Subcategorias Definidas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <p className="text-sm text-muted-foreground">Cobertura de Análise</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
