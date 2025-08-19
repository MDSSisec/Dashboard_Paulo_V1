// Teste completo para verificar todos os filtros funcionando
const axios = require('axios');

async function testeFiltrosCompletos() {
  try {
    console.log('🔍 TESTE COMPLETO - Verificação de Todos os Filtros');
    console.log('=' .repeat(70));
    
    // Teste 1: Verificar rota de debug
    console.log('\n📋 Teste 1: Verificar rota de debug');
    const debugPayload = {
      uf: ['SP', 'RJ', 'MG', 'BA', 'CE'],
      ano: [2021, 2022, 2023],
      faixaEtaria: ['18 a 24 anos', '25 a 29 anos', '30 a 39 anos'],
      sexo: ['Homem', 'Mulher'],
      racaCor: ['Branco', 'Pardo', 'Preto'],
      setorEconomico: ['Serviço', 'Comércio', 'Indústria'],
      bolsaFamilia: ['SIM', 'NÃO'],
      situacaoPobreza: ['SIM', 'NÃO'],
      grauInstrucao: ['Fundamental', 'Médio', 'Superior'],
      cadUnico: ['SIM', 'NÃO']
    };
    
    const debugTest = await axios.post('http://localhost:3001/debug-filtros', debugPayload, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (debugTest.data.ok) {
      console.log('✅ Rota de debug funcionando');
      console.log('   Diagnóstico:', debugTest.data.diag);
    } else {
      console.log('❌ Rota de debug falhou');
    }
    
    // Teste 2: Verificar filtros incrementais
    console.log('\n📋 Teste 2: Verificar filtros incrementais');
    
    const testes = [
      {
        nome: 'Sem filtros',
        payload: {}
      },
      {
        nome: 'Apenas UF',
        payload: { uf: ['SP', 'RJ'] }
      },
      {
        nome: 'UF + Ano',
        payload: { uf: ['SP', 'RJ'], ano: [2021, 2022] }
      },
      {
        nome: 'UF + Ano + Faixa Etária',
        payload: { 
          uf: ['SP', 'RJ'], 
          ano: [2021, 2022], 
          faixaEtaria: ['18 a 24 anos', '25 a 29 anos'] 
        }
      },
      {
        nome: 'UF + Ano + Faixa + Sexo',
        payload: { 
          uf: ['SP', 'RJ'], 
          ano: [2021, 2022], 
          faixaEtaria: ['18 a 24 anos', '25 a 29 anos'],
          sexo: ['Homem', 'Mulher']
        }
      },
      {
        nome: 'UF + Ano + Faixa + Sexo + Raça',
        payload: { 
          uf: ['SP', 'RJ'], 
          ano: [2021, 2022], 
          faixaEtaria: ['18 a 24 anos', '25 a 29 anos'],
          sexo: ['Homem', 'Mulher'],
          racaCor: ['Branco', 'Pardo']
        }
      },
      {
        nome: 'UF + Ano + Faixa + Sexo + Raça + Setor',
        payload: { 
          uf: ['SP', 'RJ'], 
          ano: [2021, 2022], 
          faixaEtaria: ['18 a 24 anos', '25 a 29 anos'],
          sexo: ['Homem', 'Mulher'],
          racaCor: ['Branco', 'Pardo'],
          setorEconomico: ['Serviço', 'Comércio']
        }
      },
      {
        nome: 'Todos os filtros',
        payload: debugPayload
      }
    ];
    
    const resultados = [];
    
    for (const teste of testes) {
      try {
        const inicio = Date.now();
        const response = await axios.post('http://localhost:3001/dados-agrupados', teste.payload, {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        const tempo = Date.now() - inicio;
        
        if (response.data.ok) {
          const count = response.data.rows.length;
          resultados.push({
            nome: teste.nome,
            count,
            tempo,
            sucesso: true
          });
          
          console.log(`✅ ${teste.nome}: ${count} resultados em ${tempo}ms`);
          
          // Verificar se o resultado faz sentido
          if (count === 0 && teste.nome !== 'Sem filtros') {
            console.log(`   ⚠️  Resultado zero - verificar se é esperado`);
          }
          
        } else {
          resultados.push({
            nome: teste.nome,
            count: 0,
            tempo: 0,
            sucesso: false,
            erro: response.data.error
          });
          console.log(`❌ ${teste.nome}: Erro - ${response.data.error}`);
        }
        
      } catch (error) {
        resultados.push({
          nome: teste.nome,
          count: 0,
          tempo: 0,
          sucesso: false,
          erro: error.message
        });
        console.log(`❌ ${teste.nome}: Erro - ${error.message}`);
      }
    }
    
    // Teste 3: Verificar arrays vazios
    console.log('\n📋 Teste 3: Verificar arrays vazios');
    const testeArraysVazios = await axios.post('http://localhost:3001/dados-agrupados', {
      uf: [],
      ano: [],
      faixaEtaria: [],
      sexo: [],
      racaCor: [],
      setorEconomico: [],
      bolsaFamilia: [],
      situacaoPobreza: [],
      grauInstrucao: [],
      cadUnico: []
    }, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (testeArraysVazios.data.ok) {
      console.log(`✅ Arrays vazios: ${testeArraysVazios.data.rows.length} resultados`);
    } else {
      console.log(`❌ Arrays vazios: Erro - ${testeArraysVazios.data.error}`);
    }
    
    // Teste 4: Verificar performance com muitos dados
    console.log('\n📋 Teste 4: Verificar performance com muitos dados');
    const inicioPerformance = Date.now();
    
    const testePerformance = await axios.post('http://localhost:3001/dados-agrupados', {
      uf: ['SP', 'RJ', 'MG', 'BA', 'CE', 'PR', 'RS', 'SC', 'GO', 'MT'],
      ano: [2021, 2022, 2023, 2024],
      faixaEtaria: ['18 a 24 anos', '25 a 29 anos', '30 a 39 anos', '40 a 49 anos'],
      sexo: ['Homem', 'Mulher'],
      racaCor: ['Branco', 'Pardo', 'Preto', 'Amarelo', 'Indígena'],
      setorEconomico: ['Serviço', 'Comércio', 'Indústria', 'Construção', 'Agronegócio']
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const tempoPerformance = Date.now() - inicioPerformance;
    
    if (testePerformance.data.ok) {
      console.log(`✅ Performance: ${testePerformance.data.rows.length} resultados em ${tempoPerformance}ms`);
      
      if (tempoPerformance < 10000) {
        console.log('   ✅ Performance boa (< 10s)');
      } else if (tempoPerformance < 30000) {
        console.log('   ⚠️  Performance aceitável (10-30s)');
      } else {
        console.log('   ❌ Performance lenta (> 30s)');
      }
    } else {
      console.log(`❌ Performance: Erro - ${testePerformance.data.error}`);
    }
    
    // Resumo final
    console.log('\n🎯 RESUMO DO TESTE COMPLETO:');
    console.log('=' .repeat(50));
    
    const sucessos = resultados.filter(r => r.sucesso).length;
    const total = resultados.length;
    
    console.log(`✅ Testes bem-sucedidos: ${sucessos}/${total}`);
    console.log(`✅ Rota de debug: ${debugTest.data.ok ? 'FUNCIONANDO' : 'FALHOU'}`);
    console.log(`✅ Arrays vazios: ${testeArraysVazios.data.ok ? 'FUNCIONANDO' : 'FALHOU'}`);
    console.log(`✅ Performance: ${tempoPerformance < 10000 ? 'BOA' : tempoPerformance < 30000 ? 'ACEITÁVEL' : 'LENTA'}`);
    
    console.log('\n📊 Detalhes dos testes incrementais:');
    resultados.forEach(r => {
      const status = r.sucesso ? '✅' : '❌';
      const info = r.sucesso ? `${r.count} resultados em ${r.tempo}ms` : r.erro;
      console.log(`   ${status} ${r.nome}: ${info}`);
    });
    
    console.log('\n🎉 TESTE COMPLETO CONCLUÍDO!');
    
  } catch (error) {
    console.error('❌ Erro ao executar teste completo:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

// Executar teste completo
testeFiltrosCompletos();
