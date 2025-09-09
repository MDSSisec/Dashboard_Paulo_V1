const pool = require('./config/database');

async function testDatabase() {
  try {
    console.log("🔌 Testando conexão com PostgreSQL...");
    
    // Testar conexão básica
    const client = await pool.connect();
    console.log("✅ Conexão estabelecida!");
    
    // Verificar se a tabela existe
    const tableQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'planilha_dashboard'
    `;
    
    const tableResult = await client.query(tableQuery);
    
    if (tableResult.rows.length === 0) {
      console.log("❌ Tabela 'planilha_dashboard' não encontrada!");
      console.log("📋 Tabelas disponíveis:");
      
      const allTablesQuery = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      
      const allTables = await client.query(allTablesQuery);
      allTables.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    } else {
      console.log("✅ Tabela 'planilha_dashboard' encontrada!");
      
      // Verificar quantos registros tem
      const countQuery = 'SELECT COUNT(*) as total FROM planilha_dashboard';
      const countResult = await client.query(countQuery);
      console.log(`📊 Total de registros: ${countResult.rows[0].total}`);
      
      // Verificar estrutura da tabela
      const columnsQuery = `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'planilha_dashboard'
        ORDER BY ordinal_position
      `;
      
      const columnsResult = await client.query(columnsQuery);
      console.log("📋 Colunas da tabela:");
      columnsResult.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type}`);
      });
      
      // Verificar alguns dados de exemplo
      const sampleQuery = 'SELECT * FROM planilha_dashboard LIMIT 3';
      const sampleResult = await client.query(sampleQuery);
      console.log("📄 Dados de exemplo:");
      console.log(JSON.stringify(sampleResult.rows, null, 2));
    }
    
    client.release();
    
  } catch (error) {
    console.error("❌ Erro:", error.message);
  } finally {
    await pool.end();
  }
}

testDatabase();
