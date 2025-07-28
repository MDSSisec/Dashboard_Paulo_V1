import Filtros from "@/components/ui/Filtros";
import { useEffect, useState, useRef, useMemo, useLayoutEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as XLSX from "xlsx";
import { agruparDados } from "@/lib/utils";

// Tipagem dos dados
interface Dado {
  estado: string;
  categoria: string;
  admissoes: number;
  desligamentos: number;
  saldo: number;
  faixaEtaria?: string;
  grauInstrucao?: string;
  racaCor?: string;
  setorEconomico?: string;
  situacaoPobreza?: string;
  ano?: string;
  uf?: string;
  sexo?: string;
  bolsaFamilia?: string;
  cadUnico?: string;
  [key: string]: any; // Para campos dinâmicos adicionais
}

// Dados mock para demonstração
const dadosMock: Dado[] = [
  {
    estado: "São Paulo",
    categoria: "Indústria",
    admissoes: 1500,
    desligamentos: 800,
    saldo: 700,
    faixaEtaria: "25 a 29 anos",
    grauInstrucao: "Médio completo",
    racaCor: "Branco",
    setorEconomico: "Indústria",
    situacaoPobreza: "NAO",
    ano: "2023",
    uf: "São Paulo",
    sexo: "Homem",
    bolsaFamilia: "NAO",
    cadUnico: "NAO"
  },
  {
    estado: "Rio de Janeiro",
    categoria: "Serviços",
    admissoes: 1200,
    desligamentos: 600,
    saldo: 600,
    faixaEtaria: "30 a 39 anos",
    grauInstrucao: "Superior completo",
    racaCor: "Pardo",
    setorEconomico: "Serviço",
    situacaoPobreza: "SIM",
    ano: "2023",
    uf: "Rio de Janeiro",
    sexo: "Mulher",
    bolsaFamilia: "SIM",
    cadUnico: "SIM"
  },
  {
    estado: "Minas Gerais",
    categoria: "Comércio",
    admissoes: 800,
    desligamentos: 400,
    saldo: 400,
    faixaEtaria: "18 a 24 anos",
    grauInstrucao: "Fundamental completo",
    racaCor: "Preto",
    setorEconomico: "Comércio",
    situacaoPobreza: "NAO",
    ano: "2023",
    uf: "Minas Gerais",
    sexo: "Homem",
    bolsaFamilia: "NAO",
    cadUnico: "NAO"
  },
  {
    estado: "Bahia",
    categoria: "Agronegócio",
    admissoes: 600,
    desligamentos: 300,
    saldo: 300,
    faixaEtaria: "40 a 49 anos",
    grauInstrucao: "Analfabeto",
    racaCor: "Indígena",
    setorEconomico: "Agronegócio",
    situacaoPobreza: "SIM",
    ano: "2023",
    uf: "Bahia",
    sexo: "Mulher",
    bolsaFamilia: "SIM",
    cadUnico: "SIM"
  },
  {
    estado: "Paraná",
    categoria: "Construção",
    admissoes: 900,
    desligamentos: 500,
    saldo: 400,
    faixaEtaria: "50 a 59 anos",
    grauInstrucao: "Médio incompleto",
    racaCor: "Branco",
    setorEconomico: "Construção",
    situacaoPobreza: "NAO",
    ano: "2023",
    uf: "Paraná",
    sexo: "Homem",
    bolsaFamilia: "NAO",
    cadUnico: "NAO"
  },
  {
    estado: "Santa Catarina",
    categoria: "Tecnologia",
    admissoes: 1100,
    desligamentos: 300,
    saldo: 800,
    faixaEtaria: "25 a 29 anos",
    grauInstrucao: "Superior completo",
    racaCor: "Amarelo",
    setorEconomico: "Serviço",
    situacaoPobreza: "NAO",
    ano: "2023",
    uf: "Santa Catarina",
    sexo: "Mulher",
    bolsaFamilia: "NAO",
    cadUnico: "NAO"
  },
  {
    estado: "Rio Grande do Sul",
    categoria: "Educação",
    admissoes: 700,
    desligamentos: 200,
    saldo: 500,
    faixaEtaria: "30 a 39 anos",
    grauInstrucao: "Superior completo",
    racaCor: "Branco",
    setorEconomico: "Serviço",
    situacaoPobreza: "NAO",
    ano: "2023",
    uf: "Rio Grande do Sul",
    sexo: "Mulher",
    bolsaFamilia: "NAO",
    cadUnico: "NAO"
  },
  {
    estado: "Ceará",
    categoria: "Saúde",
    admissoes: 950,
    desligamentos: 350,
    saldo: 600,
    faixaEtaria: "40 a 49 anos",
    grauInstrucao: "Superior completo",
    racaCor: "Pardo",
    setorEconomico: "Serviço",
    situacaoPobreza: "SIM",
    ano: "2023",
    uf: "Ceará",
    sexo: "Homem",
    bolsaFamilia: "SIM",
    cadUnico: "SIM"
  },
  {
    estado: "Acre",
    categoria: "Serviços",
    admissoes: 590,
    desligamentos: 496,
    saldo: 94,
    faixaEtaria: "25 a 29 anos",
    grauInstrucao: "Médio completo",
    racaCor: "Pardo",
    setorEconomico: "Serviço",
    situacaoPobreza: "NAO",
    ano: "2021",
    uf: "ACRE",
    sexo: "Homem",
    bolsaFamilia: "NAO",
    cadUnico: "NAO"
  },
  {
    estado: "Acre",
    categoria: "Comércio",
    admissoes: 450,
    desligamentos: 380,
    saldo: 70,
    faixaEtaria: "30 a 39 anos",
    grauInstrucao: "Fundamental completo",
    racaCor: "Branco",
    setorEconomico: "Comércio",
    situacaoPobreza: "SIM",
    ano: "2021",
    uf: "ACRE",
    sexo: "Mulher",
    bolsaFamilia: "SIM",
    cadUnico: "SIM"
  },
  {
    estado: "Alagoas",
    categoria: "Indústria",
    admissoes: 320,
    desligamentos: 280,
    saldo: 40,
    faixaEtaria: "18 a 24 anos",
    grauInstrucao: "Médio incompleto",
    racaCor: "Preto",
    setorEconomico: "Indústria",
    situacaoPobreza: "NAO",
    ano: "2021",
    uf: "ALAGOAS",
    sexo: "Homem",
    bolsaFamilia: "NAO",
    cadUnico: "NAO"
  },
  {
    estado: "Amapá",
    categoria: "Construção",
    admissoes: 280,
    desligamentos: 220,
    saldo: 60,
    faixaEtaria: "40 a 49 anos",
    grauInstrucao: "Superior completo",
    racaCor: "Branco",
    setorEconomico: "Construção",
    situacaoPobreza: "SIM",
    ano: "2021",
    uf: "AMAPA",
    sexo: "Mulher",
    bolsaFamilia: "SIM",
    cadUnico: "SIM"
  },
  {
    estado: "Acre",
    categoria: "Tecnologia",
    admissoes: 620,
    desligamentos: 520,
    saldo: 100,
    faixaEtaria: "25 a 29 anos",
    grauInstrucao: "Superior completo",
    racaCor: "Branco",
    setorEconomico: "Serviço",
    situacaoPobreza: "NAO",
    ano: "2022",
    uf: "ACRE",
    sexo: "Homem",
    bolsaFamilia: "NAO",
    cadUnico: "NAO"
  },
  {
    estado: "Acre",
    categoria: "Educação",
    admissoes: 580,
    desligamentos: 490,
    saldo: 90,
    faixaEtaria: "30 a 39 anos",
    grauInstrucao: "Superior completo",
    racaCor: "Pardo",
    setorEconomico: "Serviço",
    situacaoPobreza: "SIM",
    ano: "2023",
    uf: "ACRE",
    sexo: "Mulher",
    bolsaFamilia: "SIM",
    cadUnico: "SIM"
  }
];

dadosMock.forEach((d) => {
  if (!d.cadUnico || d.cadUnico === "") {
    d.cadUnico = "NAO";
  }
});

// Mover para fora do componente para evitar recriação a cada render
const categoriasFixas = [
  "bolsaFamilia",
  "situacaoPobreza",
  "setorEconomico",
  "sexo",
  "racaCor",
  "grauInstrucao",
  "faixaEtaria",
  "cadUnico",
  "uf",
  "ano"
];

const nomesFiltros: Record<string, string> = {
  bolsaFamilia: "Bolsa Família",
  situacaoPobreza: "Situação de Pobreza",
  setorEconomico: "Setor Econômico",
  sexo: "Sexo",
  racaCor: "Raça/Cor",
  grauInstrucao: "Grau de Instrução",
  faixaEtaria: "Faixa Etária",
  cadUnico: "CadÚnico",
  uf: "UF",
  ano: "Ano"
};

// Função de filtragem com lógica E (AND) entre categorias de filtro
function filtrarDados(dados: Dado[], filtros: { [key: string]: string[] }): Dado[] {
  const chavesFiltroAtivas = Object.keys(filtros).filter(
    (k) => filtros[k] && filtros[k].length > 0 && !filtros[k].includes("Todos")
  );

  if (chavesFiltroAtivas.length === 0) {
    console.log(`Nenhum filtro ativo - mostrando todos os ${dados.length} dados`);
    return dados;
  }

  console.log("=== INÍCIO DA FILTRAGEM ===");
  console.log("Chaves de filtro ativas:", chavesFiltroAtivas);
  console.log("Filtros:", filtros);
  console.log("Total de dados:", dados.length);

  const resultado = dados.filter((item, index) => {
    for (const campo of chavesFiltroAtivas) {
      const valores = filtros[campo];
      const valorItem = item[campo];
      
      // Verificação mais robusta
      const valorItemStr = String(valorItem || "").trim().toUpperCase();
      const valoresFiltroStr = valores.map(v => String(v).trim().toUpperCase());
      
      const match = valoresFiltroStr.includes(valorItemStr);
      
      if (!match) {
        console.log(`❌ Item ${index + 1} REJEITADO - Campo: ${campo}, Valor: "${valorItemStr}", Filtro: [${valoresFiltroStr.join(', ')}]`);
        return false;
      }
    }
    
    console.log(`✅ Item ${index + 1} ACEITO`);
    return true;
  });
  
  console.log(`\n=== RESULTADO DA FILTRAGEM ===`);
  console.log(`Dados originais: ${dados.length}`);
  console.log(`Dados filtrados: ${resultado.length}`);
  console.log("=== FIM DA FILTRAGEM ===\n");
  
  return resultado;
}

// Função para formatar números para melhor leitura
const formatarNumero = (num: number) => new Intl.NumberFormat('pt-BR').format(num);

export default function App() {
  const [filtros, setFiltros] = useState<{ [key: string]: string[] }>({});
  const [dados, setDados] = useState<Dado[]>([]);
  const [loading, setLoading] = useState(true); // Iniciar como true para mostrar o carregamento inicial
  const [opcoesDinamicas, setOpcoesDinamicas] = useState<Record<string, string[]>>({});
  
  const tabelaRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef<HTMLDivElement>(null);

  // EFEITO PARA BUSCAR DADOS DO FIRESTORE
  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);
        console.log("Carregando dados do Firebase...");
        
        // Verificar se o Firebase está configurado
        const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
                                    import.meta.env.VITE_FIREBASE_PROJECT_ID;
        
        console.log("Firebase configurado?", isFirebaseConfigured);
        console.log("VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY ? "SIM" : "NÃO");
        console.log("VITE_FIREBASE_PROJECT_ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID ? "SIM" : "NÃO");
        
        if (!isFirebaseConfigured) {
          console.log("Usando dados mock para demonstração...");
          
          // Usar dados mock
          const dadosCarregados = dadosMock;
          const novasOpcoes: Record<string, Set<string>> = {};

          dadosCarregados.forEach((docData) => {
            // Popula as opções de filtro dinamicamente
            for (const key of categoriasFixas) {
              if (docData[key] !== undefined && docData[key] !== null) {
                if (!novasOpcoes[key]) {
                  novasOpcoes[key] = new Set<string>();
                }
                novasOpcoes[key].add(String(docData[key]));
              }
            }
          });

          const opcoesFinais: Record<string, string[]> = {};
          for (const key in novasOpcoes) {
            opcoesFinais[key] = Array.from(novasOpcoes[key]).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
          }
          
          // Forçar CadÚnico a ter SIM e NAO
          if (opcoesFinais.cadUnico) {
            if (!opcoesFinais.cadUnico.includes("NAO")) {
              opcoesFinais.cadUnico.push("NAO");
            }
            if (!opcoesFinais.cadUnico.includes("SIM")) {
              opcoesFinais.cadUnico.push("SIM");
            }
            opcoesFinais.cadUnico.sort();
          }
          
          // Forçar todas as categorias a terem opções se estiverem vazias
          if (!opcoesFinais.grauInstrucao || opcoesFinais.grauInstrucao.length === 0) {
            opcoesFinais.grauInstrucao = ["5º completo fundamental", "6º a 9º fundamental", "Analfabeto", "Até 5º incompleto", "Doutorado", "Fundamental completo", "Médio completo", "Médio incompleto", "Mestrado", "Pós-graduação completa", "Superior completo", "Superior incompleto", "Não identificado"];
          }
          if (!opcoesFinais.faixaEtaria || opcoesFinais.faixaEtaria.length === 0) {
            opcoesFinais.faixaEtaria = ["18 a 24 anos", "25 a 29 anos", "30 a 39 anos", "40 a 49 anos", "50 a 59 anos", "60 a 64 anos", "Acima de 65 anos", "Até 17 anos", "Data de nascimento nula", "Data de nascimento inválida"];
          }
          if (!opcoesFinais.sexo || opcoesFinais.sexo.length === 0) {
            opcoesFinais.sexo = ["Homem", "Mulher"];
          }
          if (!opcoesFinais.racaCor || opcoesFinais.racaCor.length === 0) {
            opcoesFinais.racaCor = ["Branco", "Pardo", "Preto", "Amarelo", "Indígena"];
          }
          if (!opcoesFinais.bolsaFamilia || opcoesFinais.bolsaFamilia.length === 0) {
            opcoesFinais.bolsaFamilia = ["SIM", "NAO"];
          }
          if (!opcoesFinais.situacaoPobreza || opcoesFinais.situacaoPobreza.length === 0) {
            opcoesFinais.situacaoPobreza = ["SIM", "NAO"];
          }
          if (!opcoesFinais.setorEconomico || opcoesFinais.setorEconomico.length === 0) {
            opcoesFinais.setorEconomico = ["Serviço", "Comércio", "Indústria", "Construção", "Agronegócio"];
          }

          console.log(`Dados mock carregados: ${dadosCarregados.length} registros`);
          console.log("Opções de filtro disponíveis:", opcoesFinais);
          console.log("CadÚnico disponível:", opcoesFinais.cadUnico);
          console.log("Grau de Instrução disponível:", opcoesFinais.grauInstrucao);
          console.log("Faixa Etária disponível:", opcoesFinais.faixaEtaria);
          console.log("Todos os valores CadÚnico nos dados:", dadosCarregados.map(d => d.cadUnico));
          console.log("Valores únicos de CadÚnico:", [...new Set(dadosCarregados.map(d => d.cadUnico))]);
          console.log("Todos os valores Grau de Instrução nos dados:", dadosCarregados.map(d => d.grauInstrucao));
          console.log("Todos os valores Faixa Etária nos dados:", dadosCarregados.map(d => d.faixaEtaria));
          
          // Garantir que todos os dados tenham cadUnico preenchido
          dadosCarregados.forEach((d) => {
            if (!d.cadUnico || d.cadUnico === "" || d.cadUnico === undefined) {
              d.cadUnico = "NAO";
            }
          });
          console.log("Após garantir cadUnico - Valores únicos:", [...new Set(dadosCarregados.map(d => d.cadUnico))]);
          
          setDados(dadosCarregados);
          setOpcoesDinamicas(opcoesFinais);
          return;
        }
        
        // ATENÇÃO: Ajuste o nome da coleção para o nome correto no seu Firestore.
        // Presumi que se chama "dados".
        const q = query(collection(db, "dados"));
        const querySnapshot = await getDocs(q);
        const dadosCarregados: Dado[] = [];
        const novasOpcoes: Record<string, Set<string>> = {};

        querySnapshot.forEach((doc) => {
          const docData = doc.data() as Dado;
          dadosCarregados.push(docData);

          // Popula as opções de filtro dinamicamente
          for (const key of categoriasFixas) {
            if (docData[key] !== undefined && docData[key] !== null) {
              if (!novasOpcoes[key]) {
                novasOpcoes[key] = new Set<string>();
              }
              novasOpcoes[key].add(String(docData[key]));
            }
          }
        });

        const opcoesFinais: Record<string, string[]> = {};
        for (const key in novasOpcoes) {
          opcoesFinais[key] = Array.from(novasOpcoes[key]).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        }
        
        // Forçar CadÚnico a ter SIM e NAO
        if (opcoesFinais.cadUnico) {
          if (!opcoesFinais.cadUnico.includes("NAO")) {
            opcoesFinais.cadUnico.push("NAO");
          }
          if (!opcoesFinais.cadUnico.includes("SIM")) {
            opcoesFinais.cadUnico.push("SIM");
          }
          opcoesFinais.cadUnico.sort();
        }

        console.log(`Dados carregados: ${dadosCarregados.length} registros`);
        console.log("Opções de filtro disponíveis:", opcoesFinais);
        console.log("CadÚnico disponível:", opcoesFinais.cadUnico);
        
        // Garantir que todos os dados tenham cadUnico preenchido
        dadosCarregados.forEach((d) => {
          if (!d.cadUnico || d.cadUnico === "" || d.cadUnico === undefined) {
            d.cadUnico = "NAO";
          }
        });
        console.log("Após garantir cadUnico - Valores únicos:", [...new Set(dadosCarregados.map(d => d.cadUnico))]);
        
        setDados(dadosCarregados);
        setOpcoesDinamicas(opcoesFinais);
      } catch (error) {
        console.error("Erro ao buscar dados do Firestore: ", error);
        console.log("Usando dados mock devido ao erro...");
        
        // Em caso de erro, usar dados mock
        const dadosCarregados = dadosMock;
        const novasOpcoes: Record<string, Set<string>> = {};

        dadosCarregados.forEach((docData) => {
          for (const key of categoriasFixas) {
            if (docData[key] !== undefined && docData[key] !== null) {
              if (!novasOpcoes[key]) {
                novasOpcoes[key] = new Set<string>();
              }
              novasOpcoes[key].add(String(docData[key]));
            }
          }
        });

        const opcoesFinais: Record<string, string[]> = {};
        for (const key in novasOpcoes) {
          opcoesFinais[key] = Array.from(novasOpcoes[key]).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        }
        
        // Forçar CadÚnico a ter SIM e NAO
        if (opcoesFinais.cadUnico) {
          if (!opcoesFinais.cadUnico.includes("NAO")) {
            opcoesFinais.cadUnico.push("NAO");
          }
          if (!opcoesFinais.cadUnico.includes("SIM")) {
            opcoesFinais.cadUnico.push("SIM");
          }
          opcoesFinais.cadUnico.sort();
        }
        
        // Forçar todas as categorias a terem opções se estiverem vazias
        if (!opcoesFinais.grauInstrucao || opcoesFinais.grauInstrucao.length === 0) {
          opcoesFinais.grauInstrucao = ["5º completo fundamental", "6º a 9º fundamental", "Analfabeto", "Até 5º incompleto", "Doutorado", "Fundamental completo", "Médio completo", "Médio incompleto", "Mestrado", "Pós-graduação completa", "Superior completo", "Superior incompleto", "Não identificado"];
        }
        if (!opcoesFinais.faixaEtaria || opcoesFinais.faixaEtaria.length === 0) {
          opcoesFinais.faixaEtaria = ["18 a 24 anos", "25 a 29 anos", "30 a 39 anos", "40 a 49 anos", "50 a 59 anos", "60 a 64 anos", "Acima de 65 anos", "Até 17 anos", "Data de nascimento nula", "Data de nascimento inválida"];
        }
        if (!opcoesFinais.sexo || opcoesFinais.sexo.length === 0) {
          opcoesFinais.sexo = ["Homem", "Mulher"];
        }
        if (!opcoesFinais.racaCor || opcoesFinais.racaCor.length === 0) {
          opcoesFinais.racaCor = ["Branco", "Pardo", "Preto", "Amarelo", "Indígena"];
        }
        if (!opcoesFinais.bolsaFamilia || opcoesFinais.bolsaFamilia.length === 0) {
          opcoesFinais.bolsaFamilia = ["SIM", "NAO"];
        }
        if (!opcoesFinais.situacaoPobreza || opcoesFinais.situacaoPobreza.length === 0) {
          opcoesFinais.situacaoPobreza = ["SIM", "NAO"];
        }
        if (!opcoesFinais.setorEconomico || opcoesFinais.setorEconomico.length === 0) {
          opcoesFinais.setorEconomico = ["Serviço", "Comércio", "Indústria", "Construção", "Agronegócio"];
        }

        setDados(dadosCarregados);
        setOpcoesDinamicas(opcoesFinais);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, []); // Array de dependências vazio para rodar apenas uma vez

  // Função para atualizar filtros
  const handleFiltrosChange = (novosFiltros: { [key: string]: string[] }) => {
    console.log("Filtros alterados:", novosFiltros);
    
    // Log específico para CadÚnico
    if (novosFiltros.cadUnico && novosFiltros.cadUnico.length > 0) {
      console.log("CadÚnico selecionado:", novosFiltros.cadUnico);
      console.log("Isso deve filtrar os dados por CadÚnico");
    }
    
    // Log específico para faixa etária
    if (novosFiltros.faixaEtaria && novosFiltros.faixaEtaria.length > 0) {
      console.log("Faixa Etária selecionada:", novosFiltros.faixaEtaria);
      console.log("Isso deve criar uma nova coluna 'Faixa Etária' na tabela");
    }
    
    setFiltros(novosFiltros);
  };

  // Dados filtrados
  const dadosFiltrados = useMemo(() => {
    console.log("Recalculando dados filtrados...");
    console.log("Dados totais:", dados.length);
    console.log("Filtros ativos:", filtros);
    const resultado = filtrarDados(dados, filtros);
    console.log("Dados após filtro:", resultado.length);
    return resultado;
  }, [dados, filtros]);

  // Categorias para tabela - agora inclui filtros selecionados como colunas
  const categoriasParaTabela = useMemo(() => {
    // Sempre incluir UF e Ano como base
    const categoriasBase = ['uf', 'ano'];
    
    // Adicionar categorias dos filtros ativos
    const categoriasFiltros = Object.keys(filtros).filter(
      (campo) => filtros[campo] && filtros[campo].length > 0 && !filtros[campo].includes("Todos")
    );
    
    // Combinar categorias base com filtros ativos, removendo duplicatas
    const todasCategorias = [...new Set([...categoriasBase, ...categoriasFiltros])];
    
    console.log("Categorias para tabela:", todasCategorias);
    console.log("Filtros ativos que viraram colunas:", categoriasFiltros);
    
    return todasCategorias;
  }, [filtros]);

  // Dados cruzados - agora agrupa por todas as categorias incluindo filtros
  const dadosCruzados = useMemo(() => {
    console.log("Agrupando dados cruzados...");
    const resultado = agruparDados(dadosFiltrados, categoriasParaTabela, ["admissoes", "desligamentos", "saldo"]);
    console.log(`Dados cruzados gerados: ${resultado.length} linhas`);
    return resultado;
  }, [dadosFiltrados, categoriasParaTabela]);

  // useLayoutEffect para garantir que o DOM seja medido após a renderização, corrigindo o scroll
  useLayoutEffect(() => {
    const tabelaNode = tabelaRef.current;
    const scrollTopNode = scrollTopRef.current;
    if (!tabelaNode || !scrollTopNode) return;

    const topScrollContent = scrollTopNode.firstChild as HTMLDivElement;
    if (topScrollContent) {
      topScrollContent.style.width = `${tabelaNode.scrollWidth}px`;
    }

    const handleScroll = (source: HTMLDivElement, target: HTMLDivElement) => () => {
      if (target.scrollLeft !== source.scrollLeft) {
        target.scrollLeft = source.scrollLeft;
      }
    };

    const tabelaScrollHandler = handleScroll(tabelaNode, scrollTopNode);
    const scrollTopScrollHandler = handleScroll(scrollTopNode, tabelaNode);

    tabelaNode.addEventListener('scroll', tabelaScrollHandler);
    scrollTopNode.addEventListener('scroll', scrollTopScrollHandler);

    return () => {
      tabelaNode.removeEventListener('scroll', tabelaScrollHandler);
      scrollTopNode.removeEventListener('scroll', scrollTopScrollHandler);
    };
  }, [dadosCruzados]); // Re-sincroniza se a tabela mudar, garantindo que a largura seja recalculada

  return (
    <div className="bg-black min-h-screen">
      {/* Botão fixo no canto superior esquerdo */}
      <div className="fixed top-4 left-4 z-50">
        <button
          disabled={loading || dadosCruzados.length === 0}          
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => {
            const exportData = dadosCruzados.map(item => ({
              ...categoriasParaTabela.reduce((acc, cat) => ({ ...acc, [nomesFiltros[cat] || cat]: item[cat] }), {}),
              Admissoes: item.admissoes,
              Desligamentos: item.desligamentos,
              Saldo: item.saldo,
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Dados");
            XLSX.writeFile(wb, "dados_cruzados.xlsx");
          }}
        >
          Exportar para Excel
        </button>
      </div>
      
      {/* Card preto (filtros) */}
      <div className="bg-zinc-900 p-6 rounded-md shadow-lg text-white w-full max-w-4xl mx-auto mt-12">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-center mb-2">Filtros de Análise</h2>
          <p className="text-gray-300 text-center text-sm">
            Selecione os filtros para complementar e refinar os dados da tabela
          </p>
        </div>
        
        <Filtros 
          onChange={handleFiltrosChange} 
          opcoesDinamicas={opcoesDinamicas}
          camposDisponiveis={categoriasFixas}
        />
        
        {/* Resumo dos filtros ativos */}
        {Object.keys(filtros).some(k => filtros[k] && filtros[k].length > 0) && (
          <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-300 mb-2">Filtros Ativos (Viraram Colunas):</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filtros).map(([campo, valores]) => {
                if (!valores || valores.length === 0 || valores.includes("Todos")) return null;
                return (
                  <span key={campo} className="bg-purple-600 text-white px-2 py-1 rounded text-xs flex items-center">
                    {nomesFiltros[campo]}: {valores.join(', ')}
                  </span>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Colunas destacadas em roxo são filtros selecionados que complementam a análise
            </p>
          </div>
        )}
      </div>
      
      {/* Card roxo (tabela) */}
      <div className="w-full flex items-center justify-center max-w-4xl mx-auto mt-8 mb-8">
        <div className="bg-purple-700 rounded-3xl p-8 shadow-2xl min-w-0 min-h-[150px] w-full flex flex-col items-center justify-center">
          {/* Cabeçalho da tabela */}
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-black mb-2">Dados Analisados</h2>
            <p className="text-black/70 text-sm mb-2">
              {dadosCruzados.length > 0 
                ? `Mostrando ${dadosCruzados.length} resultado${dadosCruzados.length > 1 ? 's' : ''}`
                : 'Nenhum resultado encontrado'
              }
            </p>
            {Object.keys(filtros).some(k => filtros[k] && filtros[k].length > 0) && (
              <p className="text-black/60 text-xs">
                Colunas destacadas em roxo são filtros selecionados que complementam a análise
              </p>
            )}
          </div>
          
          {/* Barra de rolagem horizontal funcional acima da tabela */}
          <div
            ref={scrollTopRef}
            className="w-full overflow-x-auto mb-2"
            style={{ height: 12 }}
          >
            <div style={{ height: 1 }} />
          </div>
          
          <div ref={tabelaRef} className="w-full overflow-x-auto">
            {dadosCruzados.length > 0 ? (
              <table className="min-w-full text-lg text-center">
                <thead>
                  <tr>
                    {categoriasParaTabela.map(cat => {
                      const isFiltroAtivo = Object.keys(filtros).some(k => 
                        k === cat && filtros[k] && filtros[k].length > 0 && !filtros[k].includes("Todos")
                      );
                      return (
                        <th key={cat} className={`px-4 text-black ${isFiltroAtivo ? 'bg-purple-200' : ''}`}>
                          <div className="flex items-center justify-center">
                            {nomesFiltros[cat] || cat}
                          </div>
                        </th>
                      );
                    })}
                    <th className="px-4 text-black">Admissões</th>
                    <th className="px-4 text-black">Desligamentos</th>
                    <th className="px-4 text-black">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={categoriasParaTabela.length + 3} className="py-8 text-black/70">Carregando...</td></tr>
                  ) : dadosCruzados.length > 0 ? (
                    dadosCruzados.map((item, idx) => (
                      <tr key={idx} className="border-b border-black/20 last:border-0">
                        {categoriasParaTabela.map(cat => {
                          const isFiltroAtivo = Object.keys(filtros).some(k => 
                            k === cat && filtros[k] && filtros[k].length > 0 && !filtros[k].includes("Todos")
                          );
                          return (
                            <td key={cat} className={`px-4 py-2 text-black font-medium ${isFiltroAtivo ? 'bg-purple-50' : ''}`}>
                              {item[cat]}
                            </td>
                          );
                        })}
                        <td className="px-4 py-2 text-black font-medium">{formatarNumero(item.admissoes)}</td>
                        <td className="px-4 py-2 text-black font-medium">{formatarNumero(item.desligamentos)}</td>
                        <td className="px-4 py-2 text-black font-medium">{formatarNumero(item.saldo)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={categoriasParaTabela.length + 3} className="py-8 text-black/70">Nenhum dado encontrado</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center text-white text-lg py-16">
                <span className="text-4xl mb-2">📊</span>
                Nenhum dado para exibir no momento
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
