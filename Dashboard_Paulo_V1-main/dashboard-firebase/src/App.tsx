import Filtros from "@/components/ui/Filtros";
import { useEffect, useState, useRef, useMemo, useLayoutEffect } from "react";
import axios from "axios";
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

// Mapeamento das subcategorias para cada categoria
const subcategorias: Record<string, string[]> = {
  bolsaFamilia: ["SIM", "NAO"],
  situacaoPobreza: ["SIM", "NAO"],
  setorEconomico: ["Agronegócio", "Comércio", "Construção", "Indústria", "Serviço"],
  sexo: ["Homem", "Mulher", "Não Identificado"],
  racaCor: ["Amarelo", "Branco", "Indígena", "Não Identificado", "Não Informado", "Pardo", "Preto"],
  grauInstrucao: [
    "5º completo fundamental", "6º a 9º fundamental", "Analfabeto", "Até 5º incompleto",
    "Doutorado", "Fundamental completo", "Médio completo", "Médio incompleto",
    "Mestrado", "Pós-graduação completa", "Superior completo", "Superior incompleto", "Não identificado"
  ],
  faixaEtaria: [
    "18 a 24 anos", "25 a 29 anos", "30 a 39 anos", "40 a 49 anos", "50 a 59 anos",
    "60 a 64 anos", "Acima de 65 anos", "Até 17 anos", "Data de nascimento nula", "Data de nascimento inválida"
  ],
  cadUnico: ["SIM", "NAO", "NÃO"] // Incluir ambas as variações
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
  const [loading, setLoading] = useState(true);
  const [opcoesDinamicas, setOpcoesDinamicas] = useState<Record<string, string[]>>({});
  
  const tabelaRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef<HTMLDivElement>(null);

  // EFEITO PARA BUSCAR DADOS INICIAIS DO POSTGRESQL
  useEffect(() => {
    const buscarDadosIniciais = async () => {
      try {
        setLoading(true);
        console.log("Carregando dados iniciais do PostgreSQL...");
        
        const response = await axios.get("http://localhost:3001/dados");
        const dadosPostgres = response.data;
        
        // Converter dados do PostgreSQL para o formato esperado
        const dadosConvertidos: Dado[] = dadosPostgres.map((item: any) => ({
          estado: item["UF"] || "Não Informado",
          categoria: item["Setor Econômico"] || "Não Informado",
          admissoes: item["Admissoes"] || 0,
          desligamentos: item["Desligamentos"] || 0,
          saldo: item["Saldo"] || 0,
          faixaEtaria: item["Faixa Etária"] || "Não Informado",
          grauInstrucao: item["Grau de Instrução"] || "Não Informado",
          racaCor: item["Raça/Cor"] || "Não Informado",
          setorEconomico: item["Setor Econômico"] || "Não Informado",
          situacaoPobreza: item["Situação de Pobreza"] || "Não Informado",
          ano: item["Ano"]?.toString() || "Não Informado",
          uf: item["UF"] || "Não Informado",
          sexo: item["Sexo"] || "Não Informado",
          bolsaFamilia: item["Bolsa Família"] || "Não Informado",
          cadUnico: item["CadÚnico"] || "Não Informado"
        }));

        const novasOpcoes: Record<string, Set<string>> = {};

        dadosConvertidos.forEach((docData) => {
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
        
        // Usar as subcategorias definidas para garantir que todas as opções estejam disponíveis
        Object.keys(subcategorias).forEach(categoria => {
          if (subcategorias[categoria]) {
            opcoesFinais[categoria] = subcategorias[categoria];
          }
        });
        
        // Adicionar UF e Ano se não existirem
        if (!opcoesFinais.uf) {
          opcoesFinais.uf = [
            "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", 
            "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", 
            "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", 
            "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", 
            "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
          ];
        }
        
        if (!opcoesFinais.ano) {
          opcoesFinais.ano = ["2021", "2022", "2023"];
        }

        console.log(`Dados PostgreSQL carregados: ${dadosConvertidos.length} registros`);
        console.log("Opções de filtro disponíveis:", opcoesFinais);
        
        setDados(dadosConvertidos);
        setOpcoesDinamicas(opcoesFinais);
      } catch (error) {
        console.error("Erro ao buscar dados iniciais do PostgreSQL: ", error);
        setDados([]);
        setOpcoesDinamicas({});
      } finally {
        setLoading(false);
      }
    };

    buscarDadosIniciais();
  }, []);

  // Categorias para tabela - agora inclui filtros selecionados como colunas
  const categoriasParaTabela = useMemo(() => {
    const categoriasBase = ['uf', 'ano'];

    // Adicionar categorias dos filtros ativos
    const categoriasFiltros = Object.keys(filtros).filter(
      (campo) => filtros[campo] && filtros[campo].length > 0 && !filtros[campo].includes("Todos")
    );

    // Combinar categorias base com filtros ativos, removendo duplicatas
    const todasCategorias = [...new Set([...categoriasBase, ...categoriasFiltros])];

    return todasCategorias;
  }, [filtros]);

  // EFEITO PARA BUSCAR DADOS FILTRADOS QUANDO OS FILTROS MUDAM
  useEffect(() => {
    const buscarDadosFiltrados = async () => {
      // Verificar se há filtros ativos
      const filtrosAtivos = Object.keys(filtros).filter(k => 
        filtros[k] && filtros[k].length > 0 && !filtros[k].includes("Todos")
      );
      
      console.log("=== BUSCANDO DADOS ===");
      console.log("Filtros ativos:", filtrosAtivos);
      console.log("Filtros completos:", filtros);
      
      try {
        setLoading(true);
        
        // Construir query parameters
        const queryParams = new URLSearchParams();
        Object.entries(filtros).forEach(([campo, valores]) => {
          if (valores && valores.length > 0 && !valores.includes("Todos")) {
            queryParams.append(campo, valores.join(','));
          }
        });
        
        console.log("Query params:", queryParams.toString());
        
        const url = `http://localhost:3001/dados-agrupados?${queryParams.toString()}`;
        console.log("URL da requisição:", url);
        
        const response = await axios.get(url);
        const dadosAgrupados = response.data;
        
        console.log(`Dados recebidos: ${dadosAgrupados.length} registros`);
        console.log("Primeiro registro:", dadosAgrupados[0]);
        console.log("Todos os dados:", dadosAgrupados);
        console.log("Chaves do primeiro registro:", Object.keys(dadosAgrupados[0] || {}));
        
        // Converter dados do PostgreSQL para o formato esperado
        const dadosConvertidos: Dado[] = dadosAgrupados.map((item: any, index: number) => {
          console.log(`Convertendo item ${index}:`, item);
          console.log(`Chaves do item ${index}:`, Object.keys(item));
          
          const dadoConvertido: Dado = {
            estado: item["UF"] || "Não Informado",
            categoria: item["Setor Econômico"] || "Não Informado",
            admissoes: item["admissoes"] || 0,
            desligamentos: item["desligamentos"] || 0,
            saldo: item["saldo"] || 0,
            faixaEtaria: item["Faixa Etária"] || "Não Informado",
            grauInstrucao: item["Grau de Instrução"] || "Não Informado",
            racaCor: item["Raça/Cor"] || "Não Informado",
            setorEconomico: item["Setor Econômico"] || "Não Informado",
            situacaoPobreza: item["Situação de Pobreza"] || "Não Informado",
            ano: item["Ano"]?.toString() || "Não Informado",
            uf: item["UF"] || "Não Informado",
            sexo: item["Sexo"] || "Não Informado",
            bolsaFamilia: item["Bolsa Família"] || "Não Informado",
            cadUnico: item["CadÚnico"] || "Não Informado"
          };
          
          // Adicionar campos dinâmicos baseados nas categorias da tabela
          const categoriasAtuais = ['uf', 'ano', ...filtrosAtivos];
          console.log(`Categorias atuais para item ${index}:`, categoriasAtuais);
          
          // Mapeamento correto para acessar os dados
          const nomesFiltros: Record<string, string> = {
            uf: "UF",
            ano: "Ano",
            bolsaFamilia: "Bolsa Família",
            situacaoPobreza: "Situação de Pobreza",
            setorEconomico: "Setor Econômico",
            sexo: "Sexo",
            racaCor: "Raça/Cor",
            grauInstrucao: "Grau de Instrução",
            faixaEtaria: "Faixa Etária",
            cadUnico: "CadÚnico"
          };
          
          categoriasAtuais.forEach(cat => {
            const nomeColuna = nomesFiltros[cat];
            console.log(`Mapeando ${cat} -> ${nomeColuna}, valor:`, item[nomeColuna]);
            
            if (nomeColuna) {
              if (cat === 'cadUnico') {
                // Tratamento especial para CadÚnico
                const valorCadUnico = item[nomeColuna];
                console.log(`CadÚnico valor original:`, valorCadUnico);
                if (valorCadUnico === "NAO" || valorCadUnico === "NÃO") {
                  dadoConvertido[cat] = "NÃO";
                } else if (valorCadUnico === "SIM") {
                  dadoConvertido[cat] = "SIM";
                } else {
                  dadoConvertido[cat] = valorCadUnico || "Não Informado";
                }
                console.log(`CadÚnico valor final:`, dadoConvertido[cat]);
              } else if (cat === 'ano') {
                dadoConvertido[cat] = item[nomeColuna]?.toString() || "Não Informado";
              } else {
                dadoConvertido[cat] = item[nomeColuna] || "Não Informado";
              }
            } else {
              dadoConvertido[cat] = item[cat] || "Não Informado";
            }
          });
          
          console.log(`Dado convertido ${index}:`, dadoConvertido);
          return dadoConvertido;
        });
        
        console.log("Todos os dados convertidos:", dadosConvertidos);
        setDados(dadosConvertidos);
        console.log("Estado 'dados' atualizado com:", dadosConvertidos.length, "registros");
        
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        if (error && typeof error === 'object' && 'response' in error) {
          console.error("Detalhes do erro:", (error as any).response?.data || (error as any).message);
        }
        setDados([]);
      } finally {
        setLoading(false);
      }
    };

    buscarDadosFiltrados();
  }, [filtros]); // Removido categoriasParaTabela da dependência

  // Função para atualizar filtros
  const handleFiltrosChange = (novosFiltros: { [key: string]: string[] }) => {
    console.log("=== FILTROS ALTERADOS ===");
    console.log("Filtros anteriores:", filtros);
    console.log("Novos filtros:", novosFiltros);
    
    // Log específico para cada filtro selecionado
    Object.entries(novosFiltros).forEach(([campo, valores]) => {
      if (valores && valores.length > 0 && !valores.includes("Todos")) {
        console.log(`✅ Filtro "${nomesFiltros[campo] || campo}" selecionado:`, valores);
        console.log(`📊 Este filtro vai aparecer como coluna na tabela`);
      }
    });
    
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

  // Dados cruzados - agora usa os dados já agrupados pelo PostgreSQL
  const dadosCruzados = useMemo(() => {
    console.log("=== DADOS CRUZADOS ===");
    console.log("Dados recebidos:", dados);
    console.log("Categorias para tabela:", categoriasParaTabela);
    
    // Os dados já vêm convertidos do PostgreSQL, só precisamos mapear para o formato da tabela
    const resultado = dados.map((item, index) => {
      console.log(`Processando item ${index}:`, item);
      
      const itemFormatado: any = {};

      // Mapear campos baseados nas categorias da tabela
      categoriasParaTabela.forEach(cat => {
        // O item já é um Dado convertido, então podemos acessar diretamente
        if (cat === 'cadUnico') {
          // Tratamento especial para CadÚnico
          const valorCadUnico = item[cat];
          if (valorCadUnico === "NAO" || valorCadUnico === "NÃO") {
            itemFormatado[cat] = "NÃO";
          } else if (valorCadUnico === "SIM") {
            itemFormatado[cat] = "SIM";
          } else {
            itemFormatado[cat] = valorCadUnico || "Não Informado";
          }
        } else if (cat === 'ano') {
          itemFormatado[cat] = item[cat]?.toString() || "Não Informado";
        } else {
          itemFormatado[cat] = item[cat] || "Não Informado";
        }
      });

      // Adicionar campos numéricos
      itemFormatado.admissoes = item.admissoes || 0;
      itemFormatado.desligamentos = item.desligamentos || 0;
      itemFormatado.saldo = item.saldo || 0;

      console.log(`Item formatado ${index}:`, itemFormatado);
      return itemFormatado;
    });

    console.log("Resultado final:", resultado);
    return resultado;
  }, [dados, categoriasParaTabela]);

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
  }, [dadosCruzados]);

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
        
        {/* Botão de teste */}
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ml-2"
          onClick={() => {
            console.log("=== TESTE MANUAL ===");
            console.log("Dados atuais:", dados);
            console.log("Dados cruzados:", dadosCruzados);
            console.log("Categorias para tabela:", categoriasParaTabela);
            console.log("Filtros ativos:", filtros);
            
            if (dados.length > 0) {
              console.log("Primeiro dado:", dados[0]);
              console.log("Chaves do primeiro dado:", Object.keys(dados[0]));
            }
            
            if (dadosCruzados.length > 0) {
              console.log("Primeiro dado cruzado:", dadosCruzados[0]);
              console.log("Chaves do primeiro dado cruzado:", Object.keys(dadosCruzados[0]));
            }
          }}
        >
          Teste Debug
        </button>
      </div>
      
      {/* Card preto (filtros) */}
      <div className="bg-zinc-900 p-6 rounded-md shadow-lg text-white w-full max-w-4xl mx-auto mt-12">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-center mb-2">Filtros de Análise</h2>
          <p className="text-gray-300 text-center text-sm">
            Selecione os filtros para buscar dados específicos do PostgreSQL
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
              <div className="text-black/60 text-xs bg-purple-100 p-2 rounded-lg">
                <p className="font-semibold mb-1">🎯 Filtros Ativos:</p>
                <p>Colunas destacadas em roxo são filtros selecionados que complementam a análise</p>
                <p>Os dados são agrupados por UF, Ano e pelos filtros selecionados</p>
              </div>
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
                        <th key={cat} className={`px-4 text-black ${isFiltroAtivo ? 'bg-purple-200 font-bold' : ''}`}>
                          <div className="flex items-center justify-center">
                            {nomesFiltros[cat] || cat}
                            {isFiltroAtivo && (
                              <span className="ml-1 text-xs bg-purple-600 text-white px-1 rounded">
                                Filtro
                              </span>
                            )}
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
                            <td key={cat} className={`px-4 py-2 text-black font-medium ${isFiltroAtivo ? 'bg-purple-50 border-l-2 border-purple-300' : ''}`}>
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
