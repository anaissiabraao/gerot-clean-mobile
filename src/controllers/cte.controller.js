import { PrismaClient } from '@prisma/client';
import { generateCteXml, signCteXml, sendCteToSefaz, consultCteStatus } from '../services/sefaz/cte.service.js';
import { generateBoleto } from '../services/boleto.service.js';

const prisma = new PrismaClient();

/**
 * Emitir CT-e
 */
export const emitirCte = async (req, res) => {
  try {
    const {
      quoteId,
      invoiceId,
      numeroCte,
      serieCte = '1'
    } = req.body;

    // Buscar dados da cotação e/ou nota fiscal
    let quote = null;
    let invoice = null;
    let client = null;

    if (quoteId) {
      quote = await prisma.quote.findUnique({
        where: { id: quoteId },
        include: { client: true }
      });

      if (!quote) {
        return res.status(404).json({ error: 'Cotação não encontrada' });
      }

      client = quote.client;
    }

    if (invoiceId) {
      invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { client: true }
      });

      if (!invoice) {
        return res.status(404).json({ error: 'Nota fiscal não encontrada' });
      }

      client = invoice.client;
    }

    if (!client) {
      return res.status(400).json({ error: 'É necessário informar quoteId ou invoiceId' });
    }

    // Dados do emitente (da empresa)
    const cnpjEmitente = process.env.SEFAZ_CNPJ || '12345678000190';
    const ufEmitente = process.env.SEFAZ_UF || 'SP';
    const razaoSocialEmitente = process.env.SEFAZ_RAZAO_SOCIAL || 'VCI TRANSPORTES LTDA';
    const ieEmitente = process.env.SEFAZ_IE || '123456789012';

    // Dados do CT-e
    const dataEmissao = new Date().toISOString();
    const origem = quote?.origem || 'São Paulo';
    const destino = quote?.destino || 'São Paulo';
    const valor = quote?.valor || invoice?.valorTotal || 0;
    const peso = quote?.peso || 0;
    const cubagem = quote?.cubagem || 0;
    const observacoes = quote?.observacoes || null;

    // Gerar XML do CT-e
    const { xml, chaveCte } = await generateCteXml({
      numeroCte: numeroCte || Date.now().toString().slice(-8),
      serieCte,
      dataEmissao,
      cnpjEmitente,
      ufEmitente,
      razaoSocialEmitente,
      ieEmitente,
      cnpjRemetente: client.cnpj,
      razaoSocialRemetente: client.razaoSocial,
      cnpjDestinatario: client.cnpj,
      razaoSocialDestinatario: client.razaoSocial,
      origem,
      destino,
      valor,
      peso,
      cubagem,
      observacoes
    });

    // Assinar XML
    const xmlSigned = signCteXml(xml);

    // Criar registro no banco
    const cte = await prisma.cte.create({
      data: {
        quoteId: quote?.id,
        invoiceId: invoice?.id,
        numeroCte: numeroCte || Date.now().toString().slice(-8),
        serieCte,
        chaveCte,
        xml: xmlSigned,
        statusSefaz: 'PROCESSANDO'
      }
    });

    // Enviar para SEFAZ (assíncrono)
    sendCteToSefaz(xmlSigned)
      .then(async (response) => {
        // Processar resposta da SEFAZ
        let statusSefaz = 'REJEITADO';
        let protocolo = null;
        let motivoRejeicao = null;
        let xmlAutorizado = null;

        // Aqui você deve processar a resposta SOAP da SEFAZ
        // Por enquanto, vamos simular uma resposta positiva em homologação
        if (process.env.SEFAZ_AMBIENTE === 'homologacao') {
          statusSefaz = 'AUTORIZADO';
          protocolo = '123456789012345';
          xmlAutorizado = xmlSigned;
        }

        await prisma.cte.update({
          where: { id: cte.id },
          data: {
            statusSefaz,
            protocolo,
            motivoRejeicao,
            xmlAutorizado,
            dataAutorizacao: statusSefaz === 'AUTORIZADO' ? new Date() : null
          }
        });

        // Gerar boleto automaticamente se CT-e foi autorizado
        if (statusSefaz === 'AUTORIZADO') {
          try {
            await generateBoleto(cte.id, valor);
          } catch (boletoError) {
            console.error('Erro ao gerar boleto:', boletoError);
          }
        }
      })
      .catch(async (error) => {
        console.error('Erro ao enviar CT-e para SEFAZ:', error);
        await prisma.cte.update({
          where: { id: cte.id },
          data: {
            statusSefaz: 'REJEITADO',
            motivoRejeicao: error.message
          }
        });
      });

    res.status(201).json({
      message: 'CT-e emitido com sucesso',
      cte: {
        id: cte.id,
        chaveCte,
        statusSefaz: cte.statusSefaz,
        numeroCte: cte.numeroCte
      }
    });
  } catch (error) {
    console.error('Erro ao emitir CT-e:', error);
    res.status(500).json({ error: 'Erro ao emitir CT-e', details: error.message });
  }
};

/**
 * Consultar status do CT-e
 */
export const consultarStatusCte = async (req, res) => {
  try {
    const { chave } = req.params;

    const cte = await prisma.cte.findUnique({
      where: { chaveCte: chave }
    });

    if (!cte) {
      return res.status(404).json({ error: 'CT-e não encontrado' });
    }

    // Consultar na SEFAZ
    try {
      const sefazResponse = await consultCteStatus(chave);
      
      // Atualizar status no banco
      // Processar resposta da SEFAZ e atualizar
      
      res.json({
        cte: {
          id: cte.id,
          chaveCte: cte.chaveCte,
          statusSefaz: cte.statusSefaz,
          protocolo: cte.protocolo,
          dataAutorizacao: cte.dataAutorizacao
        },
        sefazResponse
      });
    } catch (sefazError) {
      res.json({
        cte: {
          id: cte.id,
          chaveCte: cte.chaveCte,
          statusSefaz: cte.statusSefaz,
          protocolo: cte.protocolo
        },
        error: 'Erro ao consultar SEFAZ',
        details: sefazError.message
      });
    }
  } catch (error) {
    console.error('Erro ao consultar CT-e:', error);
    res.status(500).json({ error: 'Erro ao consultar CT-e' });
  }
};

/**
 * Listar todos os CT-es
 */
export const getAllCtes = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (status) {
      where.statusSefaz = status;
    }

    const [ctes, total] = await Promise.all([
      prisma.cte.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          quote: {
            select: {
              id: true,
              origem: true,
              destino: true
            }
          },
          invoice: {
            select: {
              id: true,
              numeroNfe: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.cte.count({ where })
    ]);

    res.json({
      ctes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao listar CT-es:', error);
    res.status(500).json({ error: 'Erro ao listar CT-es' });
  }
};

/**
 * Obter CT-e por ID
 */
export const getCteById = async (req, res) => {
  try {
    const { id } = req.params;

    const cte = await prisma.cte.findUnique({
      where: { id },
      include: {
        quote: {
          include: {
            client: true
          }
        },
        invoice: {
          include: {
            client: true
          }
        },
        mdfes: true
      }
    });

    if (!cte) {
      return res.status(404).json({ error: 'CT-e não encontrado' });
    }

    res.json({ cte });
  } catch (error) {
    console.error('Erro ao buscar CT-e:', error);
    res.status(500).json({ error: 'Erro ao buscar CT-e' });
  }
};
