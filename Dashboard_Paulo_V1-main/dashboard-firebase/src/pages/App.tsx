import { useEffect, useState, useRef, useMemo, useLayoutEffect } from "react";
import Filtros from "@/components/ui/Filtros";
import { Dado } from "@/types/Dado";
import { nomesFiltros } from "@/constants/filters";
import { CATEGORIAS_BASE } from "@/constants/categories";
import { LABELS, STATUS } from "@/constants/ui";
import { buscarDadosIniciais, buscarDadosFiltrados, Filtros as FiltrosType } from "@/services/dataFetcher";
import { exportarParaExcel, formatarNumero } from "@/services/exportExcel";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableHeadNumeric,
  TableRow, 
  TableCell, 
  TableCellNumeric 
} from "@/components/ui/table";

export default function App() {
  const [filtros, setFiltros] = useState<FiltrosType>({});
  const [dados, setDados] = useState<Dado[]>([]);
  const [loading, setLoading] = useState(true);
  const [opcoesDinamicas, setOpcoesDinamicas] = useState<Record<string, string[]>>({});
  
  const tabelaRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef<HTMLDivElement>(null);

  // EFEITO PARA BUSCAR DADOS INICIAIS
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        setLoading(true);
        const { dados: dadosIniciais, opcoesDinamicas: opcoes } = await buscarDadosIniciais();
        setDados(dadosIniciais);
        setOpcoesDinamicas(opcoes);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        setDados([]);
        setOpcoesDinamicas({});
      } finally {
        setLoading(false);
      }
    };

    carregarDadosIniciais();
  }, []);

  // Categorias para tabela - agora inclui filtros selecionados como colunas
  const categoriasParaTabela = useMemo(() => {
    const categoriasBase = CATEGORIAS_BASE;

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
    // Verificar se há filtros ativos
    const filtrosAtivos = Object.keys(filtros).filter(k => 
      filtros[k] && filtros[k].length > 0 && !filtros[k].includes("Todos")
    );
    
    // Se não há filtros ativos, não fazer requisição
    if (filtrosAtivos.length === 0) {
      return;
    }
    
    const carregarDadosFiltrados = async () => {
      try {
        setLoading(true);
        const dadosFiltrados = await buscarDadosFiltrados(filtros);
        setDados(dadosFiltrados);
      } catch (error) {
        console.error("Erro ao buscar dados filtrados:", error);
        setDados([]);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosFiltrados();
  }, [filtros]);

  // Função para atualizar filtros
  const handleFiltrosChange = (novosFiltros: FiltrosType) => {
    setFiltros(novosFiltros);
  };

  // Dados cruzados - agora usa os dados já agrupados pelo PostgreSQL
  const dadosCruzados = useMemo(() => {
    // Os dados já vêm convertidos do PostgreSQL, só precisamos mapear para o formato da tabela
    const resultado = dados.map((item, index) => {
      
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

      return itemFormatado;
    });

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
            exportarParaExcel(dadosCruzados, categoriasParaTabela);
          }}
        >
          {LABELS.EXPORTAR}
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
          camposDisponiveis={Object.keys(opcoesDinamicas)}
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
      
      {/* Card da tabela */}
      <div className="w-full flex items-center justify-center max-w-4xl mx-auto mt-8 mb-8">
        <div className="bg-white rounded-3xl p-8 shadow-2xl min-w-0 min-h-[150px] w-full flex flex-col items-center justify-center border border-slate-200">
          {/* Cabeçalho da tabela */}
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Dados Analisados</h2>
            <p className="text-slate-600 text-sm mb-2">
              {dadosCruzados.length > 0 
                ? `Mostrando ${dadosCruzados.length} resultado${dadosCruzados.length > 1 ? 's' : ''}`
                : 'Nenhum resultado encontrado'
              }
            </p>
            {Object.keys(filtros).some(k => filtros[k] && filtros[k].length > 0) && (
              <div className="text-slate-600 text-xs bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <p className="font-semibold mb-1 text-indigo-800">🎯 Filtros Ativos:</p>
                <p>Colunas destacadas em azul são filtros selecionados que complementam a análise</p>
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
          
          <div ref={tabelaRef} className="w-full">
            {dadosCruzados.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {categoriasParaTabela.map(cat => {
                      const isFiltroAtivo = Object.keys(filtros).some(k => 
                        k === cat && filtros[k] && filtros[k].length > 0 && !filtros[k].includes("Todos")
                      );
                      return (
                        <TableHead key={cat} className={isFiltroAtivo ? 'bg-indigo-100' : ''}>
                          <div className="flex items-center justify-center">
                            {nomesFiltros[cat] || cat}
                            {isFiltroAtivo && (
                              <span className="ml-1 text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                                Filtro
                              </span>
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                    <TableHeadNumeric>Admissões</TableHeadNumeric>
                    <TableHeadNumeric>Desligamentos</TableHeadNumeric>
                    <TableHeadNumeric>Saldo</TableHeadNumeric>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={categoriasParaTabela.length + 3} className="py-8 text-center text-slate-500">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : dadosCruzados.length > 0 ? (
                    dadosCruzados.map((item, idx) => (
                      <TableRow key={idx}>
                        {categoriasParaTabela.map(cat => {
                          const isFiltroAtivo = Object.keys(filtros).some(k => 
                            k === cat && filtros[k] && filtros[k].length > 0 && !filtros[k].includes("Todos")
                          );
                          return (
                            <TableCell key={cat} className={isFiltroAtivo ? 'bg-indigo-50 border-l-2 border-indigo-300' : ''}>
                              {item[cat]}
                            </TableCell>
                          );
                        })}
                        <TableCellNumeric>{formatarNumero(item.admissoes)}</TableCellNumeric>
                        <TableCellNumeric>{formatarNumero(item.desligamentos)}</TableCellNumeric>
                        <TableCellNumeric>{formatarNumero(item.saldo)}</TableCellNumeric>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={categoriasParaTabela.length + 3} className="py-8 text-center text-slate-500">
                        Nenhum dado encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-600 text-lg py-16">
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
