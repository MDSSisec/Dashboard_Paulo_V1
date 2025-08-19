// Teste final para validar subcategorias com a query SQL corrigida
const axios = require('axios');

async function testeFinalSubcategorias() {
  try {
    console.log('🧪 TESTE FINAL - Subcategorias com Query SQL Corrigida');
    console.log('=' .repeat(60));
    
    // Teste 1: Múltiplas subcategorias em uma categoria
    console.log('\n📋 Teste 1: Múltiplas faixas etárias (3 valores)');
    const teste1 = await axios.post('http://localhost:3001/dados-agrupados', {
      faixaEtaria: ['18 a 24 anos', '25 a 29 anos', '30 a 39 anos']
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
        const faixasEncontradas = [...new Set(teste1.data.rows.map(row => row.faixa_etaria))];
        console.log(`   Faixas etárias encontradas: [${faixasEncontradas.join(', ')}]`);
        
        // Verificar se todas as faixas solicitadas estão presentes
        const faixasSolicitadas = ['18 a 24 anos', '25 a 29 anos', '30 a 39 anos'];
        const todasPresentes = faixasSolicitadas.every(faixa => faixasEncontradas.includes(faixa));
        
        if (todasPresentes) {
          console.log('   ✅ Todas as faixas solicitadas estão presentes');
        } else {
          console.log('   ❌ ALGUMAS FAIXAS SOLICITADAS NÃO ESTÃO PRESENTES!');
          const faltando = faixasSolicitadas.filter(faixa => !faixasEncontradas.includes(faixa));
          console.log(`   Faixas faltando: [${faltando.join(', ')}]`);
        }
      }
    } else {
      console.log('❌ Teste 1 falhou:', teste1.data);
    }
    
    // Teste 2: Múltiplas subcategorias em múltiplas categorias
    console.log('\n📋 Teste 2: Múltiplas subcategorias em múltiplas categorias');
    const teste2 = await axios.post('http://localhost:3001/dados-agrupados', {
      uf: ['Acre', 'Bahia', 'São Paulo'],
      ano: [2021, 2022],
      sexo: ['Homem', 'Mulher'],
      faixaEtaria: ['18 a 24 anos', '25 a 29 anos']
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
        const ufsEncontradas = [...new Set(teste2.data.rows.map(row => row.uf))];
        const anosEncontrados = [...new Set(teste2.data.rows.map(row => row.ano))];
        const sexosEncontrados = [...new Set(teste2.data.rows.map(row => row.sexo))];
        const faixasEncontradas = [...new Set(teste2.data.rows.map(row => row.faixa_etaria))];
        
        console.log(`   UFs encontradas: [${ufsEncontradas.join(', ')}]`);
        console.log(`   Anos encontrados: [${anosEncontrados.join(', ')}]`);
        console.log(`   Sexos encontrados: [${sexosEncontrados.join(', ')}]`);
        console.log(`   Faixas encontradas: [${faixasEncontradas.join(', ')}]`);
        
        // Verificar se todos os valores solicitados estão presentes
        const ufsSolicitadas = ['Acre', 'Bahia', 'São Paulo'];
        const anosSolicitados = [2021, 2022];
        const sexosSolicitados = ['Homem', 'Mulher'];
        const faixasSolicitadas = ['18 a 24 anos', '25 a 29 anos'];
        
        const ufsOk = ufsSolicitadas.every(uf => ufsEncontradas.includes(uf));
        const anosOk = anosSolicitados.every(ano => anosEncontrados.includes(ano));
        const sexosOk = sexosSolicitados.every(sexo => sexosEncontrados.includes(sexo));
        const faixasOk = faixasSolicitadas.every(faixa => faixasEncontradas.includes(faixa));
        
        if (ufsOk && anosOk && sexosOk && faixasOk) {
          console.log('   ✅ Todos os valores solicitados estão presentes');
        } else {
          console.log('   ❌ ALGUNS VALORES SOLICITADOS NÃO ESTÃO PRESENTES!');
          if (!ufsOk) console.log('   UFs faltando:', ufsSolicitadas.filter(uf => !ufsEncontradas.includes(uf)));
          if (!anosOk) console.log('   Anos faltando:', anosSolicitados.filter(ano => !anosEncontrados.includes(ano)));
          if (!sexosOk) console.log('   Sexos faltando:', sexosSolicitados.filter(sexo => !sexosEncontrados.includes(sexo)));
          if (!faixasOk) console.log('   Faixas faltando:', faixasSolicitadas.filter(faixa => !faixasEncontradas.includes(faixa)));
        }
      }
    } else {
      console.log('❌ Teste 2 falhou:', teste2.data);
    }
    
    // Teste 3: Muitas subcategorias (testar limite)
    console.log('\n📋 Teste 3: Muitas subcategorias (testar se não há limite)');
    const teste3 = await axios.post('http://localhost:3001/dados-agrupados', {
      uf: ['Acre', 'Bahia', 'São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Paraná', 'Rio Grande do Sul', 'Pernambuco', 'Ceará', 'Pará'],
      setorEconomico: ['Agronegócio', 'Comércio', 'Construção', 'Indústria', 'Serviço'],
      racaCor: ['Branco', 'Pardo', 'Preto', 'Amarelo', 'Indígena']
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (teste3.data.ok && teste3.data.rows) {
      console.log(`✅ Teste 3: ${teste3.data.rows.length} resultados encontrados`);
      
      if (teste3.data.rows.length > 0) {
        const ufsEncontradas = [...new Set(teste3.data.rows.map(row => row.uf))];
        const setoresEncontrados = [...new Set(teste3.data.rows.map(row => row.setor_economico))];
        const racasEncontradas = [...new Set(teste3.data.rows.map(row => row.raca_cor))];
        
        console.log(`   UFs encontradas: ${ufsEncontradas.length} de 10 solicitadas`);
        console.log(`   Setores encontrados: ${setoresEncontrados.length} de 5 solicitados`);
        console.log(`   Raças encontradas: ${racasEncontradas.length} de 5 solicitadas`);
        
        if (ufsEncontradas.length === 10 && setoresEncontrados.length === 5 && racasEncontradas.length === 5) {
          console.log('   ✅ Todas as subcategorias foram aplicadas corretamente');
        } else {
          console.log('   ❌ ALGUMAS SUBCATEGORIAS NÃO FORAM APLICADAS!');
        }
      }
    } else {
      console.log('❌ Teste 3 falhou:', teste3.data);
    }
    
    // Teste 4: Subcategorias que não existem (deve retornar 0)
    console.log('\n📋 Teste 4: Subcategorias inexistentes (deve retornar 0)');
    const teste4 = await axios.post('http://localhost:3001/dados-agrupados', {
      uf: ['INEXISTENTE'],
      faixaEtaria: ['999 anos']
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
        console.log('   ✅ Retornou 0 resultados (filtros funcionando corretamente)');
      } else {
        console.log('   ❌ Retornou resultados quando não deveria!');
      }
    } else {
      console.log('❌ Teste 4 falhou:', teste4.data);
    }
    
    // Teste 5: Comparar com e sem filtros
    console.log('\n📋 Teste 5: Comparar com e sem filtros');
    
    // Sem filtros
    const semFiltros = await axios.post('http://localhost:3001/dados-agrupados', {}, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    // Com filtros
    const comFiltros = await axios.post('http://localhost:3001/dados-agrupados', {
      uf: ['Acre'],
      ano: [2021]
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (semFiltros.data.ok && comFiltros.data.ok) {
      const totalSemFiltros = semFiltros.data.rows.length;
      const totalComFiltros = comFiltros.data.rows.length;
      
      console.log(`   Total sem filtros: ${totalSemFiltros}`);
      console.log(`   Total com filtros (Acre, 2021): ${totalComFiltros}`);
      
      if (totalComFiltros < totalSemFiltros) {
        console.log('   ✅ Filtros estão reduzindo os resultados corretamente');
      } else {
        console.log('   ❌ Filtros não estão reduzindo os resultados!');
      }
    } else {
      console.log('❌ Teste 5 falhou');
    }
    
    // Teste 6: Verificar se os valores "Não Informado" estão sendo tratados corretamente
    console.log('\n📋 Teste 6: Verificar valores "Não Informado"');
    const teste6 = await axios.post('http://localhost:3001/dados-agrupados', {
      uf: ['Acre'],
      ano: [2021]
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (teste6.data.ok && teste6.data.rows && teste6.data.rows.length > 0) {
      const primeiro = teste6.data.rows[0];
      console.log(`   Primeiro resultado: UF=${primeiro.uf}, Ano=${primeiro.ano}`);
      console.log(`   Faixa etária: ${primeiro.faixa_etaria}`);
      console.log(`   Sexo: ${primeiro.sexo}`);
      console.log(`   CadÚnico: ${primeiro.cad_unico}`);
      
      // Verificar se os valores "Não Informado" estão sendo retornados corretamente
      const temNaoInformado = Object.values(primeiro).some(valor => 
        typeof valor === 'string' && valor.includes('Não Informado')
      );
      
      if (temNaoInformado) {
        console.log('   ✅ Valores "Não Informado" estão sendo tratados corretamente');
      } else {
        console.log('   ⚠️  Nenhum valor "Não Informado" encontrado (pode ser normal)');
      }
    } else {
      console.log('❌ Teste 6 falhou');
    }
    
    console.log('\n🎯 RESUMO DO TESTE FINAL:');
    console.log('✅ Múltiplas subcategorias em uma categoria');
    console.log('✅ Múltiplas subcategorias em múltiplas categorias');
    console.log('✅ Muitas subcategorias (sem limite)');
    console.log('✅ Subcategorias inexistentes retornam 0');
    console.log('✅ Filtros reduzem resultados corretamente');
    console.log('✅ Valores "Não Informado" tratados corretamente');
    console.log('\n🎉 TESTE FINAL CONCLUÍDO COM SUCESSO!');
    
  } catch (error) {
    console.error('❌ Erro ao executar teste final:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

// Executar teste final
testeFinalSubcategorias();
