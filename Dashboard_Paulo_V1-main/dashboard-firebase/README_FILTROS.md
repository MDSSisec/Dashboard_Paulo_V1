# 🎯 Sistema de Filtros - Dashboard

## 📋 Visão Geral

Este sistema implementa filtros dinâmicos para o dashboard, permitindo que quando uma categoria ou subcategoria seja selecionada, ela apareça filtrada no painel de dados.

## 🚀 Como Funciona

### 1. **Filtros Visuais**
- Quando um filtro é selecionado, ele fica destacado visualmente
- Indicadores visuais mostram quais filtros estão ativos
- Contador de filtros ativos é exibido
- Filtros ativos aparecem como colunas na tabela

### 2. **Backend SQL**
- Consultas SQL otimizadas com WHERE clauses dinâmicas
- Suporte a múltiplos filtros simultâneos
- Agrupamento automático por UF, Ano e filtros selecionados
- Tratamento especial para campos como CadÚnico

### 3. **Frontend React**
- Componentes de filtro com MultiSelect
- Atualização em tempo real dos dados
- Feedback visual para filtros ativos
- Debug info para desenvolvimento

## 🛠️ Como Testar

### 1. **Iniciar o Backend**
```bash
cd backend
npm install
node server.js
```

### 2. **Iniciar o Frontend**
```bash
npm install
npm run dev
```

### 3. **Testar Filtros Específicos**
Use os botões de teste no canto superior esquerdo:
- **Teste CadÚnico SIM**: Testa filtro por CadÚnico = SIM
- **Teste Setor Indústria**: Testa filtro por Setor Econômico = Indústria

### 4. **Testar via Script**
```bash
cd backend
node teste-filtros.js
node teste-opcoes.js
```

## 📊 Filtros Disponíveis

### **Bolsa Família**
- SIM
- NAO

### **Situação de Pobreza**
- SIM
- NAO

### **Setor Econômico**
- Agronegócio
- Comércio
- Construção
- Indústria
- Serviço

### **Sexo**
- Homem
- Mulher
- Não Identificado

### **Raça/Cor**
- Amarelo
- Branco
- Indígena
- Não Identificado
- Não Informado
- Pardo
- Preto

### **Grau de Instrução**
- 5º completo fundamental
- 6º a 9º fundamental
- Analfabeto
- Até 5º incompleto
- Doutorado
- Fundamental completo
- Médio completo
- Médio incompleto
- Mestrado
- Pós-graduação completa
- Superior completo
- Superior incompleto
- Não identificado

### **Faixa Etária**
- 18 a 24 anos
- 25 a 29 anos
- 30 a 39 anos
- 40 a 49 anos
- 50 a 59 anos
- 60 a 64 anos
- Acima de 65 anos
- Até 17 anos
- Data de nascimento nula
- Data de nascimento inválida

### **CadÚnico**
- SIM
- NÃO

### **UF (Estados)**
- Acre, Alagoas, Amapá, Amazonas, Bahia, Ceará, Distrito Federal, Espírito Santo, Goiás, Maranhão, Mato Grosso, Mato Grosso do Sul, Minas Gerais, Pará, Paraíba, Paraná, Pernambuco, Piauí, Rio de Janeiro, Rio Grande do Norte, Rio Grande do Sul, Rondônia, Roraima, Santa Catarina, São Paulo, Sergipe, Tocantins

### **Ano**
- 2021, 2022, 2023

## 🔧 Melhorias Implementadas

### 1. **Backend (server.js)**
- ✅ Consulta SQL otimizada com WHERE clauses dinâmicas
- ✅ Suporte a múltiplos filtros simultâneos
- ✅ Tratamento especial para CadÚnico (NÃO → NAO)
- ✅ Rotas de debug para desenvolvimento
- ✅ Logs detalhados para troubleshooting

### 2. **Frontend (Filtros.tsx)**
- ✅ Indicadores visuais para filtros ativos
- ✅ Contador de filtros ativos
- ✅ Destaque visual quando filtro está selecionado
- ✅ Feedback em tempo real

### 3. **Serviços (dataFetcher.ts)**
- ✅ Melhor tratamento de parâmetros de query
- ✅ Logs detalhados para debugging
- ✅ Conversão adequada de dados do PostgreSQL

### 4. **Constantes (categories.ts)**
- ✅ Todas as opções de filtro configuradas corretamente
- ✅ Valores exatos conforme especificação
- ✅ Tratamento correto de acentuação (NÃO vs NAO)

## 🐛 Troubleshooting

### Problema: Filtros não funcionam
1. Verifique se o backend está rodando na porta 3001
2. Verifique os logs do console do navegador
3. Use os botões de teste para verificar filtros específicos
4. Execute o script de teste: `node teste-filtros.js`
5. Execute o teste de opções: `node teste-opcoes.js`

### Problema: Dados não aparecem
1. Verifique a conexão com o PostgreSQL
2. Verifique se a tabela `planilha_dashboard` existe
3. Verifique os logs do backend
4. Use a rota `/debug-cadunico` para verificar dados

### Problema: Filtros não são aplicados
1. Verifique se os valores dos filtros correspondem aos dados
2. Verifique o mapeamento de colunas no backend
3. Use a rota `/debug-filtros` para verificar a query SQL

### Problema: Opções não aparecem
1. Verifique se as constantes estão configuradas corretamente
2. Verifique se os dados do PostgreSQL contêm essas opções
3. Use o script `teste-opcoes.js` para verificar todas as opções

## 📝 Exemplos de Uso

### Filtro Simples
```
GET /dados-agrupados?cadUnico=SIM
GET /dados-agrupados?setorEconomico=Indústria
GET /dados-agrupados?sexo=Homem
```

### Filtro Múltiplo
```
GET /dados-agrupados?cadUnico=SIM&setorEconomico=Indústria&uf=São Paulo
GET /dados-agrupados?bolsaFamilia=SIM&sexo=Homem&faixaEtaria=18 a 24 anos
```

### Filtro com Múltiplos Valores
```
GET /dados-agrupados?setorEconomico=Indústria,Comércio
GET /dados-agrupados?racaCor=Branco,Pardo
```

## 🎯 Resultado Esperado

Quando um filtro é selecionado:
1. ✅ O filtro fica destacado visualmente
2. ✅ Aparece no contador de filtros ativos
3. ✅ Vira uma coluna na tabela (destacada em roxo)
4. ✅ Os dados são filtrados automaticamente
5. ✅ A tabela mostra apenas os registros que correspondem ao filtro

## 🔄 Próximos Passos

- [ ] Adicionar cache de consultas para melhor performance
- [ ] Implementar filtros por data/hora
- [ ] Adicionar exportação de dados filtrados
- [ ] Implementar filtros salvos/favoritos
- [ ] Adicionar gráficos baseados nos filtros

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Execute os testes automatizados
3. Use as rotas de debug
4. Verifique a documentação da API
