# 📊 Dashboard PostgreSQL - Dashboard_Paulo_V1-main

Dashboard completo para visualizar dados do PostgreSQL com frontend React, filtros avançados e backend Node.js.

## 🚀 Como Executar

### 1. **Importar Dados para PostgreSQL**
```bash
cd banco
pip install pandas sqlalchemy psycopg2-binary openpyxl
python importar_planilha.py
```

### 2. **Iniciar Backend**
```bash
cd dashboard-firebase/backend
npm install
npm start
```
O servidor estará rodando em: http://localhost:3001

### 3. **Iniciar Frontend**
```bash
cd dashboard-firebase
npm install
npm run dev
```
O frontend estará rodando em: http://localhost:5173

## 📁 Estrutura do Projeto

```
Dashboard_Paulo_V1-main/
├── dashboard-firebase/
│   ├── backend/
│   │   ├── server.js               # Servidor Node.js + Express
│   │   └── package.json
│   ├── src/
│   │   ├── App.tsx                # Componente principal React com filtros
│   │   ├── components/ui/
│   │   │   ├── Filtros.tsx        # Componente de filtros
│   │   │   └── MultiSelect.tsx    # Select múltiplo
│   │   ├── lib/
│   │   │   └── utils.ts           # Funções utilitárias
│   │   ├── main.tsx               # Ponto de entrada
│   │   └── index.css              # Estilos
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── dados_cruzados.xlsx            # Planilha com os dados
```

## 🔧 Configurações

### PostgreSQL
- **Usuário**: postgres
- **Senha**: @dM1n090710
- **Banco**: meu_banco
- **Tabela**: planilha_dashboard

### Portas
- **Backend**: 3001
- **Frontend**: 5173

## 📊 Funcionalidades

- ✅ Importação automática de planilha Excel
- ✅ API REST para consulta dos dados
- ✅ Dashboard React com filtros avançados
- ✅ Filtros dinâmicos por categoria e subcategoria
- ✅ Agrupamento no PostgreSQL (GROUP BY)
- ✅ Tabela responsiva com scroll horizontal
- ✅ Exportação para Excel
- ✅ Conexão direta com PostgreSQL
- ✅ Tratamento de loading states

## 🎛️ Sistema de Categorias e Subcategorias

### **Categorias Principais e suas Subcategorias:**

#### **Bolsa Família**
- SIM
- NAO

#### **Situação de Pobreza**
- SIM
- NAO

#### **Setor Econômico**
- Agronegócio
- Comércio
- Construção
- Indústria
- Serviço

#### **Sexo**
- Homem
- Mulher
- Não Identificado

#### **Raça/Cor**
- Amarelo
- Branco
- Indígena
- Não Identificado
- Não Informado
- Pardo
- Preto

#### **Grau de Instrução**
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

#### **Faixa Etária**
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

#### **CadÚnico**
- SIM
- NÃO

#### **UF**
- Todos os estados brasileiros

#### **Ano**
- 2021, 2022, 2023

## 🛠️ Tecnologias

- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: React + Vite + Axios + TypeScript
- **Banco**: PostgreSQL
- **Importação**: Python + Pandas + SQLAlchemy
- **UI**: Tailwind CSS + Componentes customizados

## 🔍 Troubleshooting

Se der tela branca ou erro 504:
1. Pare o servidor (Ctrl+C)
2. Execute: `npm run dev` novamente
3. Limpe o cache do navegador (Ctrl+F5)

Se der erro de conexão com PostgreSQL:
1. Verifique se o PostgreSQL está rodando
2. Confirme se a senha está correta no `backend/server.js`
3. Verifique se o banco 'meu_banco' existe

## 📈 Como Usar os Filtros

1. **Selecione filtros** no card preto superior
2. **Filtros ativos** viram colunas na tabela (destacadas em roxo)
3. **Dados são agrupados** automaticamente por UF, Ano e filtros selecionados
4. **O PostgreSQL faz o agrupamento** (GROUP BY) e retorna dados já processados
5. **Exporte para Excel** usando o botão verde no canto superior esquerdo

## 🔄 Como Funciona o Sistema

1. **Frontend**: Usuário seleciona filtros
2. **Backend**: Recebe filtros e constrói query SQL dinâmica
3. **PostgreSQL**: Executa GROUP BY com filtros aplicados
4. **Frontend**: Recebe dados já agrupados e exibe na tabela
5. **Filtros selecionados** aparecem como colunas na tabela 