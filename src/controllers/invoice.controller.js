import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Listar todas as notas fiscais
 */
export const getAllInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, clientId, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (clientId) {
      where.clientId = clientId;
    }

    if (status) {
      where.status = status;
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
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
      prisma.invoice.count({ where })
    ]);

    res.json({
      invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao listar notas fiscais:', error);
    res.status(500).json({ error: 'Erro ao listar notas fiscais' });
  }
};

/**
 * Obter nota fiscal por ID
 */
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        ctes: true
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Nota fiscal não encontrada' });
    }

    res.json({ invoice });
  } catch (error) {
    console.error('Erro ao buscar nota fiscal:', error);
    res.status(500).json({ error: 'Erro ao buscar nota fiscal' });
  }
};

/**
 * Criar nova nota fiscal
 */
export const createInvoice = async (req, res) => {
  try {
    const {
      clientId,
      numeroNfe,
      serieNfe,
      chaveNfe,
      xml,
      valorTotal,
      dataEmissao
    } = req.body;

    // Verificar se cliente existe
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const invoice = await prisma.invoice.create({
      data: {
        clientId,
        numeroNfe,
        serieNfe,
        chaveNfe,
        xml,
        valorTotal: parseFloat(valorTotal),
        dataEmissao: dataEmissao ? new Date(dataEmissao) : new Date(),
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
      message: 'Nota fiscal criada com sucesso',
      invoice
    });
  } catch (error) {
    console.error('Erro ao criar nota fiscal:', error);
    res.status(500).json({ error: 'Erro ao criar nota fiscal' });
  }
};

/**
 * Atualizar nota fiscal
 */
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      xml,
      valorTotal,
      status
    } = req.body;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        xml,
        valorTotal: valorTotal ? parseFloat(valorTotal) : undefined,
        status
      }
    });

    res.json({
      message: 'Nota fiscal atualizada com sucesso',
      invoice
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Nota fiscal não encontrada' });
    }
    console.error('Erro ao atualizar nota fiscal:', error);
    res.status(500).json({ error: 'Erro ao atualizar nota fiscal' });
  }
};

/**
 * Deletar nota fiscal
 */
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.invoice.delete({
      where: { id }
    });

    res.json({ message: 'Nota fiscal deletada com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Nota fiscal não encontrada' });
    }
    console.error('Erro ao deletar nota fiscal:', error);
    res.status(500).json({ error: 'Erro ao deletar nota fiscal' });
  }
};
