import { signCteXml } from './cte.service.js';
import axios from 'axios';

/**
 * Gera XML do MDF-e
 */
export const generateMdfeXml = async (mdfeData) => {
  const {
    numeroMdfe,
    serieMdfe = '1',
    dataEmissao,
    cnpjEmitente,
    ufEmitente,
    razaoSocialEmitente,
    ieEmitente,
    ctes
  } = mdfeData;

  const chaveMdfe = generateChaveMdfe(
    numeroMdfe.toString(),
    serieMdfe,
    cnpjEmitente.replace(/\D/g, ''),
    ufEmitente,
    dataEmissao
  );

  // Montar lista de CT-es
  const infCTeList = ctes.map(cte => `
        <infCTe>
          <chCTe>${cte.chaveCte}</chCTe>
        </infCTe>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<MDFe xmlns="http://www.portalfiscal.inf.br/mdfe" versao="3.00">
  <infMDFe Id="MDFe${chaveMdfe}">
    <ide>
      <cUF>${ufEmitente === 'SP' ? '35' : '00'}</cUF>
      <tpAmb>${process.env.SEFAZ_AMBIENTE === 'producao' ? '1' : '2'}</tpAmb>
      <tpEmit>1</tpEmit>
      <mod>58</mod>
      <serie>${serieMdfe}</serie>
      <nMDF>${numeroMdfe}</nMDF>
      <cMDF>${chaveMdfe.slice(-8)}</cMDF>
      <cDV>${chaveMdfe.slice(-1)}</cDV>
      <modal>01</modal>
      <dhEmi>${new Date(dataEmissao).toISOString()}</dhEmi>
      <tpEmis>1</tpEmis>
      <procEmi>0</procEmi>
      <verProc>1.0</verProc>
      <UFIni>SP</UFIni>
      <UFFim>SP</UFFim>
    </ide>
    <emit>
      <CNPJ>${cnpjEmitente.replace(/\D/g, '')}</CNPJ>
      <IE>${ieEmitente}</IE>
      <xNome>${razaoSocialEmitente}</xNome>
      <xFant>${razaoSocialEmitente}</xFant>
      <enderEmit>
        <xLgr>RUA EXEMPLO</xLgr>
        <nro>123</nro>
        <xBairro>CENTRO</xBairro>
        <cMun>3550308</cMun>
        <xMun>SÃO PAULO</xMun>
        <UF>SP</UF>
        <CEP>01000000</CEP>
        <cPais>1058</cPais>
        <xPais>BRASIL</xPais>
        <fone>11999999999</fone>
      </enderEmit>
    </emit>
    <infModal versaoModal="3.00">
      <rodo>
        <RNTRC>12345678</RNTRC>
        <infANTT>
          <RNTRC>12345678</RNTRC>
        </infANTT>
        <veicTracao>
          <cInt>001</cInt>
          <placa>ABC1234</placa>
          <RENAVAM>12345678901</RENAVAM>
          <tara>0</tara>
          <capKG>10000</capKG>
          <capM3>50</capM3>
          <tpProp>1</tpProp>
          <tpRod>02</tpRod>
          <tpCar>02</tpCar>
          <UF>SP</UF>
          <prop>
            <CPF>00000000000</CPF>
            <xNome>MOTORISTA EXEMPLO</xNome>
            <IE>000000000000</IE>
            <UF>SP</UF>
            <tpProp>1</tpProp>
          </prop>
        </veicTracao>
        <lacRodo>
          <nLacre>123456</nLacre>
        </lacRodo>
      </rodo>
    </infModal>
    <infDoc>
      <infMunDescarga>
        <cMunDescarga>3550308</cMunDescarga>
        <xMunDescarga>SÃO PAULO</xMunDescarga>
        <infCTe>${infCTeList}
        </infCTe>
      </infMunDescarga>
    </infDoc>
    <tot>
      <qCTe>${ctes.length}</qCTe>
      <vCarga>0.00</vCarga>
      <cUnid>01</cUnid>
      <qCarga>0.000</qCarga>
    </tot>
    <lacres>
      <nLacre>123456</nLacre>
    </lacres>
    <autXML>
      <CNPJ>${cnpjEmitente.replace(/\D/g, '')}</CNPJ>
    </autXML>
  </infMDFe>
</MDFe>`;

  return { xml, chaveMdfe };
};

/**
 * Gera chave de acesso do MDF-e
 */
const generateChaveMdfe = (numeroMdfe, serie, cnpj, uf, dataEmissao) => {
  const anoMes = dataEmissao.substring(2, 6);
  const modelo = '58'; // MDF-e
  const codigoNumerico = numeroMdfe.padStart(8, '0');
  const dv = calcularDV(cnpj + uf + anoMes + modelo + serie + codigoNumerico);
  
  return cnpj + uf + anoMes + modelo + serie + codigoNumerico + dv;
};

/**
 * Calcula dígito verificador da chave
 */
const calcularDV = (chave) => {
  let soma = 0;
  let peso = 2;
  
  for (let i = chave.length - 1; i >= 0; i--) {
    soma += parseInt(chave[i]) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
};

/**
 * Assina XML do MDF-e
 */
export const signMdfeXml = (xml) => {
  return signCteXml(xml); // Reutiliza a mesma lógica de assinatura
};

/**
 * Envia MDF-e para SEFAZ
 */
export const sendMdfeToSefaz = async (xmlSigned) => {
  try {
    const ambiente = process.env.SEFAZ_AMBIENTE || 'homologacao';
    const url = ambiente === 'producao'
      ? process.env.SEFAZ_MDFE_URL_PRODUCAO
      : process.env.SEFAZ_MDFE_URL_HOMOLOGACAO;

    if (!url) {
      throw new Error('URL da SEFAZ não configurada');
    }

    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <mdfeRecepcao xmlns="http://www.portalfiscal.inf.br/mdfe/wsdl/MDFeRecepcao">
      <mdfeDados>${Buffer.from(xmlSigned).toString('base64')}</mdfeDados>
    </mdfeRecepcao>
  </soap12:Body>
</soap12:Envelope>`;

    const response = await axios.post(url, soapEnvelope, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'SOAPAction': 'http://www.portalfiscal.inf.br/mdfe/wsdl/MDFeRecepcao/mdfeRecepcao'
      },
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao enviar MDF-e para SEFAZ:', error);
    throw new Error('Erro ao enviar MDF-e para SEFAZ');
  }
};

/**
 * Consulta status do MDF-e na SEFAZ
 */
export const consultMdfeStatus = async (chaveMdfe) => {
  try {
    const ambiente = process.env.SEFAZ_AMBIENTE || 'homologacao';
    const url = ambiente === 'producao'
      ? process.env.SEFAZ_MDFE_URL_CONSULTA_PRODUCAO
      : process.env.SEFAZ_MDFE_URL_CONSULTA_HOMOLOGACAO;

    if (!url) {
      throw new Error('URL de consulta da SEFAZ não configurada');
    }

    const xmlConsulta = `<?xml version="1.0" encoding="UTF-8"?>
<consSitMDFe xmlns="http://www.portalfiscal.inf.br/mdfe" versao="3.00">
  <tpAmb>${ambiente === 'producao' ? '1' : '2'}</tpAmb>
  <xServ>CONSULTAR</xServ>
  <chMDFe>${chaveMdfe}</chMDFe>
</consSitMDFe>`;

    const xmlSigned = signMdfeXml(xmlConsulta);

    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <mdfeConsultaMDF xmlns="http://www.portalfiscal.inf.br/mdfe/wsdl/MDFeConsulta">
      <mdfeDados>${Buffer.from(xmlSigned).toString('base64')}</mdfeDados>
    </mdfeConsultaMDF>
  </soap12:Body>
</soap12:Envelope>`;

    const response = await axios.post(url, soapEnvelope, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'SOAPAction': 'http://www.portalfiscal.inf.br/mdfe/wsdl/MDFeConsulta/mdfeConsultaMDF'
      },
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao consultar MDF-e:', error);
    throw new Error('Erro ao consultar status do MDF-e');
  }
};

/**
 * Encerra MDF-e
 */
export const encerrarMdfe = async (chaveMdfe, codigoEncerramento) => {
  try {
    const ambiente = process.env.SEFAZ_AMBIENTE || 'homologacao';
    const url = ambiente === 'producao'
      ? process.env.SEFAZ_MDFE_URL_PRODUCAO
      : process.env.SEFAZ_MDFE_URL_HOMOLOGACAO;

    if (!url) {
      throw new Error('URL da SEFAZ não configurada');
    }

    const xmlEncerramento = `<?xml version="1.0" encoding="UTF-8"?>
<evtEncMDFe xmlns="http://www.portalfiscal.inf.br/mdfe" versao="3.00">
  <infEvento Id="ID${Date.now()}">
    <cOrgao>35</cOrgao>
    <tpAmb>${ambiente === 'producao' ? '1' : '2'}</tpAmb>
    <CNPJ>${process.env.SEFAZ_CNPJ.replace(/\D/g, '')}</CNPJ>
    <chMDFe>${chaveMdfe}</chMDFe>
    <dhEvento>${new Date().toISOString()}</dhEvento>
    <tpEvento>110112</tpEvento>
    <nSeqEvento>1</nSeqEvento>
    <detEvento versaoEvento="3.00">
      <evEncMDFe>
        <nProt>${codigoEncerramento}</nProt>
        <dtEnc>${new Date().toISOString().split('T')[0]}</dtEnc>
      </evEncMDFe>
    </detEvento>
  </infEvento>
</evtEncMDFe>`;

    const xmlSigned = signMdfeXml(xmlEncerramento);

    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <mdfeRecepcaoEvento xmlns="http://www.portalfiscal.inf.br/mdfe/wsdl/MDFeRecepcaoEvento">
      <mdfeDados>${Buffer.from(xmlSigned).toString('base64')}</mdfeDados>
    </mdfeRecepcaoEvento>
  </soap12:Body>
</soap12:Envelope>`;

    const response = await axios.post(url, soapEnvelope, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'SOAPAction': 'http://www.portalfiscal.inf.br/mdfe/wsdl/MDFeRecepcaoEvento/mdfeRecepcaoEvento'
      },
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao encerrar MDF-e:', error);
    throw new Error('Erro ao encerrar MDF-e');
  }
};
