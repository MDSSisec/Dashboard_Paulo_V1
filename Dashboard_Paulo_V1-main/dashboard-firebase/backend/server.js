const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// ROTA TEMPORÁRIA DE DEBUG - MELHORADA
app.post("/debug-filtros", (req, res) => {
  const keys = ['uf','ano','faixaEtaria','sexo','racaCor','setorEconomico','bolsaFamilia','situacaoPobreza','grauInstrucao','cadUnico'];
  const diag = {};
  
  for (const k of keys) {
    const v = req.body?.[k];
    diag[k] = { 
      tipo: Array.isArray(v) ? 'array' : typeof v, 
      tamanho: Array.isArray(v) ? v.length : undefined, 
      exemplo: Array.isArray(v) ? v.slice(0,10) : v 
    };
  }
  
  console.log('📦 Filtros recebidos:', JSON.stringify(req.body, null, 2));
  console.log('🧪 Diagnóstico:', JSON.stringify(diag, null, 2));
  
  res.json({ ok: true, diag, received: req.body });
});
 
 // Função para gerar todas as combinações possíveis de valores
 function gerarCombinacoes(valoresPorCampo) {
   const campos = Object.keys(valoresPorCampo);
   if (campos.length === 0) return [];
   
   const combinacoes = [];
   
   function gerarCombinacao(atual, indice) {
     if (indice === campos.length) {
       combinacoes.push({...atual});
       return;
     }
     
     const campo = campos[indice];
     const valores = valoresPorCampo[campo];
     
     for (const valor of valores) {
       atual[campo] = valor;
       gerarCombinacao(atual, indice + 1);
     }
   }
   
   gerarCombinacao({}, 0);
   return combinacoes;
 }

// 🔌 Conexão com PostgreSQL local
const pool = new Pool({
  user: "postgres",       // ✅ ALTERA aqui
  host: "localhost",
  database: "meu_banco_1",  // ✅ ALTERA aqui
  password: "@dM1n090710",  // ✅ ALTERA aqui
  port: 5432,
});

// 📌 Rota para buscar todos os dados da planilha
app.get("/dados", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "planilha_dashboard"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar dados");
  }
});

// 📌 Rota POST para buscar dados agrupados com filtros (CORRIGIDA - SUBCATEGORIAS)
app.post("/dados-agrupados", async (req, res) => {
  try {
    const b = req.body || {};
    console.log("📊 [BACKEND] ===== INÍCIO DA REQUISIÇÃO POST /dados-agrupados =====");
    console.log("📊 [BACKEND] Filtros recebidos:", JSON.stringify(b, null, 2));
    
    // Mapeamento de UF sigla -> nome caso o banco salve por extenso
    const UF_MAP = {
      AC: "Acre", AL: "Alagoas", AM: "Amazonas", AP: "Amapá",
      BA: "Bahia", CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo",
      GO: "Goiás", MA: "Maranhão", MG: "Minas Gerais", MS: "Mato Grosso do Sul",
      MT: "Mato Grosso", PA: "Pará", PB: "Paraíba", PE: "Pernambuco",
      PI: "Piauí", PR: "Paraná", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
      RO: "Rondônia", RR: "Roraima", RS: "Rio Grande do Sul", SC: "Santa Catarina",
      SE: "Sergipe", SP: "São Paulo", TO: "Tocantins"
    };

    // Funções para processar arrays de filtros - OTIMIZADAS
    const toArray = (v) => Array.isArray(v) ? v : (v == null ? [] : [v]);
    const toIntArray = (v) => Array.isArray(v) ? v.map(x => Number(x)) : [];

    // Se o front manda siglas, converte para nome
    const mapUFs = (arr) => {
      if (!arr) return null;
      return arr.map(u => UF_MAP[u] ?? u);
    };
    
    // 🔑 Parâmetros esperados vindos do frontend - SEMPRE ARRAYS
    const p1 = toArray(b.bolsaFamilia);
    const p2 = toArray(b.situacaoPobreza);
    const p3 = toArray(b.setorEconomico);
    const p4 = toArray(b.sexo);
    const p5 = toArray(b.racaCor);
    const p6 = toArray(b.grauInstrucao);
    const p7 = toArray(b.faixaEtaria);
    const p8 = toArray(b.cadUnico);
    const p9 = mapUFs(toArray(b.uf));
    const p10 = toIntArray(b.ano);
    
    const params = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10];
    
    console.log("📊 [BACKEND] Parâmetros processados:", {
      bolsaFamilia: p1.length,
      situacaoPobreza: p2.length,
      setorEconomico: p3.length,
      sexo: p4.length,
      racaCor: p5.length,
      grauInstrucao: p6.length,
      faixaEtaria: p7.length,
      cadUnico: p8.length,
      uf: p9.length,
      ano: p10.length
    });
    
    // Log detalhado de cada filtro
    const nomesFiltros = ['bolsaFamilia', 'situacaoPobreza', 'setorEconomico', 'sexo', 'racaCor', 'grauInstrucao', 'faixaEtaria', 'cadUnico', 'uf', 'ano'];
    const arrays = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10];
    
    nomesFiltros.forEach((nome, index) => {
      const valores = arrays[index];
      if (valores && valores.length > 0) {
        console.log(`🔍 Filtro ${nome}: ${valores.length} valores - [${valores.slice(0, 5).join(', ')}${valores.length > 5 ? '...' : ''}]`);
      } else {
        console.log(`🔍 Filtro ${nome}: SEM RESTRIÇÃO (array vazio)`);
      }
    });
    
    // Query SQL otimizada - SEM LIMITES ARTIFICIAIS
    const sql = `
      /* Parâmetros esperados:
      $1  text[] = bolsa_familia
      $2  text[] = situacao_pobreza
      $3  text[] = setor_economico
      $4  text[] = sexo
      $5  text[] = raca_cor
      $6  text[] = grau_instrucao
      $7  text[] = faixa_etaria
      $8  text[] = cad_unico
      $9  text[] = uf
      $10 int[]  = ano
      */
      
      WITH dados AS (
        SELECT
          uf,
          ano,
          COALESCE(NULLIF(faixa_etaria,''),'Não Informado')    AS faixa_etaria,
          COALESCE(NULLIF(sexo,''),'Não Informado')            AS sexo,
          COALESCE(NULLIF(cad_unico,''),'Não Informado')       AS cad_unico,
          COALESCE(NULLIF(bolsa_familia,''),'Não Informado')   AS bolsa_familia,
          COALESCE(NULLIF(situacao_pobreza,''),'Não Informado') AS situacao_pobreza,
          COALESCE(NULLIF(setor_economico,''),'Não Informado')  AS setor_economico,
          COALESCE(NULLIF(raca_cor,''),'Não Informado')         AS raca_cor,
          COALESCE(NULLIF(grau_instrucao,''),'Não Informado')   AS grau_instrucao,
          admissoes, desligamentos, saldo
        FROM planilha_dashboard
        WHERE
          (COALESCE(array_length($1::text[],1),0)=0 OR bolsa_familia    = ANY($1::text[])) AND
          (COALESCE(array_length($2::text[],1),0)=0 OR situacao_pobreza = ANY($2::text[])) AND
          (COALESCE(array_length($3::text[],1),0)=0 OR setor_economico  = ANY($3::text[])) AND
          (COALESCE(array_length($4::text[],1),0)=0 OR sexo             = ANY($4::text[])) AND
          (COALESCE(array_length($5::text[],1),0)=0 OR raca_cor         = ANY($5::text[])) AND
          (COALESCE(array_length($6::text[],1),0)=0 OR grau_instrucao   = ANY($6::text[])) AND
          (COALESCE(array_length($7::text[],1),0)=0 OR faixa_etaria     = ANY($7::text[])) AND
          (COALESCE(array_length($8::text[],1),0)=0 OR cad_unico        = ANY($8::text[])) AND
          (COALESCE(array_length($9::text[],1),0)=0 OR uf               = ANY($9::text[])) AND
          (COALESCE(array_length($10::int[],1),0)=0 OR ano              = ANY($10::int[]))
      )
      SELECT
        uf, ano,
        cad_unico, faixa_etaria, grau_instrucao, bolsa_familia,
        situacao_pobreza, setor_economico, raca_cor, sexo,
        SUM(admissoes)     AS admissoes,
        SUM(desligamentos) AS desligamentos,
        SUM(saldo)         AS saldo
      FROM dados
      GROUP BY
        uf, ano,
        cad_unico, faixa_etaria, grau_instrucao, bolsa_familia,
        situacao_pobreza, setor_economico, raca_cor, sexo
      ORDER BY uf, ano, cad_unico, faixa_etaria;
    `;
    
    console.log("📊 [BACKEND] Query SQL final:", sql);
    console.log("📊 [BACKEND] Parâmetros:", params);
    
    const t0 = Date.now();
    const { rows } = await pool.query(sql, params);
    const t1 = Date.now();
    
    console.log(`📊 [BACKEND] Query executada em ${t1-t0}ms`);
    console.log(`📊 [BACKEND] Total de registros retornados: ${rows.length}`);
    
    if (rows.length > 0) {
      console.log(`📊 [BACKEND] Primeira linha exemplo:`, JSON.stringify(rows[0], null, 2));
      console.log(`📊 [BACKEND] Campos da primeira linha:`, Object.keys(rows[0]));
      
      // Verificar se os valores dos filtros aparecem corretamente
      const filtrosAtivos = params.map((param, index) => param ? nomesFiltros[index] : null).filter(Boolean);
      console.log(`📊 [BACKEND] Filtros ativos aplicados:`, filtrosAtivos);
      
      // Verificar se os valores filtrados aparecem nos resultados
      filtrosAtivos.forEach(filtro => {
        const valoresFiltro = params[nomesFiltros.indexOf(filtro)];
        if (valoresFiltro) {
          const valoresEncontrados = [...new Set(rows.map(row => row[filtro.replace(/([A-Z])/g, '_$1').toLowerCase()]))];
          console.log(`📊 [BACKEND] Valores do filtro ${filtro} encontrados:`, valoresEncontrados);
        }
      });
    } else {
      console.log(`📊 [BACKEND] Nenhum registro encontrado com os filtros aplicados`);
    }
    
    console.log("📊 [BACKEND] ===== FIM DA REQUISIÇÃO POST /dados-agrupados =====");
    res.json({ ok: true, rows });
  } catch (err) {
    console.error("❌ Erro ao buscar dados agrupados:", err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// 📌 Rota GET para buscar dados agrupados com filtros (mantida para compatibilidade)
app.get("/dados-agrupados", async (req, res) => {
  try {
    const filtros = req.query;
    console.log("Filtros recebidos para agrupamento:", filtros);
    
    // Mapeamento dos nomes das categorias para as colunas do PostgreSQL
    const mapeamentoColunas = {
      bolsaFamilia: "Bolsa Família",
      situacaoPobreza: "Situação de Pobreza",
      setorEconomico: "Setor Econômico",
      sexo: "Sexo",
      racaCor: "Raça/Cor",
      grauInstrucao: "Grau de Instrução",
      faixaEtaria: "Faixa Etária",
      cadUnico: "CadÚnico",
      uf: "UF",
      ano: "Ano"
    };
    
    // Verificar se há filtros ativos
    const filtrosAtivos = Object.keys(filtros).filter(campo => 
      filtros[campo] && filtros[campo].length > 0 && !filtros[campo].includes("Todos")
    );
    
    console.log("Filtros ativos:", filtrosAtivos);
    
    // Construir WHERE clause usando arrays PostgreSQL (ANY)
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    // Processar cada filtro como array
    Object.keys(filtros).forEach(campo => {
      if (filtros[campo] && filtros[campo] !== 'Todos') {
        const valores = filtros[campo].split(',');
        const nomeColuna = mapeamentoColunas[campo] || campo;
        
        // Tratamento especial para CadÚnico
        let valoresAjustados = valores;
        if (campo === 'cadUnico') {
          console.log(`CadÚnico - valores recebidos:`, valores);
          // Converter "NAO" para "NÃO" para corresponder ao banco
          valoresAjustados = valores.map(v => {
            if (v === "NAO") return "NÃO";
            if (v === "NÃO") return "NÃO";
            return v;
          });
          console.log(`CadÚnico - valores ajustados:`, valoresAjustados);
        }
        
        // Usar ANY($1::text[]) para arrays PostgreSQL
        whereClause += ` AND "${nomeColuna}" = ANY($${paramIndex}::text[])`;
        params.push(valoresAjustados);
        paramIndex++;
        
        console.log(`🔍 Filtro ${campo}: ${valoresAjustados.length} valores usando ANY($${paramIndex-1}::text[])`);
      }
    });
    
    // Determinar campos para GROUP BY baseado nos filtros ativos
    const camposBase = ['"UF"', '"Ano"'];
    let camposFiltros = [];
    
    if (filtrosAtivos.length > 0) {
      camposFiltros = filtrosAtivos.map(campo => `"${mapeamentoColunas[campo] || campo}"`);
    }
    
              // Sempre agrupar por todos os campos selecionados para mostrar combinações únicas
      let camposAgrupamento;
      let camposSelect;
      
      if (filtrosAtivos.length === 1 && filtrosAtivos[0] === 'cadUnico') {
        console.log("🔍 Apenas CadÚnico selecionado - agrupando por UF, Ano E CadÚnico");
        camposAgrupamento = [...camposBase, '"CadÚnico"'];
        camposSelect = camposAgrupamento.join(', ');
      } else if (filtrosAtivos.length > 0) {
        console.log("🔍 Múltiplos filtros selecionados - agrupando por todos os campos");
        camposAgrupamento = [...camposBase, ...camposFiltros];
        camposSelect = camposAgrupamento.join(', ');
      } else {
        console.log("🔍 Nenhum filtro selecionado - agrupando apenas por UF e Ano");
        camposAgrupamento = camposBase;
        camposSelect = camposAgrupamento.join(', ');
      }
    const groupByClause = camposAgrupamento.join(', ');
    
    // Query SQL com agrupamento
    const query = `
      SELECT 
        ${camposSelect},
        SUM("Admissoes") as admissoes,
        SUM("Desligamentos") as desligamentos,
        SUM("Saldo") as saldo
      FROM "planilha_dashboard"
      ${whereClause}
      GROUP BY ${groupByClause}
      ORDER BY "UF", "Ano"
    `;
    
    console.log("Query SQL com agrupamento:", query);
    console.log("Parâmetros:", params);
    
    const result = await pool.query(query, params);
    console.log(`Dados agrupados retornados: ${result.rows.length} registros`);
    
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar dados agrupados:", err);
    res.status(500).send("Erro ao buscar dados agrupados");
  }
});

// 📌 Rota para buscar dados filtrados (mantida para compatibilidade)
app.get("/dados-filtrados", async (req, res) => {
  try {
    const filtros = req.query;
    console.log("Filtros recebidos:", filtros);
    
    let query = 'SELECT * FROM "planilha_dashboard" WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    // Construir query usando arrays PostgreSQL (ANY)
    Object.keys(filtros).forEach(campo => {
      if (filtros[campo] && filtros[campo] !== 'Todos') {
        const valores = filtros[campo].split(',');
        
        // Usar ANY($1::text[]) para arrays PostgreSQL
        query += ` AND "${campo}" = ANY($${paramIndex}::text[])`;
        params.push(valores);
        paramIndex++;
        
        console.log(`🔍 Filtro ${campo}: ${valores.length} valores usando ANY($${paramIndex-1}::text[])`);
      }
    });
    
    console.log("Query SQL:", query);
    console.log("Parâmetros:", params);
    
    const result = await pool.query(query, params);
    console.log(`Dados filtrados retornados: ${result.rows.length} registros`);
    
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar dados filtrados:", err);
    res.status(500).send("Erro ao buscar dados filtrados");
  }
});

// 📌 Rota para verificar valores únicos do CadÚnico (debug)
app.get("/debug-cadunico", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT "CadÚnico", COUNT(*) as total
      FROM "planilha_dashboard"
      GROUP BY "CadÚnico"
      ORDER BY "CadÚnico"
    `);
    
    console.log("Valores únicos do CadÚnico:", result.rows);
    res.json({
      message: "Valores únicos do CadÚnico",
      data: result.rows
    });
  } catch (err) {
    console.error("Erro ao verificar CadÚnico:", err);
    res.status(500).send("Erro ao verificar CadÚnico");
  }
});

// 📌 Rota para debug - verificar dados com filtros
app.get("/debug-filtros", async (req, res) => {
  try {
    const filtros = req.query;
    console.log("=== DEBUG FILTROS ===");
    console.log("Filtros recebidos:", filtros);
    
    // Mapeamento dos nomes das categorias para as colunas do PostgreSQL
    const mapeamentoColunas = {
      bolsaFamilia: "bolsa_familia",
      situacaoPobreza: "situacao_pobreza", 
      setorEconomico: "setor_economico",
      sexo: "sexo",
      racaCor: "raca_cor",
      grauInstrucao: "grau_instrucao",
      faixaEtaria: "faixa_etaria",
      cadUnico: "cad_unico",
      uf: "uf",
      ano: "ano"
    };
    
    // Função de normalização
    const normalizar = (str) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .toUpperCase()
        .trim();
    };
    
    // Função para converter array para formato do banco
    const toDbArray = (arr) => {
      if (!arr || arr.length === 0) return null;
      return arr.map(normalizar);
    };
    
    // Verificar se há filtros ativos
    const filtrosAtivos = Object.keys(filtros).filter(campo => 
      filtros[campo] && filtros[campo].length > 0 && !filtros[campo].includes("Todos")
    );
    
    console.log("Filtros ativos:", filtrosAtivos);
    
    // Construir WHERE clause usando arrays PostgreSQL (ANY) com normalização
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    // Processar cada filtro como array
    Object.keys(filtros).forEach(campo => {
      if (filtros[campo] && filtros[campo] !== 'Todos') {
        const valores = filtros[campo].split(',');
        const nomeColuna = mapeamentoColunas[campo] || campo;
        
        // Normalizar valores para o banco
        const valoresNormalizados = toDbArray(valores);
        
        if (valoresNormalizados) {
          // Usar ANY($1::text[]) para arrays PostgreSQL
          whereClause += ` AND "${nomeColuna}" = ANY($${paramIndex}::text[])`;
          params.push(valoresNormalizados);
          paramIndex++;
          
          console.log(`🔍 Filtro ${campo}: ${valoresNormalizados.length} valores normalizados usando ANY($${paramIndex-1}::text[])`);
          console.log(`   Valores: [${valoresNormalizados.join(', ')}]`);
        }
      }
    });
    
    // Gerar todas as combinações possíveis
    const camposComValores = Object.keys(valoresPorCampo);
    if (camposComValores.length > 0) {
      const combinacoes = gerarCombinacoes(valoresPorCampo);
      console.log(`🔍 Geradas ${combinacoes.length} combinações únicas`);
      
      const condicoes = combinacoes.map(combinacao => {
        const condicao = Object.entries(combinacao).map(([campo, valor]) => {
          return `"${campo}" = $${paramIndex++}`;
        }).join(' AND ');
        params.push(...Object.values(combinacao));
        return `(${condicao})`;
      });
      
      whereClause = `WHERE (${condicoes.join(' OR ')})`;
    }
    
    // Determinar campos para GROUP BY baseado nos filtros ativos
    const camposBase = ['"UF"', '"Ano"'];
    let camposFiltros = [];
    
    if (filtrosAtivos.length > 0) {
      camposFiltros = filtrosAtivos.map(campo => `"${mapeamentoColunas[campo] || campo}"`);
    }
    
         // Sempre agrupar por todos os campos selecionados para mostrar combinações únicas
     let camposAgrupamento;
     let camposSelect;
     
     if (filtrosAtivos.length === 1 && filtrosAtivos[0] === 'cadUnico') {
       console.log("🔍 Apenas CadÚnico selecionado - agrupando por UF, Ano E CadÚnico");
       camposAgrupamento = [...camposBase, '"CadÚnico"'];
       camposSelect = camposAgrupamento.join(', ');
     } else if (filtrosAtivos.length > 0) {
       console.log("🔍 Múltiplos filtros selecionados - agrupando por todos os campos");
       camposAgrupamento = [...camposBase, ...camposFiltros];
       camposSelect = camposAgrupamento.join(', ');
     } else {
       console.log("🔍 Nenhum filtro selecionado - agrupando apenas por UF e Ano");
       camposAgrupamento = camposBase;
       camposSelect = camposAgrupamento.join(', ');
     }
    const groupByClause = camposAgrupamento.join(', ');
    
    // Query SQL com agrupamento
    const query = `
      SELECT 
        ${camposSelect},
        SUM("Admissoes") as admissoes,
        SUM("Desligamentos") as desligamentos,
        SUM("Saldo") as saldo
      FROM "planilha_dashboard"
      ${whereClause}
             GROUP BY ${groupByClause}
       ORDER BY "UF", "Ano"
    `;
    
    console.log("Query SQL com agrupamento:", query);
    console.log("Parâmetros:", params);
    
    const result = await pool.query(query, params);
    console.log(`Dados agrupados retornados: ${result.rows.length} registros`);
    console.log("Primeiro resultado:", result.rows[0]);
    
    res.json({
      message: "Debug de filtros",
      filtrosRecebidos: filtros,
      filtrosAtivos: filtrosAtivos,
      query: query,
      parametros: params,
      resultados: result.rows,
      total: result.rows.length
    });
  } catch (err) {
    console.error("Erro ao debug filtros:", err);
    res.status(500).send("Erro ao debug filtros");
  }
});

// 📌 Rota de teste - buscar dados simples
app.get("/teste", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        "UF",
        "Ano",
        "CadÚnico",
        SUM("Admissoes") as admissoes,
        SUM("Desligamentos") as desligamentos,
        SUM("Saldo") as saldo
      FROM "planilha_dashboard"
      WHERE "CadÚnico" IN ('SIM', 'NÃO')
      GROUP BY "UF", "Ano", "CadÚnico"
      ORDER BY "UF", "Ano"
    `);
    
    console.log("=== TESTE ===");
    console.log("Resultados:", result.rows);
    console.log("Primeiro resultado:", result.rows[0]);
    console.log("Chaves do primeiro resultado:", Object.keys(result.rows[0] || {}));
    
    res.json({
      message: "Teste de dados",
      resultados: result.rows,
      total: result.rows.length
    });
  } catch (err) {
    console.error("Erro no teste:", err);
    res.status(500).send("Erro no teste");
  }
});

// 📌 Rota para testar CadÚnico sem agrupamento
app.get("/teste-cadunico-sem-agrupamento", async (req, res) => {
  try {
    console.log("=== TESTE CADÚNICO SEM AGRUPAMENTO ===");
    
    // Testar query simples sem agrupamento
    const result = await pool.query(`
      SELECT "UF", "Ano", "CadÚnico", "Admissoes", "Desligamentos", "Saldo"
      FROM "planilha_dashboard"
      WHERE "CadÚnico" = 'NÃO'
      ORDER BY "UF", "Ano"
      LIMIT 20
    `);
    
    console.log(`Resultados sem agrupamento: ${result.rows.length}`);
    console.log("Primeiros resultados:", result.rows.slice(0, 3));
    
    res.json({
      message: "Teste CadÚnico sem agrupamento",
      resultados: result.rows,
      total: result.rows.length
    });
    
  } catch (err) {
    console.error("Erro no teste sem agrupamento:", err);
    res.status(500).send("Erro no teste sem agrupamento");
  }
});

// 📌 Rota para verificar todos os anos e UFs disponíveis
app.get("/verificar-anos-ufs", async (req, res) => {
  try {
    console.log("=== VERIFICANDO ANOS E UFS NO BANCO ===");
    
    // Verificar todos os anos únicos
    const anosUnicos = await pool.query(`
      SELECT DISTINCT "Ano", COUNT(*) as total
      FROM "planilha_dashboard"
      GROUP BY "Ano"
      ORDER BY "Ano"
    `);
    
    // Verificar todas as UFs únicas
    const ufsUnicas = await pool.query(`
      SELECT DISTINCT "UF", COUNT(*) as total
      FROM "planilha_dashboard"
      GROUP BY "UF"
      ORDER BY "UF"
    `);
    
    // Verificar combinações Ano-UF
    const combinacoesAnoUf = await pool.query(`
      SELECT "Ano", "UF", COUNT(*) as total
      FROM "planilha_dashboard"
      GROUP BY "Ano", "UF"
      ORDER BY "Ano", "UF"
    `);
    
    // Verificar CadÚnico por ano
    const cadUnicoPorAno = await pool.query(`
      SELECT "Ano", "CadÚnico", COUNT(*) as total
      FROM "planilha_dashboard"
      GROUP BY "Ano", "CadÚnico"
      ORDER BY "Ano", "CadÚnico"
    `);
    
    res.json({
      message: "Verificação Anos e UFs no banco",
      anosUnicos: anosUnicos.rows,
      ufsUnicas: ufsUnicas.rows,
      combinacoesAnoUf: combinacoesAnoUf.rows,
      cadUnicoPorAno: cadUnicoPorAno.rows,
      resumo: {
        totalAnos: anosUnicos.rows.length,
        totalUfs: ufsUnicas.rows.length,
        totalCombinacoes: combinacoesAnoUf.rows.length
      }
    });
    
    console.log("✅ Anos únicos:", anosUnicos.rows.map(r => r.Ano));
    console.log("✅ UFs únicas:", ufsUnicas.rows.map(r => r.UF));
    console.log("✅ Total de combinações Ano-UF:", combinacoesAnoUf.rows.length);
    
  } catch (err) {
    console.error("Erro ao verificar anos e UFs no banco:", err);
    res.status(500).send("Erro ao verificar anos e UFs no banco");
  }
});

// 📌 Rota de análise detalhada da planilha
app.get("/analise-planilha", async (req, res) => {
  try {
    console.log("🔍 [ANÁLISE] Iniciando análise detalhada da planilha...");
    
    // 1. Buscar dados brutos (10 linhas de amostra)
    const amostraResult = await pool.query(`
      SELECT * FROM planilha_dashboard LIMIT 10
    `);
    
    // 2. Buscar valores distintos por coluna-chave
    const colunasChave = [
      'uf', 'ano', 'cad_unico', 'bolsa_familia', 'faixa_etaria', 
      'grau_instrucao', 'raca_cor', 'sexo', 'setor_economico'
    ];
    
    const valoresDistintos = {};
    
    for (const coluna of colunasChave) {
      try {
        const result = await pool.query(`
          SELECT DISTINCT "${coluna}" as valor, COUNT(*) as total
          FROM planilha_dashboard 
          WHERE "${coluna}" IS NOT NULL
          GROUP BY "${coluna}"
          ORDER BY total DESC
          LIMIT 20
        `);
        valoresDistintos[coluna] = result.rows.map(r => r.valor);
      } catch (err) {
        console.log(`⚠️ Coluna ${coluna} não encontrada ou com erro:`, err.message);
        valoresDistintos[coluna] = [];
      }
    }
    
    // 3. Função de normalização
    const normalizar = (str) => {
      if (!str) return null;
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .toUpperCase()
        .trim()
        .replace(/\s+/g, ' '); // Colapsar espaços
    };
    
    // 4. Gerar mapa de normalização para cada coluna
    const mapaNormalizacao = {};
    
    for (const [coluna, valores] of Object.entries(valoresDistintos)) {
      mapaNormalizacao[coluna] = {};
      valores.forEach(valor => {
        const normalizado = normalizar(valor);
        if (normalizado && normalizado !== valor) {
          mapaNormalizacao[coluna][valor] = normalizado;
        }
      });
    }
    
    // 5. Verificar colunas existentes vs esperadas
    const colunasEsperadas = [
      'uf', 'ano', 'cad_unico', 'bolsa_familia', 'faixa_etaria',
      'grau_instrucao', 'raca_cor', 'sexo', 'setor_economico',
      'admissoes', 'desligamentos', 'saldo'
    ];
    
    const colunasExistentes = amostraResult.rows.length > 0 ? Object.keys(amostraResult.rows[0]) : [];
    
    const colunasOk = colunasEsperadas.filter(col => colunasExistentes.includes(col));
    const colunasFaltando = colunasEsperadas.filter(col => !colunasExistentes.includes(col));
    const colunasExtra = colunasExistentes.filter(col => !colunasEsperadas.includes(col));
    
    // 6. Contar valores inválidos por coluna
    const valoresInvalidos = {};
    for (const coluna of colunasChave) {
      try {
        const result = await pool.query(`
          SELECT COUNT(*) as total
          FROM planilha_dashboard 
          WHERE "${coluna}" IS NULL OR "${coluna}" = '' OR "${coluna}" = 'Não Informado'
        `);
        valoresInvalidos[coluna] = parseInt(result.rows[0].total);
      } catch (err) {
        valoresInvalidos[coluna] = -1; // Erro ao consultar
      }
    }
    
    // 7. Gerar relatório final
    const relatorio = {
      timestamp: new Date().toISOString(),
      resumo: {
        totalRegistros: amostraResult.rows.length,
        colunasExistentes: colunasExistentes.length,
        colunasEsperadas: colunasEsperadas.length
      },
      colunas: {
        ok: colunasOk,
        faltando: colunasFaltando,
        extra: colunasExtra
      },
      amostra: amostraResult.rows,
      valoresDistintos,
      mapaNormalizacao,
      valoresInvalidos,
      recomendacoes: []
    };
    
    // 8. Gerar recomendações
    if (colunasFaltando.length > 0) {
      relatorio.recomendacoes.push(`⚠️ Colunas faltando: ${colunasFaltando.join(', ')}`);
    }
    
    if (colunasExtra.length > 0) {
      relatorio.recomendacoes.push(`ℹ️ Colunas extras encontradas: ${colunasExtra.join(', ')}`);
    }
    
    for (const [coluna, invalidos] of Object.entries(valoresInvalidos)) {
      if (invalidos > 0) {
        relatorio.recomendacoes.push(`⚠️ Coluna ${coluna}: ${invalidos} valores inválidos`);
      }
    }
    
    console.log("🔍 [ANÁLISE] Análise concluída");
    console.log("📊 Colunas OK:", colunasOk);
    console.log("❌ Colunas faltando:", colunasFaltando);
    console.log("ℹ️ Colunas extras:", colunasExtra);
    
    res.json(relatorio);
    
  } catch (err) {
    console.error("❌ [ANÁLISE] Erro na análise:", err);
    res.status(500).json({ 
      error: String(err),
      message: "Erro ao analisar planilha"
    });
  }
});

// 📌 Rota de teste para verificar dados brutos do PostgreSQL
app.get("/teste-dados-brutos", async (req, res) => {
  try {
    console.log("🔍 [TESTE] Verificando dados brutos no PostgreSQL...");
    
    const result = await pool.query(`
      SELECT uf, ano, cad_unico, bolsa_familia, raca_cor, sexo, setor_economico 
      FROM planilha_dashboard 
      LIMIT 20
    `);
    
    console.log("🔍 [TESTE] Total de registros encontrados:", result.rows.length);
    
    if (result.rows.length > 0) {
      console.log("🔍 [TESTE] Primeira linha do banco:", JSON.stringify(result.rows[0], null, 2));
      console.log("🔍 [TESTE] Campos disponíveis:", Object.keys(result.rows[0]));
    }
    
    res.json({
      total: result.rows.length,
      exemplo: result.rows[0] || null,
      campos: result.rows.length > 0 ? Object.keys(result.rows[0]) : [],
      dados: result.rows
    });
  } catch (err) {
    console.error("❌ [TESTE] Erro ao consultar banco:", err);
    res.status(500).json({ error: String(err) });
  }
});

// 📌 Rota para buscar opções de filtros (valores distintos do banco)
app.get("/opcoes-filtros", async (req, res) => {
  try {
    console.log("🔍 [BACKEND] Buscando opções de filtros do banco...");
    
    // Mapeamento dos nomes das categorias para as colunas do PostgreSQL
    const mapeamentoColunas = {
      bolsaFamilia: "bolsa_familia",
      situacaoPobreza: "situacao_pobreza", 
      setorEconomico: "setor_economico",
      sexo: "sexo",
      racaCor: "raca_cor",
      grauInstrucao: "grau_instrucao",
      faixaEtaria: "faixa_etaria",
      cadUnico: "cad_unico",
      uf: "uf",
      ano: "ano"
    };
    
    const opcoesFiltros = {};
    
    // Buscar valores distintos para cada categoria
    for (const [categoria, coluna] of Object.entries(mapeamentoColunas)) {
      try {
        const query = `
          SELECT DISTINCT "${coluna}" as valor
          FROM planilha_dashboard 
          WHERE "${coluna}" IS NOT NULL 
            AND "${coluna}" != '' 
            AND "${coluna}" != 'Não Informado'
          ORDER BY "${coluna}"
        `;
        
        const result = await pool.query(query);
        const valores = result.rows.map(row => row.valor).filter(valor => valor);
        
        console.log(`✅ ${categoria}: ${valores.length} valores distintos encontrados`);
        console.log(`   Valores: [${valores.slice(0, 10).join(', ')}${valores.length > 10 ? '...' : ''}]`);
        
        opcoesFiltros[categoria] = valores;
      } catch (err) {
        console.error(`❌ Erro ao buscar valores para ${categoria}:`, err.message);
        opcoesFiltros[categoria] = [];
      }
    }
    
    console.log("🔍 [BACKEND] Opções de filtros carregadas com sucesso");
    console.log("📊 Total de categorias:", Object.keys(opcoesFiltros).length);
    
    res.json({
      success: true,
      message: "Opções de filtros carregadas com sucesso",
      opcoes: opcoesFiltros,
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    console.error("❌ [BACKEND] Erro ao buscar opções de filtros:", err);
    res.status(500).json({
      success: false,
      error: String(err),
      message: "Erro ao buscar opções de filtros"
    });
  }
});

app.listen(3001, () => {
  console.log("✅ Servidor rodando em http://localhost:3001");
});
