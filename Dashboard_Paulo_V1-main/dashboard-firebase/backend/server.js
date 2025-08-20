const express = require("express");
const cors = require("cors");
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/', dashboardRoutes);

// Rota de teste para verificar se o servidor está funcionando
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Servidor funcionando corretamente",
    timestamp: new Date().toISOString()
  });
});

app.listen(3001, () => {
  console.log("✅ Servidor rodando em http://localhost:3001");
  console.log("📊 Endpoints disponíveis:");
  console.log("  - POST /dados-agrupados - Buscar dados com filtros");
  console.log("  - GET  /dados - Buscar dados iniciais");
  console.log("  - GET  /health - Verificar status do servidor");
});
