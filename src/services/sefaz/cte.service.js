import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import forge from 'node-forge';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

/**
 * Carrega certificado digital A1 (PFX)
 */
const loadCertificate = () => {
  try {
    const certPath = process.env.SEFAZ_CERT_PATH;
    const certPassword = process.env.SEFAZ_CERT_PASSWORD;

    if (!certPath || !certPassword) {
      throw new Error('Certificado digital não configurado');
    }

    const certBuffer = fs.readFileSync(certPath);
    const p12Asn1 = forge.asn1.fromDer(certBuffer.toString('binary'));
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, certPassword);

    // Extrair certificado e chave privada
    const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
    const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });

    const cert = bags[forge.pki.oids.certBag][0].cert;
    const key = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;

    return { cert, key };
  } catch (error) {
    console.error('Erro ao carregar certificado:', error);
    throw new Error('Erro ao carregar certificado digital');
  }
};

/**
 * Gera chave de acesso do CT-e
 */
const generateChaveCte = (numeroCte, serie, cnpj, uf, dataEmissao) => {
  const anoMes = dataEmissao.substring(2, 6); // AAMM
  const modelo = '57'; // CT-e
  const codigoNumerico = numeroCte.padStart(8, '0');
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
 * Gera XML do CT-e (Layout 3.00)
 */
export const generateCteXml = async (cteData) => {
  const {
    numeroCte,
    serieCte = '1',
    dataEmissao,
    cnpjEmitente,
    ufEmitente,
    razaoSocialEmitente,
    ieEmitente,
    cnpjRemetente,
    razaoSocialRemetente,
    cnpjDestinatario,
    razaoSocialDestinatario,
    origem,
    destino,
    valor,
    peso,
    cubagem,
    observacoes
  } = cteData;

  const chaveCte = generateChaveCte(
    numeroCte.toString(),
    serieCte,
    cnpjEmitente.replace(/\D/g, ''),
    ufEmitente,
    dataEmissao
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<CTe xmlns="http://www.portalfiscal.inf.br/cte" versao="3.00">
  <infCte Id="CTe${chaveCte}">
    <ide>
      <cUF>${ufEmitente === 'SP' ? '35' : '00'}</cUF>
      <cCT>${numeroCte}</cCT>
      <CFOP>5353</CFOP>
      <natOp>PRESTACAO DE SERVICO DE TRANSPORTE</natOp>
      <mod>57</mod>
      <serie>${serieCte}</serie>
      <nCT>${numeroCte}</nCT>
      <dhEmi>${new Date(dataEmissao).toISOString()}</dhEmi>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>${chaveCte.slice(-1)}</cDV>
      <tpAmb>${process.env.SEFAZ_AMBIENTE === 'producao' ? '1' : '2'}</tpAmb>
      <tpCTe>0</tpCTe>
      <procEmi>0</procEmi>
      <verProc>1.0</verProc>
      <indGlobalizado>0</indGlobalizado>
      <cMunEnv>3550308</cMunEnv>
      <xMunEnv>SÃO PAULO</xMunEnv>
      <UFEnv>SP</UFEnv>
      <modal>01</modal>
      <tpServ>0</tpServ>
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
    <rem>
      <CNPJ>${cnpjRemetente.replace(/\D/g, '')}</CNPJ>
      <xNome>${razaoSocialRemetente}</xNome>
      <enderReme>
        <xLgr>${origem}</xLgr>
        <nro>0</nro>
        <xBairro>CIDADE</xBairro>
        <cMun>3550308</cMun>
        <xMun>${origem}</xMun>
        <UF>SP</UF>
        <CEP>00000000</CEP>
        <cPais>1058</cPais>
        <xPais>BRASIL</xPais>
      </enderReme>
    </rem>
    <dest>
      <CNPJ>${cnpjDestinatario.replace(/\D/g, '')}</CNPJ>
      <xNome>${razaoSocialDestinatario}</xNome>
      <enderDest>
        <xLgr>${destino}</xLgr>
        <nro>0</nro>
        <xBairro>CIDADE</xBairro>
        <cMun>3550308</cMun>
        <xMun>${destino}</xMun>
        <UF>SP</UF>
        <CEP>00000000</CEP>
        <cPais>1058</cPais>
        <xPais>BRASIL</xPais>
      </enderDest>
    </dest>
    <vPrest>
      <vTPrest>${valor.toFixed(2)}</vTPrest>
      <vRec>${valor.toFixed(2)}</vRec>
    </vPrest>
    <imp>
      <ICMS>
        <ICMS00>
          <CST>00</CST>
          <vBC>${valor.toFixed(2)}</vBC>
          <pICMS>12.00</pICMS>
          <vICMS>${(valor * 0.12).toFixed(2)}</vICMS>
        </ICMS00>
      </ICMS>
      <vTotTrib>0.00</vTotTrib>
      <infAdFisco>CT-e gerado automaticamente pelo sistema TMS VCI TRANSPORTES</infAdFisco>
    </imp>
    <infCTeNorm>
      <infCarga>
        <vCarga>${valor.toFixed(2)}</vCarga>
        <proPred>CARGA GERAL</proPred>
        <infQ>
          <cUnid>01</cUnid>
          <tpMed>PESO</tpMed>
          <qCarga>${peso.toFixed(3)}</qCarga>
        </infQ>
        <infQ>
          <cUnid>01</cUnid>
          <tpMed>CUBAGEM</tpMed>
          <qCarga>${cubagem.toFixed(3)}</qCarga>
        </infQ>
      </infCarga>
      <infDoc>
        <infNFe>
          <chave>00000000000000000000000000000000000000000000</chave>
        </infNFe>
      </infDoc>
      <infModal>
        <rodo>
          <RNTRC>12345678</RNTRC>
        </rodo>
      </infModal>
    </infCTeNorm>
    ${observacoes ? `<infAdic><infCpl>${observacoes}</infCpl></infAdic>` : ''}
  </infCte>
</CTe>`;

  return { xml, chaveCte };
};

/**
 * Assina XML do CT-e
 */
export const signCteXml = (xml) => {
  try {
    const { cert, key } = loadCertificate();
    
    // Extrair conteúdo a ser assinado (infCte)
    const infCteMatch = xml.match(/<infCte[^>]*>[\s\S]*<\/infCte>/);
    if (!infCteMatch) {
      throw new Error('Estrutura XML inválida');
    }

    const infCte = infCteMatch[0];
    const infCteId = infCte.match(/Id="([^"]+)"/)?.[1];
    
    if (!infCteId) {
      throw new Error('ID do CT-e não encontrado');
    }

    // Criar hash SHA-1
    const md = forge.md.sha1.create();
    md.update(infCte, 'utf8');
    const hash = md.digest().toHex();

    // Assinar com chave privada
    const signature = cert.sign(key, md);

    // Criar elemento de assinatura
    const signatureXml = `
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
      <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
      <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
      <Reference URI="#${infCteId}">
        <Transforms>
          <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
          <Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
        </Transforms>
        <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
        <DigestValue>${Buffer.from(md.digest().getBytes(), 'binary').toString('base64')}</DigestValue>
      </Reference>
    </SignedInfo>
    <SignatureValue>${Buffer.from(signature, 'binary').toString('base64')}</SignatureValue>
    <KeyInfo>
      <X509Data>
        <X509Certificate>${forge.pki.certificateToPem(cert).match(/-----BEGIN CERTIFICATE-----([\s\S]*)-----END CERTIFICATE-----/)?.[1].replace(/\s/g, '')}</X509Certificate>
      </X509Data>
    </KeyInfo>
  </Signature>`;

    // Inserir assinatura antes do fechamento do CTe
    const signedXml = xml.replace('</CTe>', `${signatureXml}\n</CTe>`);

    return signedXml;
  } catch (error) {
    console.error('Erro ao assinar XML:', error);
    throw new Error('Erro ao assinar CT-e');
  }
};

/**
 * Envia CT-e para SEFAZ
 */
export const sendCteToSefaz = async (xmlSigned) => {
  try {
    const ambiente = process.env.SEFAZ_AMBIENTE || 'homologacao';
    const url = ambiente === 'producao' 
      ? process.env.SEFAZ_CTE_URL_PRODUCAO 
      : process.env.SEFAZ_CTE_URL_HOMOLOGACAO;

    if (!url) {
      throw new Error('URL da SEFAZ não configurada');
    }

    // Envolver XML no SOAP
    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <cteRecepcao xmlns="http://www.portalfiscal.inf.br/cte/wsdl/CteRecepcao">
      <cteDados>${Buffer.from(xmlSigned).toString('base64')}</cteDados>
    </cteRecepcao>
  </soap12:Body>
</soap12:Envelope>`;

    const response = await axios.post(url, soapEnvelope, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'SOAPAction': 'http://www.portalfiscal.inf.br/cte/wsdl/CteRecepcao/cteRecepcao'
      },
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao enviar CT-e para SEFAZ:', error);
    throw new Error('Erro ao enviar CT-e para SEFAZ');
  }
};

/**
 * Consulta status do CT-e na SEFAZ
 */
export const consultCteStatus = async (chaveCte) => {
  try {
    const ambiente = process.env.SEFAZ_AMBIENTE || 'homologacao';
    const url = ambiente === 'producao'
      ? process.env.SEFAZ_CTE_URL_CONSULTA_PRODUCAO
      : process.env.SEFAZ_CTE_URL_CONSULTA_HOMOLOGACAO;

    if (!url) {
      throw new Error('URL de consulta da SEFAZ não configurada');
    }

    const xmlConsulta = `<?xml version="1.0" encoding="UTF-8"?>
<consSitCTe xmlns="http://www.portalfiscal.inf.br/cte" versao="3.00">
  <tpAmb>${ambiente === 'producao' ? '1' : '2'}</tpAmb>
  <xServ>CONSULTAR</xServ>
  <chCTe>${chaveCte}</chCTe>
</consSitCTe>`;

    const xmlSigned = signCteXml(xmlConsulta);

    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <cteConsultaCT xmlns="http://www.portalfiscal.inf.br/cte/wsdl/CteConsulta">
      <cteDados>${Buffer.from(xmlSigned).toString('base64')}</cteDados>
    </cteConsultaCT>
  </soap12:Body>
</soap12:Envelope>`;

    const response = await axios.post(url, soapEnvelope, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'SOAPAction': 'http://www.portalfiscal.inf.br/cte/wsdl/CteConsulta/cteConsultaCT'
      },
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao consultar CT-e:', error);
    throw new Error('Erro ao consultar status do CT-e');
  }
};
