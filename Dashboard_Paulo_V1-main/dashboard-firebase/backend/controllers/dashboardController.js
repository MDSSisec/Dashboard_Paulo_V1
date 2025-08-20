const pool = require('../config/database');
const { buildMainQuery, buildInitialQuery } = require('../services/queryBuilder');

// 📊 Controller para buscar dados agrupados com filtros
const getDadosAgrupados = async (req, res) => {
  try {
    const filtros = req.body || {};
    console.log("📊 Filtros recebidos:", JSON.stringify(filtros, null, 2));
    
    const { sql, params } = buildMainQuery(filtros);
    
    console.log("📊 Executando query...");
    const { rows } = await pool.query(sql, params);
    
    console.log(`✅ Query executada: ${rows.length} registros`);
    console.log("📊 Primeiro registro:", rows[0]);
    
    res.json({ ok: true, rows });
    
  } catch (err) {
    console.error("❌ Erro ao buscar dados:", err);
    res.status(500).json({ ok: false, error: String(err) });
  }
};

// 📊 Controller para buscar dados iniciais
const getDadosIniciais = async (req, res) => {
  try {
    const sql = buildInitialQuery();
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erro ao buscar dados iniciais:", err);
    res.status(500).send("Erro ao buscar dados");
  }
};

// 📌 Buscar opções de filtros dinamicamente
const getOpcoesFiltros = async (req, res) => {
  try {
    console.log("🔍 Buscando opções de filtros do banco...");
    
    const opcoes = {};
    
    // Buscar UFs únicas
    const ufQuery = 'SELECT DISTINCT "UF" FROM planilha_dashboard WHERE "UF" IS NOT NULL AND "UF" != \'\' ORDER BY "UF"';
    const ufResult = await pool.query(ufQuery);
    opcoes.uf = ufResult.rows.map(row => row.UF);
    
    // Buscar anos únicos
    const anoQuery = 'SELECT DISTINCT "Ano" FROM planilha_dashboard WHERE "Ano" IS NOT NULL ORDER BY "Ano"';
    const anoResult = await pool.query(anoQuery);
    opcoes.ano = anoResult.rows.map(row => row.Ano.toString());
    
    // Buscar outras categorias
    const categorias = [
      { campo: 'bolsaFamilia', coluna: '"Bolsa Família"' },
      { campo: 'situacaoPobreza', coluna: '"Situação de Pobreza"' },
      { campo: 'setorEconomico', coluna: '"Setor Econômico"' },
      { campo: 'sexo', coluna: '"Sexo"' },
      { campo: 'racaCor', coluna: '"Raça/Cor"' },
      { campo: 'grauInstrucao', coluna: '"Grau de Instrução"' },
      { campo: 'faixaEtaria', coluna: '"Faixa Etária"' },
      { campo: 'cadUnico', coluna: '"CadÚnico"' }
    ];
    
    for (const categoria of categorias) {
      const query = `SELECT DISTINCT ${categoria.coluna} FROM planilha_dashboard WHERE ${categoria.coluna} IS NOT NULL AND ${categoria.coluna} != '' ORDER BY ${categoria.coluna}`;
      const result = await pool.query(query);
      opcoes[categoria.campo] = result.rows.map(row => row[categoria.coluna.replace(/"/g, '')]);
    }
    
    console.log("✅ Opções de filtros carregadas:", Object.keys(opcoes));
    
    res.json({
      success: true,
      opcoes: opcoes
    });
  } catch (error) {
    console.error("❌ Erro ao buscar opções de filtros:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor ao buscar opções de filtros"
    });
  }
};

module.exports = {
  getDadosAgrupados,
  getDadosIniciais,
  getOpcoesFiltros
};
