// 🛠️ Serviço para construir queries SQL dinâmicas

// Funções auxiliares para processar filtros
const toArray = (v) => Array.isArray(v) ? v : (v == null ? [] : [v]);

const toIntArray = (v) => {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr.map(x => Number(x));
};

// Função para verificar se um array tem valores válidos (não vazio e não apenas "Todos")
const temValoresValidos = (arr) => {
  if (!arr || arr.length === 0) return false;
  return arr.some(item => item !== "Todos" && item !== "todos" && item !== null && item !== "");
};

// Função para contar quantos filtros estão ativos
const contarFiltrosAtivos = (filtros) => {
  return Object.values(filtros).filter(arr => temValoresValidos(arr)).length;
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
  
  // Debug: Log dos filtros recebidos
  console.log("🔍 Filtros recebidos:", {
    bolsaFamilia: p1,
    situacaoPobreza: p2,
    setorEconomico: p3,
    sexo: p4,
    racaCor: p5,
    grauInstrucao: p6,
    faixaEtaria: p7,
    cadUnico: p8,
    uf: p9,
    ano: p10
  });
  
  // Verificar se há filtros ativos (verificando cada filtro individualmente)
  const filtrosAtivos = [
    { nome: 'bolsaFamilia', valores: p1 },
    { nome: 'situacaoPobreza', valores: p2 },
    { nome: 'setorEconomico', valores: p3 },
    { nome: 'sexo', valores: p4 },
    { nome: 'racaCor', valores: p5 },
    { nome: 'grauInstrucao', valores: p6 },
    { nome: 'faixaEtaria', valores: p7 },
    { nome: 'cadUnico', valores: p8 },
    { nome: 'uf', valores: p9 },
    { nome: 'ano', valores: p10 }
  ].filter(filtro => temValoresValidos(filtro.valores));
  
  console.log("🔍 Filtros ativos detectados:", filtrosAtivos.map(f => `${f.nome}: [${f.valores.join(', ')}]`));
  
  if (filtrosAtivos.length === 0) {
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
  
  // Se há múltiplos filtros ativos (2 ou mais), usar matriz
  const numFiltrosAtivos = filtrosAtivos.length;
  console.log(`🔍 Número de filtros ativos: ${numFiltrosAtivos}`);
  
  if (numFiltrosAtivos >= 2) {
    return buildMatrizQuery(filtros, filtrosAtivos);
  }
  
  // Se há apenas 1 filtro ativo, usar query normal
  return buildSingleFilterQuery(filtros, filtrosAtivos);
};

// Query para matriz de filtros (múltiplos filtros)
const buildMatrizQuery = (filtros, filtrosAtivos) => {
  console.log("🔍 Construindo query de matriz...");
  
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
  
  // Determinar campos para agrupar baseado nos filtros ativos
  const camposParaAgrupar = ['"UF"'];
  
  if (temValoresValidos(p1)) camposParaAgrupar.push('"Bolsa Família"');
  if (temValoresValidos(p2)) camposParaAgrupar.push('"Situação de Pobreza"');
  if (temValoresValidos(p3)) camposParaAgrupar.push('"Setor Econômico"');
  if (temValoresValidos(p4)) camposParaAgrupar.push('"Sexo"');
  if (temValoresValidos(p5)) camposParaAgrupar.push('"Raça/Cor"');
  if (temValoresValidos(p6)) camposParaAgrupar.push('"Grau de Instrução"');
  if (temValoresValidos(p7)) camposParaAgrupar.push('"Faixa Etária"');
  if (temValoresValidos(p8)) camposParaAgrupar.push('"CadÚnico"');
  if (temValoresValidos(p10)) camposParaAgrupar.push('"Ano"');
  
  // Garantir que sempre agrupe por UF e Ano
  if (!camposParaAgrupar.includes('"Ano"')) {
    camposParaAgrupar.push('"Ano"');
  }
  
  // Construir a query de matriz
  const selectFields = [
    '"UF" AS uf',
    '"Ano" AS ano'
  ];
  
  // Adicionar campos condicionalmente
  if (temValoresValidos(p8)) {
    selectFields.push('"CadÚnico" AS cad_unico');
  } else {
    selectFields.push("'Todos' AS cad_unico");
  }
  
  if (temValoresValidos(p7)) {
    selectFields.push('"Faixa Etária" AS faixa_etaria');
  } else {
    selectFields.push("'Todos' AS faixa_etaria");
  }
  
  if (temValoresValidos(p6)) {
    selectFields.push('"Grau de Instrução" AS grau_instrucao');
  } else {
    selectFields.push("'Todos' AS grau_instrucao");
  }
  
  if (temValoresValidos(p1)) {
    selectFields.push('"Bolsa Família" AS bolsa_familia');
  } else {
    selectFields.push("'Todos' AS bolsa_familia");
  }
  
  if (temValoresValidos(p2)) {
    selectFields.push('"Situação de Pobreza" AS situacao_pobreza');
  } else {
    selectFields.push("'Todos' AS situacao_pobreza");
  }
  
  if (temValoresValidos(p3)) {
    selectFields.push('"Setor Econômico" AS setor_economico');
  } else {
    selectFields.push("'Todos' AS setor_economico");
  }
  
  if (temValoresValidos(p5)) {
    selectFields.push('"Raça/Cor" AS raca_cor');
  } else {
    selectFields.push("'Todos' AS raca_cor");
  }
  
  if (temValoresValidos(p4)) {
    selectFields.push('"Sexo" AS sexo');
  } else {
    selectFields.push("'Todos' AS sexo");
  }
  
  selectFields.push('COALESCE(SUM("Admissoes"), 0) AS admissoes');
  selectFields.push('COALESCE(SUM("Desligamentos"), 0) AS desligamentos');
  selectFields.push('COALESCE(SUM("Saldo"), 0) AS saldo');
  
  const sql = `
    SELECT ${selectFields.join(', ')}
    FROM planilha_dashboard
    WHERE
      (COALESCE(array_length($1::text[],1),0)=0 OR COALESCE(NULLIF("Bolsa Família",''),'Não Informado') = ANY($1::text[])) AND
      (COALESCE(array_length($2::text[],1),0)=0 OR COALESCE(NULLIF("Situação de Pobreza",''),'Não Informado') = ANY($2::text[])) AND
      (COALESCE(array_length($3::text[],1),0)=0 OR COALESCE(NULLIF("Setor Econômico",''),'Não Informado') = ANY($3::text[])) AND
      (COALESCE(array_length($4::text[],1),0)=0 OR COALESCE(NULLIF("Sexo",''),'Não Informado') = ANY($4::text[])) AND
      (COALESCE(array_length($5::text[],1),0)=0 OR COALESCE(NULLIF("Raça/Cor",''),'Não Informado') = ANY($5::text[])) AND
      (COALESCE(array_length($6::text[],1),0)=0 OR COALESCE(NULLIF("Grau de Instrução",''),'Não Informado') = ANY($6::text[])) AND
      (COALESCE(array_length($7::text[],1),0)=0 OR COALESCE(NULLIF("Faixa Etária",''),'Não Informado') = ANY($7::text[])) AND
      (COALESCE(array_length($8::text[],1),0)=0 OR COALESCE(NULLIF("CadÚnico",''),'Não Informado') = ANY($8::text[])) AND
      (COALESCE(array_length($9::text[],1),0)=0 OR "UF" = ANY($9::text[])) AND
      (COALESCE(array_length($10::int[],1),0)=0 OR "Ano" = ANY($10::int[]))
    GROUP BY ${camposParaAgrupar.join(', ')}
    ORDER BY "UF", "Ano";
  `;
  
  console.log("🔍 Query de matriz gerada:", sql);
  console.log("🔍 Parâmetros:", params);
  console.log("🔍 Campos para agrupar:", camposParaAgrupar);
  
  return { sql, params };
};

// Query para filtro único
const buildSingleFilterQuery = (filtros, filtrosAtivos) => {
  console.log("🔍 Construindo query de filtro único...");
  
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
  
  // Se há filtros ativos, consolida por UF e pelos filtros selecionados
  const camposParaAgrupar = ['"UF"'];
  
  // Adicionar campos dos filtros ativos ao agrupamento
  if (temValoresValidos(p1)) camposParaAgrupar.push('"Bolsa Família"');
  if (temValoresValidos(p2)) camposParaAgrupar.push('"Situação de Pobreza"');
  if (temValoresValidos(p3)) camposParaAgrupar.push('"Setor Econômico"');
  if (temValoresValidos(p4)) camposParaAgrupar.push('"Sexo"');
  if (temValoresValidos(p5)) camposParaAgrupar.push('"Raça/Cor"');
  if (temValoresValidos(p6)) camposParaAgrupar.push('"Grau de Instrução"');
  if (temValoresValidos(p7)) camposParaAgrupar.push('"Faixa Etária"');
  if (temValoresValidos(p8)) camposParaAgrupar.push('"CadÚnico"');
  if (temValoresValidos(p10)) camposParaAgrupar.push('"Ano"');
  
  // Se não há filtros específicos além de UF, sempre agrupa por UF e Ano
  if (camposParaAgrupar.length === 1) {
    camposParaAgrupar.push('"Ano"');
  }
  
  // Garantir que sempre agrupe por UF e Ano se não estiverem já incluídos
  if (!camposParaAgrupar.includes('"Ano"')) {
    camposParaAgrupar.push('"Ano"');
  }
  
  // Construir a query de forma mais segura
  const selectFields = [
    '"UF" AS uf',
    '"Ano" AS ano'
  ];
  
  // Adicionar campos condicionalmente
  if (temValoresValidos(p8)) {
    selectFields.push('"CadÚnico" AS cad_unico');
  } else {
    selectFields.push("'Todos' AS cad_unico");
  }
  
  if (temValoresValidos(p7)) {
    selectFields.push('"Faixa Etária" AS faixa_etaria');
  } else {
    selectFields.push("'Todos' AS faixa_etaria");
  }
  
  if (temValoresValidos(p6)) {
    selectFields.push('"Grau de Instrução" AS grau_instrucao');
  } else {
    selectFields.push("'Todos' AS grau_instrucao");
  }
  
  if (temValoresValidos(p1)) {
    selectFields.push('"Bolsa Família" AS bolsa_familia');
  } else {
    selectFields.push("'Todos' AS bolsa_familia");
  }
  
  if (temValoresValidos(p2)) {
    selectFields.push('"Situação de Pobreza" AS situacao_pobreza');
  } else {
    selectFields.push("'Todos' AS situacao_pobreza");
  }
  
  if (temValoresValidos(p3)) {
    selectFields.push('"Setor Econômico" AS setor_economico');
  } else {
    selectFields.push("'Todos' AS setor_economico");
  }
  
  if (temValoresValidos(p5)) {
    selectFields.push('"Raça/Cor" AS raca_cor');
  } else {
    selectFields.push("'Todos' AS raca_cor");
  }
  
  if (temValoresValidos(p4)) {
    selectFields.push('"Sexo" AS sexo');
  } else {
    selectFields.push("'Todos' AS sexo");
  }
  
  selectFields.push('COALESCE(SUM("Admissoes"), 0) AS admissoes');
  selectFields.push('COALESCE(SUM("Desligamentos"), 0) AS desligamentos');
  selectFields.push('COALESCE(SUM("Saldo"), 0) AS saldo');
  
  const sql = `
    SELECT ${selectFields.join(', ')}
    FROM planilha_dashboard
    WHERE
      (COALESCE(array_length($1::text[],1),0)=0 OR COALESCE(NULLIF("Bolsa Família",''),'Não Informado') = ANY($1::text[])) AND
      (COALESCE(array_length($2::text[],1),0)=0 OR COALESCE(NULLIF("Situação de Pobreza",''),'Não Informado') = ANY($2::text[])) AND
      (COALESCE(array_length($3::text[],1),0)=0 OR COALESCE(NULLIF("Setor Econômico",''),'Não Informado') = ANY($3::text[])) AND
      (COALESCE(array_length($4::text[],1),0)=0 OR COALESCE(NULLIF("Sexo",''),'Não Informado') = ANY($4::text[])) AND
      (COALESCE(array_length($5::text[],1),0)=0 OR COALESCE(NULLIF("Raça/Cor",''),'Não Informado') = ANY($5::text[])) AND
      (COALESCE(array_length($6::text[],1),0)=0 OR COALESCE(NULLIF("Grau de Instrução",''),'Não Informado') = ANY($6::text[])) AND
      (COALESCE(array_length($7::text[],1),0)=0 OR COALESCE(NULLIF("Faixa Etária",''),'Não Informado') = ANY($7::text[])) AND
      (COALESCE(array_length($8::text[],1),0)=0 OR COALESCE(NULLIF("CadÚnico",''),'Não Informado') = ANY($8::text[])) AND
      (COALESCE(array_length($9::text[],1),0)=0 OR "UF" = ANY($9::text[])) AND
      (COALESCE(array_length($10::int[],1),0)=0 OR "Ano" = ANY($10::int[]))
    GROUP BY ${camposParaAgrupar.join(', ')}
    ORDER BY "UF", "Ano";
  `;
  
  // Debug: Log da query SQL
  console.log("🔍 Query SQL gerada:", sql);
  console.log("🔍 Parâmetros:", params);
  console.log("🔍 Campos para agrupar:", camposParaAgrupar);
  
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
