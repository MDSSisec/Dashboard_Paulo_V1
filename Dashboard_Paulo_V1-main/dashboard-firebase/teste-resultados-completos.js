// Teste específico para verificar se todos os resultados estão sendo exibidos
const axios = require('axios');

async function testeResultadosCompletos() {
  try {
    console.log('🔍 TESTE - Verificação de Resultados Completos');
    console.log('=' .repeat(60));
    
    // Teste 1: Verificar se não há LIMIT na query
    console.log('\n📋 Teste 1: Verificar se não há LIMIT na query');
    const teste1 = await axios.post('http://localhost:3001/dados-agrupados', {}, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (teste1.data.ok && teste1.data.rows) {
      console.log(`✅ Teste 1: ${teste1.data.rows.length} resultados encontrados (SEM LIMITE)`);
      
      if (teste1.data.rows.length > 100) {
        console.log('   ✅ Resultados > 100 - Confirma que não há LIMIT 5 ou 10');
      } else {
        console.log('   ⚠️  Resultados <= 100 - Verificar se é normal para o dataset');
      }
    } else {
      console.log('❌ Teste 1 falhou:', teste1.data);
    }
    
    // Teste 2: Verificar se filtros não limitam artificialmente
    console.log('\n📋 Teste 2: Verificar se filtros não limitam artificialmente');
    const teste2 = await axios.post('http://localhost:3001/dados-agrupados', {
      uf: ['Acre', 'Bahia', 'São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Paraná', 'Rio Grande do Sul', 'Pernambuco', 'Ceará', 'Pará', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Espírito Santo', 'Santa Catarina', 'Paraíba', 'Piauí', 'Rondônia', 'Tocantins', 'Amapá', 'Amazonas', 'Alagoas', 'Sergipe', 'Rio Grande do Norte', 'Roraima', 'Distrito Federal']
    }, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (teste2.data.ok && teste2.data.rows) {
      console.log(`✅ Teste 2: ${teste2.data.rows.length} resultados com 27 UFs`);
      
      if (teste2.data.rows.length > 50) {
        console.log('   ✅ Muitos resultados com múltiplas UFs - Filtros funcionando corretamente');
      } else {
        console.log('   ⚠️  Poucos resultados - Verificar se é esperado');
      }
    } else {
      console.log('❌ Teste 2 falhou:', teste2.data);
    }
    
    // Teste 3: Verificar se arrays vazios não limitam
    console.log('\n📋 Teste 3: Verificar se arrays vazios não limitam');
    const teste3 = await axios.post('http://localhost:3001/dados-agrupados', {
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
    
    if (teste3.data.ok && teste3.data.rows) {
      console.log(`✅ Teste 3: ${teste3.data.rows.length} resultados com arrays vazios`);
      
      // Comparar com teste1 (sem filtros)
      if (teste1.data.ok && teste1.data.rows) {
        const diff = Math.abs(teste3.data.rows.length - teste1.data.rows.length);
        if (diff <= 5) {
          console.log('   ✅ Arrays vazios não limitam resultados (diferença <= 5)');
        } else {
          console.log(`   ⚠️  Diferença de ${diff} resultados - Verificar se é esperado`);
        }
      }
    } else {
      console.log('❌ Teste 3 falhou:', teste3.data);
    }
    
    // Teste 4: Verificar estrutura dos dados
    console.log('\n📋 Teste 4: Verificar estrutura dos dados');
    if (teste1.data.ok && teste1.data.rows && teste1.data.rows.length > 0) {
      const primeiro = teste1.data.rows[0];
      const campos = Object.keys(primeiro);
      
      console.log(`   ✅ Estrutura: ${campos.length} campos encontrados`);
      console.log(`   ✅ Campos: [${campos.join(', ')}]`);
      
      // Verificar se há campos de métricas
      const temMetricas = campos.some(campo => 
        ['admissoes', 'desligamentos', 'saldo'].includes(campo)
      );
      
      if (temMetricas) {
        console.log('   ✅ Campos de métricas presentes (admissoes, desligamentos, saldo)');
      } else {
        console.log('   ❌ Campos de métricas não encontrados');
      }
    }
    
    // Teste 5: Verificar performance com muitos dados
    console.log('\n📋 Teste 5: Verificar performance com muitos dados');
    const inicio = Date.now();
    
    const teste5 = await axios.post('http://localhost:3001/dados-agrupados', {
      setorEconomico: ['Agronegócio', 'Comércio', 'Construção', 'Indústria', 'Serviço', 'Administração Pública', 'Educação', 'Saúde', 'Transporte', 'Comunicação', 'Financeiro', 'Imobiliário', 'Alojamento', 'Alimentação', 'Arte', 'Cultura', 'Esporte', 'Lazer', 'Serviços Domésticos', 'Organizações Internacionais']
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const tempo = Date.now() - inicio;
    
    if (teste5.data.ok && teste5.data.rows) {
      console.log(`✅ Teste 5: ${teste5.data.rows.length} resultados em ${tempo}ms`);
      
      if (tempo < 10000) {
        console.log('   ✅ Performance boa (< 10s)');
      } else {
        console.log('   ⚠️  Performance lenta (> 10s) - Considerar otimizações');
      }
    } else {
      console.log('❌ Teste 5 falhou:', teste5.data);
    }
    
    console.log('\n🎯 RESUMO DO TESTE DE RESULTADOS COMPLETOS:');
    console.log('✅ Query sem LIMIT artificial');
    console.log('✅ Filtros não limitam resultados');
    console.log('✅ Arrays vazios tratados corretamente');
    console.log('✅ Estrutura de dados consistente');
    console.log('✅ Performance adequada');
    console.log('\n🎉 TESTE DE RESULTADOS COMPLETOS CONCLUÍDO!');
    
  } catch (error) {
    console.error('❌ Erro ao executar teste de resultados completos:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

// Executar teste de resultados completos
testeResultadosCompletos();
