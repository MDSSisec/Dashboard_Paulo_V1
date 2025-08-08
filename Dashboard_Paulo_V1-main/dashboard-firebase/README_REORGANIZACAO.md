# 🚀 Reorganização do Dashboard Firebase

## 📋 Resumo da Reorganização

O projeto foi completamente reorganizado seguindo princípios de **Clean Architecture** e **Separation of Concerns** para melhorar a manutenibilidade, escalabilidade e legibilidade do código.

## 🏗️ Nova Estrutura de Diretórios

```
src/
├── components/          # Componentes reutilizáveis da interface
│   └── ui/
│       ├── Filtros.tsx
│       ├── MultiSelect.tsx
│       └── table.tsx
├── constants/           # Constantes globais
│   └── filters.ts       # Categorias, nomes e subcategorias dos filtros
├── data/               # Dados mock para desenvolvimento
│   └── mockDados.ts     # Dados de exemplo e gerador de dados mock
├── pages/              # Entradas principais da aplicação
│   └── App.tsx         # Componente principal limpo e organizado
├── services/           # Lógica de negócios e manipulação de dados
│   ├── dataFetcher.ts  # Centraliza busca e filtragem de dados
│   └── exportExcel.ts  # Lógica de exportação para XLSX
├── styles/             # Estilos globais
│   └── global.css      # Estilos CSS globais (renomeado de index.css)
├── types/              # Tipos do TypeScript
│   └── Dado.ts         # Interface principal dos dados
├── lib/                # Utilitários e configurações
│   ├── firebase.ts     # Configuração do Firebase
│   └── utils.ts        # Funções utilitárias
├── main.tsx            # Ponto de entrada da aplicação
└── vite-env.d.ts       # Tipos do Vite
```

## 🔄 Mudanças Principais

### 1. **Separação de Responsabilidades**
- **Tipos**: Interface `Dado` movida para `/types/Dado.ts`
- **Constantes**: Categorias, nomes e subcategorias movidas para `/constants/filters.ts`
- **Serviços**: Lógica de negócios centralizada em `/services/`

### 2. **Serviços Criados**
- **`dataFetcher.ts`**: Centraliza toda lógica de busca e filtragem de dados
- **`exportExcel.ts`**: Isola lógica de exportação para Excel
- **`mockDados.ts`**: Fornece dados de exemplo para desenvolvimento

### 3. **App.tsx Limpo**
- Removida toda lógica de negócios
- Mantida apenas renderização e gerenciamento de estado
- Importações organizadas e claras
- Código mais legível e manutenível

### 4. **Melhorias na Organização**
- **Estilos**: `index.css` → `styles/global.css`
- **Páginas**: `App.tsx` → `pages/App.tsx`
- **Componentes**: Mantidos em `/components/ui/` para reutilização

## 📦 Benefícios da Reorganização

### ✅ **Manutenibilidade**
- Código mais fácil de entender e modificar
- Responsabilidades bem definidas
- Menos acoplamento entre componentes

### ✅ **Escalabilidade**
- Estrutura preparada para crescimento
- Fácil adição de novos serviços e componentes
- Padrões consistentes

### ✅ **Testabilidade**
- Serviços isolados facilitam testes unitários
- Dados mock para desenvolvimento
- Separação clara entre lógica e apresentação

### ✅ **Reutilização**
- Componentes mais modulares
- Serviços reutilizáveis
- Constantes centralizadas

## 🔧 Como Usar

### **1. Importações Organizadas**
```typescript
// Tipos
import { Dado } from "@/types/Dado";

// Constantes
import { nomesFiltros, categoriasFixas, valoresPadrao } from "@/constants/filters";

// Serviços
import { buscarDadosIniciais, buscarDadosFiltrados, Filtros } from "@/services/dataFetcher";
import { exportarParaExcel, formatarNumero } from "@/services/exportExcel";

// Dados mock
import { mockDados, gerarDadosMock } from "@/data/mockDados";
```

### **2. Exemplo de Uso dos Serviços**
```typescript
// Buscar dados iniciais
const { dados, opcoesDinamicas } = await buscarDadosIniciais();

// Buscar dados filtrados
const filtros: Filtros = {
  uf: ["São Paulo", "Rio de Janeiro"],
  ano: ["2023"],
  sexo: ["Homem"]
};
const dadosFiltrados = await buscarDadosFiltrados(filtros);

// Exportar para Excel
exportarParaExcel(dadosFiltrados, ["uf", "ano", "sexo"], "meus_dados.xlsx");

// Formatar números
const numeroFormatado = formatarNumero(1500); // "1.500"
```

### **3. Desenvolvimento com Dados Mock**
```typescript
// Usar dados mock fixos
import { mockDados } from "@/data/mockDados";
console.log("Dados de exemplo:", mockDados);

// Gerar dados aleatórios para testes
import { gerarDadosMock } from "@/data/mockDados";
const dadosTeste = gerarDadosMock(50); // 50 registros aleatórios
const dadosGrandes = gerarDadosMock(1000); // 1000 registros para performance

// Usar em desenvolvimento
const [dados, setDados] = useState<Dado[]>(mockDados);
```

### **4. Exemplo de Componente Usando a Nova Estrutura**
```typescript
import { useState, useEffect } from "react";
import { Dado } from "@/types/Dado";
import { nomesFiltros } from "@/constants/filters";
import { buscarDadosFiltrados, Filtros } from "@/services/dataFetcher";
import { exportarParaExcel } from "@/services/exportExcel";

export function MeuComponente() {
  const [dados, setDados] = useState<Dado[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({});

  useEffect(() => {
    const carregarDados = async () => {
      const resultado = await buscarDadosFiltrados(filtros);
      setDados(resultado);
    };
    carregarDados();
  }, [filtros]);

  const handleExport = () => {
    const categorias = Object.keys(filtros).filter(k => filtros[k]?.length > 0);
    exportarParaExcel(dados, categorias, "exportacao.xlsx");
  };

  return (
    <div>
      <h1>Meus Dados</h1>
      <button onClick={handleExport}>Exportar</button>
      {dados.map((item, index) => (
        <div key={index}>
          {nomesFiltros.uf}: {item.uf} | 
          Admissoes: {item.admissoes}
        </div>
      ))}
    </div>
  );
}
```

### **5. Exemplo de Hook Customizado**
```typescript
import { useState, useEffect } from "react";
import { Dado } from "@/types/Dado";
import { buscarDadosFiltrados, Filtros } from "@/services/dataFetcher";

export function useDados(filtros: Filtros) {
  const [dados, setDados] = useState<Dado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);
        const resultado = await buscarDadosFiltrados(filtros);
        setDados(resultado);
      } catch (err) {
        setError("Erro ao carregar dados");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [filtros]);

  return { dados, loading, error };
}

// Uso do hook
function MeuComponente() {
  const filtros = { uf: ["São Paulo"] };
  const { dados, loading, error } = useDados(filtros);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return <div>{dados.length} registros encontrados</div>;
}
```

## 🎯 Próximos Passos Sugeridos

1. **Testes Unitários**: Implementar testes para os serviços
2. **Componentes Adicionais**: Criar mais componentes reutilizáveis
3. **Hooks Customizados**: Extrair lógica comum para hooks
4. **Context API**: Implementar gerenciamento de estado global se necessário
5. **Documentação**: Adicionar JSDoc nos serviços e componentes

## 📚 Exemplos Práticos Adicionais

### **6. Exemplo de Filtros Dinâmicos**
```typescript
import { useState, useEffect } from "react";
import { buscarDadosIniciais } from "@/services/dataFetcher";
import { valoresPadrao } from "@/constants/filters";

export function useFiltrosDinamicos() {
  const [opcoes, setOpcoes] = useState(valoresPadrao);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        const { opcoesDinamicas } = await buscarDadosIniciais();
        setOpcoes(opcoesDinamicas);
      } catch (error) {
        console.log("Usando valores padrão");
        setOpcoes(valoresPadrao);
      } finally {
        setLoading(false);
      }
    };

    carregarOpcoes();
  }, []);

  return { opcoes, loading };
}
```

### **7. Exemplo de Validação de Dados**
```typescript
import { Dado } from "@/types/Dado";

export function validarDado(dado: any): dado is Dado {
  return (
    typeof dado.estado === 'string' &&
    typeof dado.admissoes === 'number' &&
    typeof dado.desligamentos === 'number' &&
    typeof dado.saldo === 'number' &&
    dado.uf !== undefined
  );
}

// Uso
const dadosFiltrados = dados.filter(validarDado);
```

### **8. Exemplo de Cache de Dados**
```typescript
import { useState, useCallback } from "react";
import { buscarDadosFiltrados, Filtros } from "@/services/dataFetcher";

export function useDadosComCache() {
  const [cache, setCache] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(false);

  const buscarDados = useCallback(async (filtros: Filtros) => {
    const chave = JSON.stringify(filtros);
    
    // Verificar cache
    if (cache.has(chave)) {
      return cache.get(chave);
    }

    // Buscar dados
    setLoading(true);
    try {
      const dados = await buscarDadosFiltrados(filtros);
      setCache(prev => new Map(prev).set(chave, dados));
      return dados;
    } finally {
      setLoading(false);
    }
  }, [cache]);

  return { buscarDados, loading };
}
```

### **9. Exemplo de Componente de Tabela Reutilizável**
```typescript
import { Dado } from "@/types/Dado";
import { nomesFiltros } from "@/constants/filters";
import { formatarNumero } from "@/services/exportExcel";

interface TabelaDadosProps {
  dados: Dado[];
  colunas: string[];
  loading?: boolean;
}

export function TabelaDados({ dados, colunas, loading }: TabelaDadosProps) {
  if (loading) return <div>Carregando dados...</div>;

  return (
    <table className="min-w-full">
      <thead>
        <tr>
          {colunas.map(col => (
            <th key={col}>{nomesFiltros[col] || col}</th>
          ))}
          <th>Admissões</th>
          <th>Desligamentos</th>
          <th>Saldo</th>
        </tr>
      </thead>
      <tbody>
        {dados.map((item, index) => (
          <tr key={index}>
            {colunas.map(col => (
              <td key={col}>{item[col]}</td>
            ))}
            <td>{formatarNumero(item.admissoes)}</td>
            <td>{formatarNumero(item.desligamentos)}</td>
            <td>{formatarNumero(item.saldo)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Uso
<TabelaDados 
  dados={dados} 
  colunas={["uf", "ano", "sexo"]} 
  loading={loading} 
/>
```

## 🚀 Resultado Final

O projeto agora segue as melhores práticas de desenvolvimento React + TypeScript, com:
- **Código limpo e organizado**
- **Separação clara de responsabilidades**
- **Fácil manutenção e escalabilidade**
- **Estrutura profissional e escalável**

---

**🎉 Reorganização concluída com sucesso!** O projeto está agora muito mais organizado, profissional e preparado para crescimento futuro.
