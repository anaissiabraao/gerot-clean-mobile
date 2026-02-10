import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Listar todos os clientes
 */
export const getAllClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, ativo } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (search) {
      where.OR = [
        { razaoSocial: { contains: search, mode: 'insensitive' } },
        { nomeFantasia: { contains: search, mode: 'insensitive' } },
        { cnpj: { contains: search } }
      ];
    }

    if (ativo !== undefined) {
      where.ativo = ativo === 'true';
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.client.count({ where })
    ]);

    res.json({
      clients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
};

/**
 * Obter cliente por ID
 */
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        quotes: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        invoices: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json({ client });
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
};

/**
 * Criar novo cliente
 */
export const createClient = async (req, res) => {
  try {
    const {
      cnpj,
      razaoSocial,
      nomeFantasia,
      emailFaturamento,
      telefone,
      endereco,
      cidade,
      estado,
      cep
    } = req.body;

    // Verificar se CNPJ já existe
    const existingClient = await prisma.client.findUnique({
      where: { cnpj }
    });

    if (existingClient) {
      return res.status(400).json({ error: 'CNPJ já cadastrado' });
    }

    const client = await prisma.client.create({
      data: {
        cnpj,
        razaoSocial,
        nomeFantasia,
        emailFaturamento,
        telefone,
        endereco,
        cidade,
        estado,
        cep
      }
    });

    res.status(201).json({
      message: 'Cliente criado com sucesso',
      client
    });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
};

/**
 * Atualizar cliente
 */
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      razaoSocial,
      nomeFantasia,
      emailFaturamento,
      telefone,
      endereco,
      cidade,
      estado,
      cep,
      ativo
    } = req.body;

    const client = await prisma.client.update({
      where: { id },
      data: {
        razaoSocial,
        nomeFantasia,
        emailFaturamento,
        telefone,
        endereco,
        cidade,
        estado,
        cep,
        ativo
      }
    });

    res.json({
      message: 'Cliente atualizado com sucesso',
      client
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

/**
 * Deletar cliente
 */
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.client.delete({
      where: { id }
    });

    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
};
