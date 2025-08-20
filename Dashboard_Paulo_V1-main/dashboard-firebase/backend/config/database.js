const { Pool } = require("pg");

// 🔌 Configuração do PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "meu_banco_1",
  password: "Infra2022@#",
  port: 5432,
});

module.exports = pool;
