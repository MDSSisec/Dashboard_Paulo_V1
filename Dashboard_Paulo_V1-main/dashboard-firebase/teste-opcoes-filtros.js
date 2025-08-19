// Script de teste para verificar a rota de opções de filtros
const axios = require('axios');

async function testarOpcoesFiltros() {
  try {
    console.log('🧪 Testando rota de opções de filtros...');
    
    const response = await axios.get('http://localhost:3001/opcoes-filtros', {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log('✅ Rota funcionando corretamente!');
      console.log('📊 Opções encontradas:');
      
      const opcoes = response.data.opcoes;
      Object.entries(opcoes).forEach(([categoria, valores]) => {
        console.log(`\n🔍 ${categoria}:`);
        console.log(`   Total: ${valores.length} opções`);
        console.log(`   Valores: [${valores.slice(0, 10).join(', ')}${valores.length > 10 ? '...' : ''}]`);
        
        if (valores.length <= 5) {
          console.log(`   ⚠️  ATENÇÃO: Apenas ${valores.length} opções encontradas!`);
        } else {
          console.log(`   ✅ OK: ${valores.length} opções encontradas (mais que 5)`);
        }
      });
      
      console.log('\n🎯 Resumo:');
      const categoriasComPoucasOpcoes = Object.entries(opcoes)
        .filter(([_, valores]) => valores.length <= 5)
        .map(([categoria, valores]) => `${categoria} (${valores.length})`);
      
      const categoriasComMuitasOpcoes = Object.entries(opcoes)
        .filter(([_, valores]) => valores.length > 5)
        .map(([categoria, valores]) => `${categoria} (${valores.length})`);
      
      if (categoriasComPoucasOpcoes.length > 0) {
        console.log(`❌ Categorias com poucas opções: ${categoriasComPoucasOpcoes.join(', ')}`);
      }
      
      if (categoriasComMuitasOpcoes.length > 0) {
        console.log(`✅ Categorias com muitas opções: ${categoriasComMuitasOpcoes.join(', ')}`);
      }
      
    } else {
      console.log('❌ Resposta não indica sucesso:', response.data);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar rota:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

// Executar teste
testarOpcoesFiltros();
