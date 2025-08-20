const express = require('express');
const router = express.Router();
const { getDadosAgrupados, getDadosIniciais } = require('../controllers/dashboardController');

// 📌 Rota principal para buscar dados agrupados com filtros
router.post("/dados-agrupados", getDadosAgrupados);

// 📌 Rota para buscar dados iniciais (sem filtros)
router.get("/dados", getDadosIniciais);

module.exports = router;
