const express = require('express');
const router = express.Router();
const { getDadosAgrupados, getDadosIniciais, getOpcoesFiltros } = require('../controllers/dashboardController');

// 📌 Rota principal para buscar dados agrupados com filtros
router.post("/dados-agrupados", getDadosAgrupados);

// 📌 Rota para buscar dados iniciais (sem filtros)
router.get("/dados", getDadosIniciais);

// 📌 Rota para buscar opções de filtros dinamicamente
router.get("/opcoes-filtros", getOpcoesFiltros);

module.exports = router;
