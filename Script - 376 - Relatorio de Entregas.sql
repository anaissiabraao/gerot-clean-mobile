SELECT
  m.id_minuta AS MD,
  m.house AS HOUSE,
  u.sigla AS UNIDADE,
  DATE_FORMAT(m.data, '%d/%m/%Y') AS DATA,
  CASE
    WHEN m.cte_numero > 0 THEN CONCAT(m.cte_numero, '-', m.cte_serie)
    ELSE ''
  END AS CTE,
  CASE
    WHEN m.id_manifesto > 0 THEN CAST(m.id_manifesto AS CHAR)
    ELSE ''
  END AS MANIFESTO,
  COALESCE(
    NULLIF(
      SUBSTRING_INDEX(GROUP_CONCAT(n.nf ORDER BY n.nf SEPARATOR '<br/>'), '<br/>', 15),
      ''
    ),
    'DEC'
  ) AS `NOTA_FISCAL`,
  SUBSTR(c.fantasia, 1, 30) AS CLIENTE,
  CONCAT(
    SUBSTR(r.fantasia, 1, 30),
    '<br/>',
    CONCAT(rr.rota,' - ', rr.uf)
  ) AS REMETENTE,
  CONCAT(
    SUBSTR(CASE WHEN LENGTH(dee.fantasia) > 0 THEN dee.fantasia ELSE d.fantasia END, 1, 30),
    '<br/>',
    CONCAT(rd.rota,' - ', rd.uf)
  ) AS DESTINATARIO,
  CONCAT(ao.sigla, '-', ad.sigla) AS TRECHO,
  SUBSTR(
    CASE
      WHEN m.entrega_resp = 1 THEN UPPER(fu.nome)
      WHEN m.entrega_resp = 2 THEN fe.fantasia
      WHEN m.entrega_resp = 3 THEN UPPER(te.nome)
      ELSE ''
    END,
    1, 20
  ) AS `RESP_ENTREGA`,
  CASE
    WHEN m.coleta_numero > 0 THEN m.coleta_numero
    ELSE ''
  END AS COLETA,
  CASE
    WHEN m.coleta_data IS NULL OR m.coleta_data = '0000-00-00' THEN ''
    ELSE DATE_FORMAT(m.coleta_data, '%d/%m/%Y')
  END AS `DATA_COLETA`,
  CASE
    WHEN m.entrega_agendada = 1 THEN
      CASE WHEN m.agenda_data IS NULL OR m.agenda_data = '0000-00-00'
           THEN 'SEM PREVISAO'
           ELSE DATE_FORMAT(m.agenda_data, '%d/%m/%Y')
      END
    ELSE
      CASE WHEN m.prev_entrega IS NULL OR m.prev_entrega = '0000-00-00'
           THEN 'SEM PREVISAO'
           ELSE DATE_FORMAT(m.prev_entrega, '%d/%m/%Y')
      END
  END AS `PREV_ENTREGA_DATA`,
  CASE
    WHEN m.entrega_agendada = 1 THEN
      CASE WHEN m.agenda_hora_fim IS NULL OR LOWER(m.agenda_hora_fim) = 'false'
           THEN ''
           ELSE m.agenda_hora_fim
      END
    ELSE
      CASE WHEN m.prev_entrega_hora IS NULL OR LOWER(m.prev_entrega_hora) = 'false'
           THEN ''
           ELSE m.prev_entrega_hora
      END
  END AS `PREV_ENTREGA_HORA`,
  CASE
    WHEN m.data_entrega IS NULL OR m.data_entrega = '0000-00-00' THEN 'SEM DATA'
    ELSE CONCAT(
      DATE_FORMAT(m.data_entrega, '%d/%m/%Y'),
      CASE WHEN m.hora_entrega IS NULL OR LOWER(m.hora_entrega) = 'false' OR m.hora_entrega = ''
           THEN ''
           ELSE CONCAT('-', LEFT(m.hora_entrega, 5))
      END
    )
  END AS ENTREGA,
  CASE
    WHEN m.prazo_congelado = 1 THEN 'PRAZO CONGELADO'
    WHEN (m.prev_entrega IS NULL OR m.prev_entrega = '0000-00-00')
         AND (m.data_entrega IS NULL OR m.data_entrega = '0000-00-00')
      THEN 'SEM PREVISAO'
    WHEN (m.data_entrega IS NULL OR m.data_entrega = '0000-00-00') THEN
      CASE
        WHEN (
          (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) IS NOT NULL
          AND LOWER(CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) <> 'false'
          AND (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END) <> ''
        ) THEN
          CASE
            WHEN NOW() > STR_TO_DATE(
              CONCAT(
                (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END),
                ' ',
                (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END)
              ),
              '%Y-%m-%d %H:%i:%s'
            )
            THEN CASE WHEN m.ineficiencia > 0 THEN 'FORA DO PRAZO (IN.CLIENTE)' ELSE 'FORA DO PRAZO' END
            ELSE CASE WHEN m.ineficiencia > 0 THEN 'NO PRAZO (IN.CLIENTE)' ELSE 'NO PRAZO' END
          END
        ELSE
          CASE
            WHEN (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END) < CURDATE()
              THEN CASE WHEN m.ineficiencia > 0 THEN 'FORA DO PRAZO (IN.CLIENTE)' ELSE 'FORA DO PRAZO' END
            ELSE CASE WHEN m.ineficiencia > 0 THEN 'NO PRAZO (IN.CLIENTE)' ELSE 'NO PRAZO' END
          END
      END
    ELSE
      CASE
        WHEN (
          COALESCE(NULLIF(LEFT(m.prev_entrega_hora,5),''),'') <> ''
          AND COALESCE(NULLIF(LEFT(m.hora_entrega,5),''),'') <> ''
        ) THEN
          CASE
            WHEN STR_TO_DATE(CONCAT(m.data_entrega,' ',LEFT(m.hora_entrega,5)), '%Y-%m-%d %H:%i')
               >
               STR_TO_DATE(
                 CONCAT(
                   (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END),
                   ' ',
                   LEFT((CASE WHEN m.entrega_agendada = 1 THEN m.agenda_hora_fim ELSE m.prev_entrega_hora END),5)
                 ),
                 '%Y-%m-%d %H:%i'
               )
              THEN CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE FORA DO PRAZO  (IN.CLIENTE)' ELSE 'ENTREGUE FORA DO PRAZO' END
            ELSE CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE NO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE NO PRAZO' END
          END
        ELSE
          CASE
            WHEN m.data_entrega > (CASE WHEN m.entrega_agendada = 1 THEN m.agenda_data ELSE m.prev_entrega END)
              THEN CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE FORA DO PRAZO  (IN.CLIENTE)' ELSE 'ENTREGUE FORA DO PRAZO' END
            ELSE CASE WHEN m.ineficiencia > 0 THEN 'ENTREGUE NO PRAZO (IN.CLIENTE)' ELSE 'ENTREGUE NO PRAZO' END
          END
      END
  END AS STATUS
FROM minuta m
INNER JOIN fornecedores c ON c.id_local = m.id_cliente
INNER JOIN unidades u ON u.id_unidade = m.unidade
INNER JOIN fornecedores r ON r.id_local = CASE WHEN m.id_expedidor > 0 THEN m.id_expedidor ELSE m.id_origem END
INNER JOIN fornecedores d ON d.id_local = CASE WHEN m.id_entrega   > 0 THEN m.id_entrega   ELSE m.id_destino END
LEFT JOIN minuta_enderecos dex ON dex.id = m.id_expedidor_endereco
LEFT JOIN minuta_enderecos dee ON dee.id = m.id_entrega_endereco
LEFT JOIN rotas rr ON rr.id_rota = CASE	WHEN dex.cidade IS NOT NULL AND LENGTH(dex.cidade) > 0 THEN dex.cidade ELSE r.cidade END
LEFT JOIN rotas rd ON rd.id_rota = CASE	WHEN dee.cidade IS NOT NULL AND LENGTH(dee.cidade) > 0 THEN dee.cidade ELSE d.cidade END
LEFT JOIN aero ao ON ao.id_aero = m.transf_origem
LEFT JOIN aero ad ON ad.id_aero = m.transf_destino
LEFT JOIN notas_fiscais n ON n.id_minuta = m.id_minuta AND n.tipo = 'm'
LEFT JOIN funcionario fu ON fu.id_funcionario = m.entrega_resp_id AND m.entrega_resp = 1
LEFT JOIN fornecedores fe ON fe.id_local = m.entrega_resp_id AND m.entrega_resp = 2
LEFT JOIN terceiros te ON te.id_terceiro = m.entrega_resp_id AND m.entrega_resp = 3
WHERE
m.data >= '20260101' 
and m.data <= '20260127'
GROUP BY
  m.id_minuta
LIMIT 10000;