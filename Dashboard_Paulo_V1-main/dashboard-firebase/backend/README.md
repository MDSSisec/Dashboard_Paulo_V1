# 🚀 Backend Dashboard - Estrutura Organizada

## 📁 Estrutura de Arquivos

```
backend/
├── config/
│   └── database.js          # Configuração do PostgreSQL
├── controllers/
│   └── dashboardController.js # Lógica de negócio
├── routes/
│   └── dashboardRoutes.js   # Definição das rotas
├── services/
│   └── queryBuilder.js      # Construção de queries SQL
├── server.js                # Arquivo principal
└── README.md               # Esta documentação
```

## 🔧 Como Funciona

### 1. **server.js** - Ponto de Entrada
- Configura o Express
- Aplica middlewares (CORS, JSON)
- Carrega as rotas
- Inicia o servidor na porta 3001

### 2. **config/database.js** - Conexão com Banco
- Configuração do PostgreSQL
- Pool de conexões
- Credenciais do banco

### 3. **services/queryBuilder.js** - Construção de Queries
- Funções para processar filtros
- Query principal com agrupamento
- Query para dados iniciais

### 4. **controllers/dashboardController.js** - Lógica de Negócio
- Processa requisições
- Chama os serviços
- Retorna respostas

### 5. **routes/dashboardRoutes.js** - Definição de Rotas
- Mapeia URLs para controllers
- Organiza endpoints

## 📊 Endpoints Disponíveis

### **POST /dados-agrupados**
Busca dados com filtros aplicados
```json
{
  "ano": [2022],
  "uf": ["São Paulo"],
  "cadUnico": ["SIM"]
}
```

### **GET /dados**
Busca dados iniciais (sem filtros)

### **GET /health**
Verifica status do servidor

## 🚀 Como Executar

```bash
cd backend
npm install
npm start
```

## 🔍 Logs

O servidor mostra logs detalhados:
- Filtros recebidos
- Query executada
- Número de registros retornados
- Erros (se houver)

## ✅ Vantagens da Nova Estrutura

1. **Organização**: Código separado por responsabilidade
2. **Manutenibilidade**: Fácil de modificar e expandir
3. **Testabilidade**: Cada módulo pode ser testado isoladamente
4. **Escalabilidade**: Fácil adicionar novas funcionalidades
5. **Legibilidade**: Código mais limpo e compreensível
