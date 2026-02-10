import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Listar todas as cotações
 */
export const getAllQuotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, clientId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          client: {
            select: {
              id: true,
              razaoSocial: true,
              cnpj: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.quote.count({ where })
    ]);

    res.json({
      quotes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao listar cotações:', error);
    res.status(500).json({ error: 'Erro ao listar cotações' });
  }
};

/**
 * Obter cotação por ID
 */
export const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        client: true,
        ctes: {
          include: {
            mdfes: true
          }
        }
      }
    });

    if (!quote) {
      return res.status(404).json({ error: 'Cotação não encontrada' });
    }

    res.json({ quote });
  } catch (error) {
    console.error('Erro ao buscar cotação:', error);
    res.status(500).json({ error: 'Erro ao buscar cotação' });
  }
};

/**
 * Criar nova cotação
 */
export const createQuote = async (req, res) => {
  try {
    const {
      clientId,
      origem,
      destino,
      peso,
      cubagem,
      valor,
      observacoes
    } = req.body;

    // Verificar se cliente existe
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const quote = await prisma.quote.create({
      data: {
        clientId,
        origem,
        destino,
        peso: parseFloat(peso),
        cubagem: parseFloat(cubagem),
        valor: parseFloat(valor),
        observacoes,
        status: 'PENDENTE'
      },
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Cotação criada com sucesso',
      quote
    });
  } catch (error) {
    console.error('Erro ao criar cotação:', error);
    res.status(500).json({ error: 'Erro ao criar cotação' });
  }
};

/**
 * Atualizar cotação
 */
export const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      origem,
      destino,
      peso,
      cubagem,
      valor,
      status,
      observacoes
    } = req.body;

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        origem,
        destino,
        peso: peso ? parseFloat(peso) : undefined,
        cubagem: cubagem ? parseFloat(cubagem) : undefined,
        valor: valor ? parseFloat(valor) : undefined,
        status,
        observacoes
      }
    });

    res.json({
      message: 'Cotação atualizada com sucesso',
      quote
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cotação não encontrada' });
    }
    console.error('Erro ao atualizar cotação:', error);
    res.status(500).json({ error: 'Erro ao atualizar cotação' });
  }
};

/**
 * Deletar cotação
 */
export const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.quote.delete({
      where: { id }
    });

    res.json({ message: 'Cotação deletada com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cotação não encontrada' });
    }
    console.error('Erro ao deletar cotação:', error);
    res.status(500).json({ error: 'Erro ao deletar cotação' });
  }
};
