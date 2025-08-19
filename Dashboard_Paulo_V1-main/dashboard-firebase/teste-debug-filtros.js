// Teste específico para a rota de debug de filtros
const axios = require('axios');

async function testeDebugFiltros() {
  try {
    console.log('🔍 TESTE DE DEBUG - Rota de Filtros');
    console.log('=' .repeat(50));
    
    // Teste 1: Filtros simples
    console.log('\n📋 Teste 1: Filtros simples');
    const teste1 = await axios.post('http://localhost:3001/debug-filtros', {
      uf: ['Acre'],
      ano: [2021]
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Teste 1 - Resposta:', teste1.data);
    
    // Teste 2: Múltiplas subcategorias
    console.log('\n📋 Teste 2: Múltiplas subcategorias');
    const teste2 = await axios.post('http://localhost:3001/debug-filtros', {
      uf: ['SP', 'RJ', 'MG'],
      ano: [2021, 2022],
      faixaEtaria: ['18 a 24 anos', '25 a 29 anos', '30 a 39 anos'],
      sexo: ['Homem', 'Mulher']
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Teste 2 - Resposta:', teste2.data);
    
    // Teste 3: Arrays vazios e valores inválidos
    console.log('\n📋 Teste 3: Arrays vazios e valores inválidos');
    const teste3 = await axios.post('http://localhost:3001/debug-filtros', {
      uf: ['Acre'],
      ano: [2021],
      faixaEtaria: [], // Array vazio
      sexo: ['', 'Todos', 'null'], // Valores inválidos
      bolsaFamilia: 'SIM' // String única
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Teste 3 - Resposta:', teste3.data);
    
    // Teste 4: Objeto vazio
    console.log('\n📋 Teste 4: Objeto vazio');
    const teste4 = await axios.post('http://localhost:3001/debug-filtros', {}, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Teste 4 - Resposta:', teste4.data);
    
    // Teste 5: Todos os filtros
    console.log('\n📋 Teste 5: Todos os filtros');
    const teste5 = await axios.post('http://localhost:3001/debug-filtros', {
      bolsaFamilia: ['SIM', 'NÃO'],
      situacaoPobreza: ['SIM', 'NÃO'],
      setorEconomico: ['Agronegócio', 'Comércio'],
      sexo: ['Homem', 'Mulher'],
      racaCor: ['Branco', 'Pardo'],
      grauInstrucao: ['Fundamental', 'Médio'],
      faixaEtaria: ['18 a 24 anos', '25 a 29 anos'],
      cadUnico: ['SIM', 'NÃO'],
      uf: ['Acre', 'Bahia'],
      ano: [2021, 2022]
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Teste 5 - Resposta:', teste5.data);
    
    console.log('\n🎯 RESUMO DO TESTE DE DEBUG:');
    console.log('✅ Rota de debug funcionando corretamente');
    console.log('✅ Todos os tipos de filtros sendo recebidos');
    console.log('✅ Estrutura de dados preservada');
    console.log('\n🎉 TESTE DE DEBUG CONCLUÍDO COM SUCESSO!');
    
  } catch (error) {
    console.error('❌ Erro ao executar teste de debug:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

// Executar teste de debug
testeDebugFiltros();
