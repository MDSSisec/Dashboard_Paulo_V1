#!/bin/bash

echo "🧪 Testando subcategorias com curl..."

# Teste 1: Múltiplas faixas etárias
echo -e "\n📋 Teste 1: Múltiplas faixas etárias"
curl -X POST http://localhost:3001/dados-agrupados \
  -H 'Content-Type: application/json' \
  -d '{
    "faixaEtaria": ["18 a 24 anos", "25 a 29 anos", "30 a 39 anos"]
  }' | jq '.rows | length'

# Teste 2: Múltiplas subcategorias em múltiplas categorias
echo -e "\n📋 Teste 2: Múltiplas subcategorias em múltiplas categorias"
curl -X POST http://localhost:3001/dados-agrupados \
  -H 'Content-Type: application/json' \
  -d '{
    "uf": ["Acre", "Bahia", "São Paulo"],
    "ano": [2021, 2022],
    "sexo": ["Homem", "Mulher"],
    "faixaEtaria": ["18 a 24 anos", "25 a 29 anos"]
  }' | jq '.rows | length'

# Teste 3: Muitas subcategorias
echo -e "\n📋 Teste 3: Muitas subcategorias"
curl -X POST http://localhost:3001/dados-agrupados \
  -H 'Content-Type: application/json' \
  -d '{
    "uf": ["Acre", "Bahia", "São Paulo", "Rio de Janeiro", "Minas Gerais", "Paraná", "Rio Grande do Sul", "Pernambuco", "Ceará", "Pará"],
    "setorEconomico": ["Agronegócio", "Comércio", "Construção", "Indústria", "Serviço"],
    "racaCor": ["Branco", "Pardo", "Preto", "Amarelo", "Indígena"]
  }' | jq '.rows | length'

# Teste 4: Subcategorias inexistentes
echo -e "\n📋 Teste 4: Subcategorias inexistentes"
curl -X POST http://localhost:3001/dados-agrupados \
  -H 'Content-Type: application/json' \
  -d '{
    "uf": ["INEXISTENTE"],
    "faixaEtaria": ["999 anos"]
  }' | jq '.rows | length'

# Teste 5: Sem filtros
echo -e "\n📋 Teste 5: Sem filtros"
curl -X POST http://localhost:3001/dados-agrupados \
  -H 'Content-Type: application/json' \
  -d '{}' | jq '.rows | length'

echo -e "\n✅ Testes concluídos!"
