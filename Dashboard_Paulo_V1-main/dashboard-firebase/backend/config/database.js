const { Pool } = require("pg");

// 🔌 Configuração do PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "meu_banco_1",
  password: "@dM1n090710",
  port: 5432,
});

module.exports = pool;
