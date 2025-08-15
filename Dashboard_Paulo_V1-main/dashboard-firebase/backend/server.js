const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

 const app = express();
 app.use(cors());
 app.use(express.json());
 
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

// 📌 Rota para buscar dados agrupados com filtros
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
    
    // Construir WHERE clause baseada nos filtros
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    // Coletar todos os valores de cada campo para gerar combinações
    const valoresPorCampo = {};
    
    Object.keys(filtros).forEach(campo => {
      if (filtros[campo] && filtros[campo] !== 'Todos') {
        const valores = filtros[campo].split(',');
        const nomeColuna = mapeamentoColunas[campo] || campo;
        
        // Tratamento especial para CadÚnico
        if (campo === 'cadUnico') {
          console.log(`CadÚnico - valores recebidos:`, valores);
          // Converter "NAO" para "NÃO" para corresponder ao banco
          const valoresAjustados = valores.map(v => {
            if (v === "NAO") return "NÃO";
            if (v === "NÃO") return "NÃO";
            return v;
          });
          console.log(`CadÚnico - valores ajustados:`, valoresAjustados);
          valoresPorCampo[nomeColuna] = valoresAjustados;
        } else {
          valoresPorCampo[nomeColuna] = valores;
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
    
    // Construir query dinamicamente baseada nos filtros
    Object.keys(filtros).forEach(campo => {
      if (filtros[campo] && filtros[campo] !== 'Todos') {
        const valores = filtros[campo].split(',');
        
        if (valores.length === 1) {
          // Filtro único
          query += ` AND "${campo}" = $${paramIndex}`;
          params.push(valores[0]);
          paramIndex++;
        } else {
          // Múltiplos valores (IN)
          const placeholders = valores.map(() => `$${paramIndex++}`).join(',');
          query += ` AND "${campo}" IN (${placeholders})`;
          params.push(...valores);
        }
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
    
    // Construir WHERE clause baseada nos filtros
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    // Coletar todos os valores de cada campo para gerar combinações
    const valoresPorCampo = {};
    
    Object.keys(filtros).forEach(campo => {
      if (filtros[campo] && filtros[campo] !== 'Todos') {
        const valores = filtros[campo].split(',');
        const nomeColuna = mapeamentoColunas[campo] || campo;
        
        // Tratamento especial para CadÚnico
        if (campo === 'cadUnico') {
          console.log(`CadÚnico - valores recebidos:`, valores);
          // Converter "NAO" para "NÃO" para corresponder ao banco
          const valoresAjustados = valores.map(v => {
            if (v === "NAO") return "NÃO";
            if (v === "NÃO") return "NÃO";
            return v;
          });
          console.log(`CadÚnico - valores ajustados:`, valoresAjustados);
          valoresPorCampo[nomeColuna] = valoresAjustados;
        } else {
          valoresPorCampo[nomeColuna] = valores;
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

app.listen(3001, () => {
  console.log("✅ Servidor rodando em http://localhost:3001");
});
