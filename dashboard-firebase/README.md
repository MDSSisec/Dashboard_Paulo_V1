# 📊 Dashboard Firebase - Análise de Dados

Dashboard interativo para análise de dados com filtros dinâmicos e exportação para Excel.

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Firebase
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 3. Executar o Projeto
```bash
npm run dev
```

## 🎛️ Funcionalidades

### Filtros Dinâmicos
- **Bolsa Família:** Sim/Não/Não informado
- **Situação de Pobreza:** Sim/Não/Não informado
- **Setor Econômico:** Agronegócio, Comércio, Construção, Indústria, Serviço
- **Sexo:** Feminino/Masculino/Não informado
- **Raça/Cor:** Amarelo, Branco, Indígena, Pardo, Preto, etc.
- **Grau de Instrução:** Analfabeto até Doutorado
- **Faixa Etária:** 18-24 anos até Acima de 65 anos
- **CadÚnico:** Sim/Não/Não informado
- **UF:** Todos os estados brasileiros
- **Ano:** 2021-2025

### 📊 Visualização
- Tabelas responsivas com scroll horizontal
- Formatação de números em português brasileiro
- Agrupamento automático por categorias selecionadas
- Exportação para Excel

### ⚡ Performance
- Filtros em tempo real
- Otimização com useMemo
- Carregamento dinâmico de opções do Firebase

## 🔧 Como Funciona

1. **Carregamento de Dados:** Os dados são carregados do Firebase Firestore na coleção "dados"
2. **Filtros Dinâmicos:** As opções de filtro são geradas automaticamente baseadas nos dados disponíveis
3. **Filtragem em Tempo Real:** Quando um filtro é selecionado, a tabela é atualizada instantaneamente
4. **Agrupamento:** Os dados são agrupados pelas categorias dos filtros ativos

## 📁 Estrutura do Projeto

```
src/
├── components/ui/
│   ├── Filtros.tsx      # Componente de filtros
│   ├── MultiSelect.tsx  # Select múltiplo
│   └── table.tsx        # Componente de tabela
├── lib/
│   ├── firebase.ts      # Configuração do Firebase
│   └── utils.ts         # Funções utilitárias
└── App.tsx              # Componente principal
```

## 🎯 Uso

1. Selecione os filtros desejados no painel superior
2. A tabela será atualizada automaticamente
3. Use o botão "Exportar para Excel" para baixar os dados
4. Use "RESETAR FILTROS" para limpar todas as seleções

## 🔍 Logs de Debug

O dashboard inclui logs detalhados no console do navegador para facilitar o debug:
- 📊 Filtros aplicados
- 🔄 Recalculando dados
- 📈 Dados cruzados gerados
- ��️ Filtros alterados 