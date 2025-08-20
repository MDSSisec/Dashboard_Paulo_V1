// 🛠️ Serviço para construir queries SQL dinâmicas

// Funções auxiliares para processar filtros
const toArray = (v) => Array.isArray(v) ? v : (v == null ? [] : [v]);

const toIntArray = (v) => {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr.map(x => Number(x));
};

// Query principal para dados agrupados
const buildMainQuery = (filtros) => {
  // Processar filtros
  const p1 = toArray(filtros.bolsaFamilia);
  const p2 = toArray(filtros.situacaoPobreza);
  const p3 = toArray(filtros.setorEconomico);
  const p4 = toArray(filtros.sexo);
  const p5 = toArray(filtros.racaCor);
  const p6 = toArray(filtros.grauInstrucao);
  const p7 = toArray(filtros.faixaEtaria);
  const p8 = toArray(filtros.cadUnico);
  const p9 = toArray(filtros.uf);
  const p10 = toIntArray(filtros.ano);
  
  const params = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10];
  
  // Verificar se há filtros ativos (excluindo arrays vazios ou com "Todos")
  const filtrosAtivos = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10].some(arr => 
    arr.length > 0 && !arr.every(item => item === "Todos" || item === "todos")
  );
  
  if (!filtrosAtivos) {
    // Se não há filtros, retorna dados consolidados por ano (sem UF)
    const sql = `
      SELECT
        'Todos os Estados' AS uf, 
        "Ano" AS ano,
        'Todos' AS cad_unico, 
        'Todos' AS faixa_etaria, 
        'Todos' AS grau_instrucao, 
        'Todos' AS bolsa_familia,
        'Todos' AS situacao_pobreza, 
        'Todos' AS setor_economico, 
        'Todos' AS raca_cor, 
        'Todos' AS sexo,
        SUM("Admissoes") AS admissoes,
        SUM("Desligamentos") AS desligamentos,
        SUM("Saldo") AS saldo
      FROM planilha_dashboard
      GROUP BY "Ano"
      ORDER BY "Ano";
    `;
    
    return { sql, params: [] };
  }
  

  
  // Se há filtros ativos, consolida por UF e pelos filtros selecionados
  const camposParaAgrupar = ['"UF"'];
  
  // Adicionar campos dos filtros ativos ao agrupamento
  if (p1.length > 0) camposParaAgrupar.push('"Bolsa Família"');
  if (p2.length > 0) camposParaAgrupar.push('"Situação de Pobreza"');
  if (p3.length > 0) camposParaAgrupar.push('"Setor Econômico"');
  if (p4.length > 0) camposParaAgrupar.push('"Sexo"');
  if (p5.length > 0) camposParaAgrupar.push('"Raça/Cor"');
  if (p6.length > 0) camposParaAgrupar.push('"Grau de Instrução"');
  if (p7.length > 0) camposParaAgrupar.push('"Faixa Etária"');
  if (p8.length > 0) camposParaAgrupar.push('"CadÚnico"');
  if (p10.length > 0) camposParaAgrupar.push('"Ano"');
  
  // Se não há filtros específicos além de UF, sempre agrupa por UF
  if (camposParaAgrupar.length === 1) {
    camposParaAgrupar.push('"Ano"');
  }
  
  const sql = `
    WITH dados AS (
      SELECT
        "UF",
        "Ano",
        COALESCE(NULLIF("Faixa Etária",''),'Não Informado') AS "Faixa Etária",
        COALESCE(NULLIF("Sexo",''),'Não Informado') AS "Sexo",
        COALESCE(NULLIF("CadÚnico",''),'Não Informado') AS "CadÚnico",
        COALESCE(NULLIF("Bolsa Família",''),'Não Informado') AS "Bolsa Família",
        COALESCE(NULLIF("Situação de Pobreza",''),'Não Informado') AS "Situação de Pobreza",
        COALESCE(NULLIF("Setor Econômico",''),'Não Informado') AS "Setor Econômico",
        COALESCE(NULLIF("Raça/Cor",''),'Não Informado') AS "Raça/Cor",
        COALESCE(NULLIF("Grau de Instrução",''),'Não Informado') AS "Grau de Instrução",
        "Admissoes", "Desligamentos", "Saldo"
      FROM planilha_dashboard
      WHERE
        (COALESCE(array_length($1::text[],1),0)=0 OR "Bolsa Família" = ANY($1::text[])) AND
        (COALESCE(array_length($2::text[],1),0)=0 OR "Situação de Pobreza" = ANY($2::text[])) AND
        (COALESCE(array_length($3::text[],1),0)=0 OR "Setor Econômico" = ANY($3::text[])) AND
        (COALESCE(array_length($4::text[],1),0)=0 OR "Sexo" = ANY($4::text[])) AND
        (COALESCE(array_length($5::text[],1),0)=0 OR "Raça/Cor" = ANY($5::text[])) AND
        (COALESCE(array_length($6::text[],1),0)=0 OR "Grau de Instrução" = ANY($6::text[])) AND
        (COALESCE(array_length($7::text[],1),0)=0 OR "Faixa Etária" = ANY($7::text[])) AND
        (COALESCE(array_length($8::text[],1),0)=0 OR "CadÚnico" = ANY($8::text[])) AND
        (COALESCE(array_length($9::text[],1),0)=0 OR "UF" = ANY($9::text[])) AND
        (COALESCE(array_length($10::int[],1),0)=0 OR "Ano" = ANY($10::int[]))
    )
    SELECT
      "UF" AS uf, 
      "Ano" AS ano,
      ${p8.length > 0 ? '"CadÚnico"' : "'Todos'"} AS cad_unico, 
      ${p7.length > 0 ? '"Faixa Etária"' : "'Todos'"} AS faixa_etaria, 
      ${p6.length > 0 ? '"Grau de Instrução"' : "'Todos'"} AS grau_instrucao, 
      ${p1.length > 0 ? '"Bolsa Família"' : "'Todos'"} AS bolsa_familia,
      ${p2.length > 0 ? '"Situação de Pobreza"' : "'Todos'"} AS situacao_pobreza, 
      ${p3.length > 0 ? '"Setor Econômico"' : "'Todos'"} AS setor_economico, 
      ${p5.length > 0 ? '"Raça/Cor"' : "'Todos'"} AS raca_cor, 
      ${p4.length > 0 ? '"Sexo"' : "'Todos'"} AS sexo,
      COALESCE(SUM("Admissoes"), 0) AS admissoes,
      COALESCE(SUM("Desligamentos"), 0) AS desligamentos,
      COALESCE(SUM("Saldo"), 0) AS saldo
    FROM dados
    GROUP BY ${camposParaAgrupar.join(', ')}
    ORDER BY "UF", "Ano";
  `;
  
  return { sql, params };
};

// Query para dados iniciais - retorna dados consolidados por ano (sem UF)
const buildInitialQuery = () => {
  return `
    SELECT
      'Todos os Estados' AS uf, 
      "Ano" AS ano,
      'Todos' AS cad_unico, 
      'Todos' AS faixa_etaria, 
      'Todos' AS grau_instrucao, 
      'Todos' AS bolsa_familia,
      'Todos' AS situacao_pobreza, 
      'Todos' AS setor_economico, 
      'Todos' AS raca_cor, 
      'Todos' AS sexo,
      COALESCE(SUM("Admissoes"), 0) AS admissoes,
      COALESCE(SUM("Desligamentos"), 0) AS desligamentos,
      COALESCE(SUM("Saldo"), 0) AS saldo
    FROM planilha_dashboard
    WHERE "Ano" IS NOT NULL
    GROUP BY "Ano"
    ORDER BY "Ano";
  `;
};

module.exports = {
  buildMainQuery,
  buildInitialQuery,
  toArray,
  toIntArray
};
