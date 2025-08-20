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
    // Se não há filtros, retorna dados consolidados por ano
    const sql = `
      SELECT
        'Todas as UFs' AS uf, 
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
  

  
  // Se há filtros, retorna dados agrupados normalmente
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
      "UF" AS uf, "Ano" AS ano,
      "CadÚnico" AS cad_unico, "Faixa Etária" AS faixa_etaria, "Grau de Instrução" AS grau_instrucao, "Bolsa Família" AS bolsa_familia,
      "Situação de Pobreza" AS situacao_pobreza, "Setor Econômico" AS setor_economico, "Raça/Cor" AS raca_cor, "Sexo" AS sexo,
      SUM("Admissoes") AS admissoes,
      SUM("Desligamentos") AS desligamentos,
      SUM("Saldo") AS saldo
    FROM dados
    GROUP BY
      "UF", "Ano",
      "CadÚnico", "Faixa Etária", "Grau de Instrução", "Bolsa Família",
      "Situação de Pobreza", "Setor Econômico", "Raça/Cor", "Sexo"
    ORDER BY "UF", "Ano", "CadÚnico", "Faixa Etária";
  `;
  
  return { sql, params };
};

// Query para dados iniciais - retorna dados individuais como estava antes
const buildInitialQuery = () => {
  return 'SELECT * FROM "planilha_dashboard" LIMIT 100';
};

module.exports = {
  buildMainQuery,
  buildInitialQuery,
  toArray,
  toIntArray
};
