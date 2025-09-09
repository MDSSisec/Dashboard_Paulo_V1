// 🛠️ Serviço para construir queries SQL dinâmicas - VERSÃO ATUALIZADA

// Funções auxiliares para processar filtros
const toArray = (v) => Array.isArray(v) ? v : (v == null ? [] : [v]);

const toIntArray = (v) => {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr.map(x => Number(x));
};

// Função para verificar se um array tem valores válidos
const temValoresValidos = (arr) => {
  if (!arr || arr.length === 0) return false;
  return arr.some(item => item !== "Todos" && item !== "todos" && item !== null && item !== "");
};

// Query principal para dados agrupados - VERSÃO SIMPLIFICADA
const buildMainQuery = (filtros) => {
  console.log("🔍 Construindo query principal...");
  
  // Processar todos os filtros
  const bolsaFamilia = toArray(filtros.bolsaFamilia);
  const situacaoPobreza = toArray(filtros.situacaoPobreza);
  const setorEconomico = toArray(filtros.setorEconomico);
  const sexo = toArray(filtros.sexo);
  const racaCor = toArray(filtros.racaCor);
  const grauInstrucao = toArray(filtros.grauInstrucao);
  const faixaEtaria = toArray(filtros.faixaEtaria);
  const cadUnico = toArray(filtros.cadUnico);
  const uf = toArray(filtros.uf);
  const ano = toIntArray(filtros.ano);
  
  // Determinar campos para agrupar baseado nos filtros ativos
  const camposParaAgrupar = ['"UF"', '"Ano"'];
  const camposSelect = ['"UF" AS uf', '"Ano" AS ano'];
  
  // Adicionar campos dos filtros ativos
  if (temValoresValidos(bolsaFamilia)) {
    camposParaAgrupar.push('"Bolsa Família"');
    camposSelect.push('"Bolsa Família" AS bolsa_familia');
  } else {
    camposSelect.push("'Todos' AS bolsa_familia");
  }
  
  if (temValoresValidos(situacaoPobreza)) {
    camposParaAgrupar.push('"Situação de Pobreza"');
    camposSelect.push('"Situação de Pobreza" AS situacao_pobreza');
  } else {
    camposSelect.push("'Todos' AS situacao_pobreza");
  }
  
  if (temValoresValidos(setorEconomico)) {
    camposParaAgrupar.push('"Setor Econômico"');
    camposSelect.push('"Setor Econômico" AS setor_economico');
  } else {
    camposSelect.push("'Todos' AS setor_economico");
  }
  
  if (temValoresValidos(sexo)) {
    camposParaAgrupar.push('"Sexo"');
    camposSelect.push('"Sexo" AS sexo');
  } else {
    camposSelect.push("'Todos' AS sexo");
  }
  
  if (temValoresValidos(racaCor)) {
    camposParaAgrupar.push('"Raça/Cor"');
    camposSelect.push('"Raça/Cor" AS raca_cor');
  } else {
    camposSelect.push("'Todos' AS raca_cor");
  }
  
  if (temValoresValidos(grauInstrucao)) {
    camposParaAgrupar.push('"Grau de Instrução"');
    camposSelect.push('"Grau de Instrução" AS grau_instrucao');
  } else {
    camposSelect.push("'Todos' AS grau_instrucao");
  }
  
  if (temValoresValidos(faixaEtaria)) {
    camposParaAgrupar.push('"Faixa Etária"');
    camposSelect.push('"Faixa Etária" AS faixa_etaria');
  } else {
    camposSelect.push("'Todos' AS faixa_etaria");
  }
  
  if (temValoresValidos(cadUnico)) {
    camposParaAgrupar.push('"CadÚnico"');
    camposSelect.push('"CadÚnico" AS cad_unico');
  } else {
    camposSelect.push("'Todos' AS cad_unico");
  }
  
  // Campos de métricas sempre presentes
  camposSelect.push('SUM("Admissoes") AS admissoes');
  camposSelect.push('SUM("Desligamentos") AS desligamentos');
  camposSelect.push('SUM("Saldo") AS saldo');
  
  // Construir WHERE clause dinamicamente
  const whereConditions = [];
  const params = [];
  let paramIndex = 1;
  
  if (temValoresValidos(bolsaFamilia)) {
    whereConditions.push(`"Bolsa Família" = ANY($${paramIndex}::text[])`);
    params.push(bolsaFamilia);
    paramIndex++;
  }
  
  if (temValoresValidos(situacaoPobreza)) {
    whereConditions.push(`"Situação de Pobreza" = ANY($${paramIndex}::text[])`);
    params.push(situacaoPobreza);
    paramIndex++;
  }
  
  if (temValoresValidos(setorEconomico)) {
    whereConditions.push(`"Setor Econômico" = ANY($${paramIndex}::text[])`);
    params.push(setorEconomico);
    paramIndex++;
  }
  
  if (temValoresValidos(sexo)) {
    whereConditions.push(`"Sexo" = ANY($${paramIndex}::text[])`);
    params.push(sexo);
    paramIndex++;
  }
  
  if (temValoresValidos(racaCor)) {
    whereConditions.push(`"Raça/Cor" = ANY($${paramIndex}::text[])`);
    params.push(racaCor);
    paramIndex++;
  }
  
  if (temValoresValidos(grauInstrucao)) {
    whereConditions.push(`"Grau de Instrução" = ANY($${paramIndex}::text[])`);
    params.push(grauInstrucao);
    paramIndex++;
  }
  
  if (temValoresValidos(faixaEtaria)) {
    whereConditions.push(`"Faixa Etária" = ANY($${paramIndex}::text[])`);
    params.push(faixaEtaria);
    paramIndex++;
  }
  
  if (temValoresValidos(cadUnico)) {
    whereConditions.push(`"CadÚnico" = ANY($${paramIndex}::text[])`);
    params.push(cadUnico);
    paramIndex++;
  }
  
  if (temValoresValidos(uf)) {
    whereConditions.push(`"UF" = ANY($${paramIndex}::text[])`);
    params.push(uf);
    paramIndex++;
  }
  
  if (temValoresValidos(ano)) {
    whereConditions.push(`"Ano" = ANY($${paramIndex}::int[])`);
    params.push(ano);
    paramIndex++;
  }
  
  // Construir SQL final
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
  const sql = `
    SELECT ${camposSelect.join(', ')}
    FROM planilha_dashboard
    ${whereClause}
    GROUP BY ${camposParaAgrupar.join(', ')}
    ORDER BY "UF", "Ano" DESC
  `;
  
  console.log("🔍 Query gerada:", sql);
  console.log("🔍 Parâmetros:", params);
  console.log("🔍 Campos para agrupar:", camposParaAgrupar);
  
  return { sql, params };
};

// Query para dados iniciais (sem filtros)
const buildInitialQuery = () => {
  return `
    SELECT 
      "UF" AS uf,
      "Ano" AS ano,
      'Todos' AS bolsa_familia,
      'Todos' AS situacao_pobreza,
      'Todos' AS setor_economico,
      'Todos' AS sexo,
      'Todos' AS raca_cor,
      'Todos' AS grau_instrucao,
      'Todos' AS faixa_etaria,
      'Todos' AS cad_unico,
      SUM("Admissoes") AS admissoes,
      SUM("Desligamentos") AS desligamentos,
      SUM("Saldo") AS saldo
    FROM planilha_dashboard
    GROUP BY "UF", "Ano"
    ORDER BY "UF", "Ano" DESC
    LIMIT 100
  `;
};

module.exports = {
  buildMainQuery,
  buildInitialQuery
};
