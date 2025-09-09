const express = require("express");
const cors = require("cors");

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Rota de teste simples
app.get("/test", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor de teste funcionando!",
    timestamp: new Date().toISOString()
  });
});

// Rota de health
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor funcionando corretamente",
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor de teste rodando em http://localhost:${PORT}`);
  console.log("📊 Endpoints disponíveis:");
  console.log(`  - GET  /test - Teste simples`);
  console.log(`  - GET  /health - Verificar status`);
});

// Tratamento de erros
process.on('uncaughtException', (err) => {
  console.error('❌ Erro não capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada:', reason);
});
