import { PrismaClient } from '@prisma/client';
import { generateMdfeXml, signMdfeXml, sendMdfeToSefaz, consultMdfeStatus, encerrarMdfe } from '../services/sefaz/mdfe.service.js';

const prisma = new PrismaClient();

/**
 * Emitir MDF-e a partir de CT-es
 */
export const emitirMdfe = async (req, res) => {
  try {
    const {
      cteIds,
      numeroMdfe,
      serieMdfe = '1'
    } = req.body;

    if (!cteIds || !Array.isArray(cteIds) || cteIds.length === 0) {
      return res.status(400).json({ error: 'É necessário informar pelo menos um CT-e' });
    }

    // Buscar CT-es
    const ctes = await prisma.cte.findMany({
      where: {
        id: { in: cteIds },
        statusSefaz: 'AUTORIZADO'
      },
      include: {
        quote: true
      }
    });

    if (ctes.length === 0) {
      return res.status(404).json({ error: 'Nenhum CT-e autorizado encontrado' });
    }

    if (ctes.length !== cteIds.length) {
      return res.status(400).json({ error: 'Alguns CT-es não foram encontrados ou não estão autorizados' });
    }

    // Dados do emitente
    const cnpjEmitente = process.env.SEFAZ_CNPJ || '12345678000190';
    const ufEmitente = process.env.SEFAZ_UF || 'SP';
    const razaoSocialEmitente = process.env.SEFAZ_RAZAO_SOCIAL || 'VCI TRANSPORTES LTDA';
    const ieEmitente = process.env.SEFAZ_IE || '123456789012';

    // Gerar XML do MDF-e
    const dataEmissao = new Date().toISOString();
    const { xml, chaveMdfe } = await generateMdfeXml({
      numeroMdfe: numeroMdfe || Date.now().toString().slice(-8),
      serieMdfe,
      dataEmissao,
      cnpjEmitente,
      ufEmitente,
      razaoSocialEmitente,
      ieEmitente,
      ctes: ctes.map(cte => ({ chaveCte: cte.chaveCte }))
    });

    // Assinar XML
    const xmlSigned = signMdfeXml(xml);

    // Criar registro no banco (associar ao primeiro CT-e)
    const mdfe = await prisma.mdfe.create({
      data: {
        cteId: ctes[0].id,
        numeroMdfe: numeroMdfe || Date.now().toString().slice(-8),
        serieMdfe,
        chaveMdfe,
        xml: xmlSigned,
        statusSefaz: 'PROCESSANDO'
      }
    });

    // Enviar para SEFAZ (assíncrono)
    sendMdfeToSefaz(xmlSigned)
      .then(async (response) => {
        let statusSefaz = 'REJEITADO';
        let protocolo = null;
        let motivoRejeicao = null;
        let xmlAutorizado = null;

        // Processar resposta da SEFAZ
        if (process.env.SEFAZ_AMBIENTE === 'homologacao') {
          statusSefaz = 'AUTORIZADO';
          protocolo = '123456789012345';
          xmlAutorizado = xmlSigned;
        }

        await prisma.mdfe.update({
          where: { id: mdfe.id },
          data: {
            statusSefaz,
            protocolo,
            motivoRejeicao,
            xmlAutorizado,
            dataAutorizacao: statusSefaz === 'AUTORIZADO' ? new Date() : null
          }
        });
      })
      .catch(async (error) => {
        console.error('Erro ao enviar MDF-e para SEFAZ:', error);
        await prisma.mdfe.update({
          where: { id: mdfe.id },
          data: {
            statusSefaz: 'REJEITADO',
            motivoRejeicao: error.message
          }
        });
      });

    res.status(201).json({
      message: 'MDF-e emitido com sucesso',
      mdfe: {
        id: mdfe.id,
        chaveMdfe,
        statusSefaz: mdfe.statusSefaz,
        numeroMdfe: mdfe.numeroMdfe
      }
    });
  } catch (error) {
    console.error('Erro ao emitir MDF-e:', error);
    res.status(500).json({ error: 'Erro ao emitir MDF-e', details: error.message });
  }
};

/**
 * Encerrar MDF-e
 */
export const encerrarMdfeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigoEncerramento } = req.body;

    const mdfe = await prisma.mdfe.findUnique({
      where: { id }
    });

    if (!mdfe) {
      return res.status(404).json({ error: 'MDF-e não encontrado' });
    }

    if (mdfe.statusSefaz !== 'AUTORIZADO') {
      return res.status(400).json({ error: 'MDF-e deve estar autorizado para ser encerrado' });
    }

    // Encerrar na SEFAZ
    try {
      await encerrarMdfe(mdfe.chaveMdfe, codigoEncerramento || mdfe.protocolo);

      await prisma.mdfe.update({
        where: { id },
        data: {
          statusSefaz: 'ENCERRADO',
          dataEncerramento: new Date(),
          codigoEncerramento: codigoEncerramento || mdfe.protocolo
        }
      });

      res.json({
        message: 'MDF-e encerrado com sucesso',
        mdfe: await prisma.mdfe.findUnique({ where: { id } })
      });
    } catch (sefazError) {
      res.status(500).json({
        error: 'Erro ao encerrar MDF-e na SEFAZ',
        details: sefazError.message
      });
    }
  } catch (error) {
    console.error('Erro ao encerrar MDF-e:', error);
    res.status(500).json({ error: 'Erro ao encerrar MDF-e' });
  }
};

/**
 * Consultar status do MDF-e
 */
export const consultarStatusMdfe = async (req, res) => {
  try {
    const { chave } = req.params;

    const mdfe = await prisma.mdfe.findUnique({
      where: { chaveMdfe: chave }
    });

    if (!mdfe) {
      return res.status(404).json({ error: 'MDF-e não encontrado' });
    }

    try {
      const sefazResponse = await consultMdfeStatus(chave);
      
      res.json({
        mdfe: {
          id: mdfe.id,
          chaveMdfe: mdfe.chaveMdfe,
          statusSefaz: mdfe.statusSefaz,
          protocolo: mdfe.protocolo,
          dataAutorizacao: mdfe.dataAutorizacao,
          dataEncerramento: mdfe.dataEncerramento
        },
        sefazResponse
      });
    } catch (sefazError) {
      res.json({
        mdfe: {
          id: mdfe.id,
          chaveMdfe: mdfe.chaveMdfe,
          statusSefaz: mdfe.statusSefaz
        },
        error: 'Erro ao consultar SEFAZ',
        details: sefazError.message
      });
    }
  } catch (error) {
    console.error('Erro ao consultar MDF-e:', error);
    res.status(500).json({ error: 'Erro ao consultar MDF-e' });
  }
};

/**
 * Listar todos os MDF-es
 */
export const getAllMdfes = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (status) {
      where.statusSefaz = status;
    }

    const [mdfes, total] = await Promise.all([
      prisma.mdfe.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          cte: {
            select: {
              id: true,
              chaveCte: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.mdfe.count({ where })
    ]);

    res.json({
      mdfes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao listar MDF-es:', error);
    res.status(500).json({ error: 'Erro ao listar MDF-es' });
  }
};

/**
 * Obter MDF-e por ID
 */
export const getMdfeById = async (req, res) => {
  try {
    const { id } = req.params;

    const mdfe = await prisma.mdfe.findUnique({
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

    if (!mdfe) {
      return res.status(404).json({ error: 'MDF-e não encontrado' });
    }

    res.json({ mdfe });
  } catch (error) {
    console.error('Erro ao buscar MDF-e:', error);
    res.status(500).json({ error: 'Erro ao buscar MDF-e' });
  }
};
