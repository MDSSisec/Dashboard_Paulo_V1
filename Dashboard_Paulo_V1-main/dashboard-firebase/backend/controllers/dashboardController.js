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

module.exports = {
  getDadosAgrupados,
  getDadosIniciais
};
