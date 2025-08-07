const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Conexão com PostgreSQL local
const pool = new Pool({
  user: "postgres",       // ✅ ALTERA aqui
  host: "localhost",
  database: "meu_banco",  // ✅ ALTERA aqui
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
    
    Object.keys(filtros).forEach(campo => {
      if (filtros[campo] && filtros[campo] !== 'Todos') {
        const valores = filtros[campo].split(',');
        const nomeColuna = mapeamentoColunas[campo] || campo;
        
        // Tratamento especial para CadÚnico
        if (campo === 'cadUnico') {
          console.log(`CadÚnico - valores recebidos:`, valores);
          // Converter "NÃO" para "NAO" se necessário
          const valoresAjustados = valores.map(v => v === "NÃO" ? "NAO" : v);
          console.log(`CadÚnico - valores ajustados:`, valoresAjustados);
          
          if (valoresAjustados.length === 1) {
            whereClause += ` AND "${nomeColuna}" = $${paramIndex}`;
            params.push(valoresAjustados[0]);
            paramIndex++;
          } else {
            const placeholders = valoresAjustados.map(() => `$${paramIndex++}`).join(',');
            whereClause += ` AND "${nomeColuna}" IN (${placeholders})`;
            params.push(...valoresAjustados);
          }
        } else {
          if (valores.length === 1) {
            // Filtro único
            whereClause += ` AND "${nomeColuna}" = $${paramIndex}`;
            params.push(valores[0]);
            paramIndex++;
          } else {
            // Múltiplos valores (IN)
            const placeholders = valores.map(() => `$${paramIndex++}`).join(',');
            whereClause += ` AND "${nomeColuna}" IN (${placeholders})`;
            params.push(...valores);
          }
        }
      }
    });
    
    // Determinar campos para GROUP BY baseado nos filtros ativos
    const camposBase = ['"UF"', '"Ano"'];
    let camposFiltros = [];
    
    if (filtrosAtivos.length > 0) {
      camposFiltros = filtrosAtivos.map(campo => `"${mapeamentoColunas[campo] || campo}"`);
    }
    
    const camposAgrupamento = [...camposBase, ...camposFiltros];
    const camposSelect = camposAgrupamento.join(', ');
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
    
    Object.keys(filtros).forEach(campo => {
      if (filtros[campo] && filtros[campo] !== 'Todos') {
        const valores = filtros[campo].split(',');
        const nomeColuna = mapeamentoColunas[campo] || campo;
        
        // Tratamento especial para CadÚnico
        if (campo === 'cadUnico') {
          console.log(`CadÚnico - valores recebidos:`, valores);
          // Converter "NÃO" para "NAO" se necessário
          const valoresAjustados = valores.map(v => v === "NÃO" ? "NAO" : v);
          console.log(`CadÚnico - valores ajustados:`, valoresAjustados);
          
          if (valoresAjustados.length === 1) {
            whereClause += ` AND "${nomeColuna}" = $${paramIndex}`;
            params.push(valoresAjustados[0]);
            paramIndex++;
          } else {
            const placeholders = valoresAjustados.map(() => `$${paramIndex++}`).join(',');
            whereClause += ` AND "${nomeColuna}" IN (${placeholders})`;
            params.push(...valoresAjustados);
          }
        } else {
          if (valores.length === 1) {
            // Filtro único
            whereClause += ` AND "${nomeColuna}" = $${paramIndex}`;
            params.push(valores[0]);
            paramIndex++;
          } else {
            // Múltiplos valores (IN)
            const placeholders = valores.map(() => `$${paramIndex++}`).join(',');
            whereClause += ` AND "${nomeColuna}" IN (${placeholders})`;
            params.push(...valores);
          }
        }
      }
    });
    
    // Determinar campos para GROUP BY baseado nos filtros ativos
    const camposBase = ['"UF"', '"Ano"'];
    let camposFiltros = [];
    
    if (filtrosAtivos.length > 0) {
      camposFiltros = filtrosAtivos.map(campo => `"${mapeamentoColunas[campo] || campo}"`);
    }
    
    const camposAgrupamento = [...camposBase, ...camposFiltros];
    const camposSelect = camposAgrupamento.join(', ');
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
      LIMIT 5
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
      WHERE "CadÚnico" = 'SIM'
      GROUP BY "UF", "Ano", "CadÚnico"
      ORDER BY "UF", "Ano"
      LIMIT 5
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

app.listen(3001, () => {
  console.log("✅ Servidor rodando em http://localhost:3001");
});
