import { PrismaClient } from '@prisma/client';
import { generateBoleto } from '../services/boleto.service.js';

const prisma = new PrismaClient();

/**
 * Listar todos os boletos
 */
export const getAllBoletos = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, cteId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (status) {
      where.status = status;
    }

    if (cteId) {
      where.cteId = cteId;
    }

    const [boletos, total] = await Promise.all([
      prisma.boleto.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          cte: {
            select: {
              id: true,
              chaveCte: true,
              numeroCte: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.boleto.count({ where })
    ]);

    res.json({
      boletos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao listar boletos:', error);
    res.status(500).json({ error: 'Erro ao listar boletos' });
  }
};

/**
 * Obter boleto por ID
 */
export const getBoletoById = async (req, res) => {
  try {
    const { id } = req.params;

    const boleto = await prisma.boleto.findUnique({
      where: { id },
      include: {
        cte: {
          include: {
            quote: {
              include: {
                client: true
              }
            }
          }
        }
      }
    });

    if (!boleto) {
      return res.status(404).json({ error: 'Boleto não encontrado' });
    }

    res.json({ boleto });
  } catch (error) {
    console.error('Erro ao buscar boleto:', error);
    res.status(500).json({ error: 'Erro ao buscar boleto' });
  }
};

/**
 * Gerar boleto manualmente
 */
export const createBoleto = async (req, res) => {
  try {
    const { cteId, valor, vencimentoDias } = req.body;

    const boleto = await generateBoleto(cteId, valor, vencimentoDias);

    res.status(201).json({
      message: 'Boleto gerado com sucesso',
      boleto
    });
  } catch (error) {
    console.error('Erro ao gerar boleto:', error);
    res.status(500).json({ error: 'Erro ao gerar boleto', details: error.message });
  }
};

/**
 * Atualizar status do boleto
 */
export const updateBoletoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const boleto = await prisma.boleto.update({
      where: { id },
      data: { status }
    });

    res.json({
      message: 'Status do boleto atualizado',
      boleto
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Boleto não encontrado' });
    }
    console.error('Erro ao atualizar boleto:', error);
    res.status(500).json({ error: 'Erro ao atualizar boleto' });
  }
};
