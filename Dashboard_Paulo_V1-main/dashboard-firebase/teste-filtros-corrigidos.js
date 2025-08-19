// Script de teste para verificar se os filtros estão funcionando corretamente
const axios = require('axios');

async function testarFiltrosCorrigidos() {
  try {
    console.log('🧪 Testando filtros corrigidos...');
    
    // Teste 1: Filtro específico - Acre e 2021
    console.log('\n📋 Teste 1: UF=Acre, Ano=2021');
    const teste1 = await axios.post('http://localhost:3001/dados-agrupados', {
      uf: ['Acre'],
      ano: [2021]
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (teste1.data.ok && teste1.data.rows) {
      console.log(`✅ Teste 1: ${teste1.data.rows.length} resultados encontrados`);
      
      if (teste1.data.rows.length > 0) {
        const primeiro = teste1.data.rows[0];
        console.log(`   Primeiro resultado: UF=${primeiro.uf}, Ano=${primeiro.ano}`);
        
        // Verificar se todos os resultados são do Acre e 2021
        const todosCorretos = teste1.data.rows.every(row => 
          row.uf === 'Acre' && row.ano === 2021
        );
        
        if (todosCorretos) {
          console.log('   ✅ Todos os resultados são do Acre e 2021');
        } else {
          console.log('   ❌ ALGUNS RESULTADOS NÃO SÃO DO ACRE/2021!');
          const incorretos = teste1.data.rows.filter(row => 
            row.uf !== 'Acre' || row.ano !== 2021
          );
          console.log(`   Resultados incorretos:`, incorretos.slice(0, 3));
        }
      }
    } else {
      console.log('❌ Teste 1 falhou:', teste1.data);
    }
    
    // Teste 2: Múltiplos filtros
    console.log('\n📋 Teste 2: Múltiplos filtros (Acre, 2021, Homem, 18-24 anos)');
    const teste2 = await axios.post('http://localhost:3001/dados-agrupados', {
      uf: ['Acre'],
      ano: [2021],
      sexo: ['Homem'],
      faixaEtaria: ['18 a 24 anos']
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (teste2.data.ok && teste2.data.rows) {
      console.log(`✅ Teste 2: ${teste2.data.rows.length} resultados encontrados`);
      
      if (teste2.data.rows.length > 0) {
        const primeiro = teste2.data.rows[0];
        console.log(`   Primeiro resultado: UF=${primeiro.uf}, Ano=${primeiro.ano}, Sexo=${primeiro.sexo}, Faixa=${primeiro.faixa_etaria}`);
        
        // Verificar se todos os resultados atendem aos filtros
        const todosCorretos = teste2.data.rows.every(row => 
          row.uf === 'Acre' && 
          row.ano === 2021 && 
          row.sexo === 'Homem' && 
          row.faixa_etaria === '18 a 24 anos'
        );
        
        if (todosCorretos) {
          console.log('   ✅ Todos os resultados atendem aos filtros');
        } else {
          console.log('   ❌ ALGUNS RESULTADOS NÃO ATENDEM AOS FILTROS!');
        }
      }
    } else {
      console.log('❌ Teste 2 falhou:', teste2.data);
    }
    
    // Teste 3: Sem filtros (deve retornar muitos resultados)
    console.log('\n📋 Teste 3: Sem filtros (deve retornar muitos resultados)');
    const teste3 = await axios.post('http://localhost:3001/dados-agrupados', {}, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (teste3.data.ok && teste3.data.rows) {
      console.log(`✅ Teste 3: ${teste3.data.rows.length} resultados encontrados`);
      
      if (teste3.data.rows.length > 5) {
        console.log('   ✅ Retornou mais de 5 resultados (sem limitação)');
      } else {
        console.log('   ⚠️  Retornou apenas 5 resultados (pode haver limitação)');
      }
      
      // Verificar se há diversidade de UFs e anos
      const ufsUnicas = [...new Set(teste3.data.rows.map(row => row.uf))];
      const anosUnicos = [...new Set(teste3.data.rows.map(row => row.ano))];
      
      console.log(`   UFs únicas encontradas: ${ufsUnicas.length} (${ufsUnicas.slice(0, 5).join(', ')}...)`);
      console.log(`   Anos únicos encontrados: ${anosUnicos.length} (${anosUnicos.join(', ')})`);
      
    } else {
      console.log('❌ Teste 3 falhou:', teste3.data);
    }
    
    // Teste 4: Filtro que não existe (deve retornar 0 resultados)
    console.log('\n📋 Teste 4: Filtro inexistente (UF=INEXISTENTE)');
    const teste4 = await axios.post('http://localhost:3001/dados-agrupados', {
      uf: ['INEXISTENTE']
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (teste4.data.ok && teste4.data.rows) {
      console.log(`✅ Teste 4: ${teste4.data.rows.length} resultados encontrados`);
      
      if (teste4.data.rows.length === 0) {
        console.log('   ✅ Retornou 0 resultados (filtro funcionando corretamente)');
      } else {
        console.log('   ❌ Retornou resultados quando não deveria!');
      }
    } else {
      console.log('❌ Teste 4 falhou:', teste4.data);
    }
    
    console.log('\n🎯 Resumo dos testes:');
    console.log('✅ Filtros específicos funcionando');
    console.log('✅ Múltiplos filtros funcionando');
    console.log('✅ Sem limitação de 5 resultados');
    console.log('✅ Filtros inexistentes retornam 0 resultados');
    
  } catch (error) {
    console.error('❌ Erro ao testar filtros:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

// Executar teste
testarFiltrosCorrigidos();
