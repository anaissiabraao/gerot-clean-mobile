import { createContext, useContext, useState, useEffect } from 'react'

const OccurrenceContext = createContext()

export function OccurrenceProvider({ children }) {
  const [occurrences, setOccurrences] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Mock data para demonstração
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setOccurrences([
        {
          id: 1,
          data: '2024-01-15',
          categoria: 'cliente',
          subcategoria: 'Mudança de endereço',
          responsavel: 'João Silva',
          descricao: 'Cliente solicitou mudança de endereço de entrega',
          impacto_financeiro: 150.00,
          impacto_operacional: 'Alto',
          reprogramado: 'Sim',
          data_reprogramacao: '2024-01-16',
          impacto_score: 8,
          frequencia: 3
        },
        {
          id: 2,
          data: '2024-01-16',
          categoria: 'operacao',
          subcategoria: 'Programação incorreta',
          responsavel: 'Maria Santos',
          descricao: 'Erro na programação da rota de entrega',
          impacto_financeiro: 75.50,
          impacto_operacional: 'Médio',
          reprogramado: 'Não',
          impacto_score: 5,
          frequencia: 1
        },
        {
          id: 3,
          data: '2024-01-17',
          categoria: 'armazem',
          subcategoria: 'NF não liberada',
          responsavel: 'Pedro Costa',
          descricao: 'Nota fiscal não foi liberada a tempo',
          impacto_financeiro: 200.00,
          impacto_operacional: 'Alto',
          reprogramado: 'Sim',
          data_reprogramacao: '2024-01-18',
          impacto_score: 9,
          frequencia: 2
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const value = {
    occurrences,
    loading,
    error,
    setOccurrences
  }

  return (
    <OccurrenceContext.Provider value={value}>
      {children}
    </OccurrenceContext.Provider>
  )
}

export function useOccurrences() {
  const context = useContext(OccurrenceContext)
  if (!context) {
    throw new Error('useOccurrences must be used within an OccurrenceProvider')
  }
  return context
}
