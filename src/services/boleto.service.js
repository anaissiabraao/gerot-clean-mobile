import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * Gera linha digitável do boleto (formato padrão brasileiro)
 */
const generateLinhaDigitavel = (codigoBarras) => {
  // Implementação simplificada - em produção usar biblioteca específica
  // Formato: 00000.00000 00000.000000 00000.000000 0 00000000000000
  const bloco1 = codigoBarras.substring(0, 4) + codigoBarras.substring(19, 24);
  const bloco2 = codigoBarras.substring(24, 34);
  const bloco3 = codigoBarras.substring(34, 44);
  const bloco4 = codigoBarras.substring(4, 5);
  const bloco5 = codigoBarras.substring(5, 19);

  return `${bloco1.substring(0, 5)}.${bloco1.substring(5)} ${bloco2.substring(0, 5)}.${bloco2.substring(5)} ${bloco3.substring(0, 5)}.${bloco3.substring(5)} ${bloco4} ${bloco5}`;
};

/**
 * Gera código de barras do boleto
 */
const generateCodigoBarras = (banco, nossoNumero, valor, vencimento) => {
  // Implementação simplificada - em produção usar biblioteca específica do banco
  const bancoCodigo = banco || process.env.BOLETO_BANCO || '001';
  const codigoMoeda = '9'; // Real
  const fatorVencimento = calcularFatorVencimento(vencimento);
  const valorFormatado = valor.toFixed(2).replace('.', '').padStart(10, '0');
  
  // Código de barras simplificado (44 posições)
  const codigo = `${bancoCodigo}${codigoMoeda}${fatorVencimento}${valorFormatado}${nossoNumero.padStart(25, '0')}`;
  
  // Calcular dígito verificador
  const dv = calcularDVCodigoBarras(codigo);
  
  return codigo.substring(0, 4) + dv + codigo.substring(4);
};

/**
 * Calcula fator de vencimento (dias desde 07/10/1997)
 */
const calcularFatorVencimento = (vencimento) => {
  const dataBase = new Date('1997-10-07');
  const dataVencimento = new Date(vencimento);
  const diffTime = dataVencimento - dataBase;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays.toString().padStart(4, '0');
};

/**
 * Calcula dígito verificador do código de barras
 */
const calcularDVCodigoBarras = (codigo) => {
  const pesos = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let soma = 0;
  for (let i = 0; i < codigo.length; i++) {
    soma += parseInt(codigo[i]) * pesos[i];
  }
  
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
};

/**
 * Gera boleto automaticamente para um CT-e
 */
export const generateBoleto = async (cteId, valor, vencimentoDias = 7) => {
  try {
    const cte = await prisma.cte.findUnique({
      where: { id: cteId },
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
        }
      }
    });

    if (!cte) {
      throw new Error('CT-e não encontrado');
    }

    if (cte.statusSefaz !== 'AUTORIZADO') {
      throw new Error('CT-e deve estar autorizado para gerar boleto');
    }

    const client = cte.quote?.client || cte.invoice?.client;
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    // Calcular vencimento
    const vencimento = new Date();
    vencimento.setDate(vencimento.getDate() + vencimentoDias);

    // Gerar nosso número
    const nossoNumero = uuidv4().replace(/-/g, '').substring(0, 17);

    // Gerar código de barras e linha digitável
    const banco = process.env.BOLETO_BANCO || '001';
    const codigoBarras = generateCodigoBarras(banco, nossoNumero, valor, vencimento);
    const linhaDigitavel = generateLinhaDigitavel(codigoBarras);

    // Criar boleto no banco
    const boleto = await prisma.boleto.create({
      data: {
        cteId,
        nossoNumero,
        linhaDigitavel,
        codigoBarras,
        valor: parseFloat(valor),
        vencimento,
        banco,
        status: 'GERADO'
      }
    });

    // Enviar por email se configurado
    if (client.emailFaturamento) {
      try {
        await sendBoletoEmail(boleto, client);
        await prisma.boleto.update({
          where: { id: boleto.id },
          data: {
            emailEnviado: true,
            dataEnvioEmail: new Date(),
            status: 'ENVIADO'
          }
        });
      } catch (emailError) {
        console.error('Erro ao enviar email do boleto:', emailError);
      }
    }

    return boleto;
  } catch (error) {
    console.error('Erro ao gerar boleto:', error);
    throw error;
  }
};

/**
 * Envia boleto por email
 */
const sendBoletoEmail = async (boleto, client) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: client.emailFaturamento,
    subject: `Boleto - CT-e ${boleto.cteId}`,
    html: `
      <h2>Boleto de Pagamento</h2>
      <p>Prezado(a) ${client.razaoSocial},</p>
      <p>Segue o boleto referente ao CT-e.</p>
      <p><strong>Valor:</strong> R$ ${boleto.valor.toFixed(2)}</p>
      <p><strong>Vencimento:</strong> ${boleto.vencimento.toLocaleDateString('pt-BR')}</p>
      <p><strong>Linha Digitável:</strong> ${boleto.linhaDigitavel}</p>
      <p>Atenciosamente,<br>VCI TRANSPORTES</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
