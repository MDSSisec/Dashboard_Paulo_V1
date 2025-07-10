import Filtros from "@/components/ui/Filtros";
import { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as XLSX from "xlsx";

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

function filtrarDados(dados: Dado[], filtros: { [key: string]: string[] }): Dado[] {
  const resultado = dados.filter((item) => {
    // Função para normalizar valores (remover acentos, converter para maiúsculo, etc)
    const normalizar = (valor: any) => {
      if (valor === undefined || valor === null) return "";
      return String(valor).normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();
    };

    // Para cada filtro, se não estiver vazio e não for 'Todos', filtra
    const check = (campo: any, valores: string[]) => {
      if (!valores || valores.length === 0 || valores.includes("Todos")) return true;
      const campoNorm = normalizar(campo);
      const valoresNorm = valores.map(normalizar);
      return campoNorm && valoresNorm.includes(campoNorm);
    };
    
    // Verificar todos os filtros aplicados
    for (const [campo, valores] of Object.entries(filtros)) {
      const valorItem = item[campo];
      if (!check(valorItem, valores)) {
        return false;
      }
    }
    return true;
  });
  
  console.log(`📊 Filtros aplicados: ${Object.keys(filtros).filter(k => filtros[k].length > 0).join(', ') || 'Nenhum'} | Dados: ${dados.length} → ${resultado.length}`);
  return resultado;
}

export default function App() {
  const [filtros, setFiltros] = useState<{ [key: string]: string[] }>({});
  const [dados, setDados] = useState<Dado[]>([]);
  const [loading, setLoading] = useState(false);
  const [camposDisponiveis, setCamposDisponiveis] = useState<string[]>([]);
  const [opcoesDinamicas, setOpcoesDinamicas] = useState<{
    faixaEtaria: string[];
    grauInstrucao: string[];
    racaCor: string[];
    setorEconomico: string[];
    situacaoPobreza: string[];
    ano: string[];
    uf: string[];
    [key: string]: string[];
  }>({
    faixaEtaria: [],
    grauInstrucao: [],
    racaCor: [],
    setorEconomico: [],
    situacaoPobreza: [],
    ano: [],
    uf: [],
  });
  const tabelaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      console.log("🔄 Carregando dados do Firebase...");
      try {
        let q = collection(db, "dados");
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => doc.data() as Dado);
        
        setDados(docs);
        console.log(`✅ Dados carregados: ${docs.length} registros`);
        
        // Descobrir campos existentes dinamicamente
        if (docs.length > 0) {
          const primeiroDoc = docs[0];
          const camposExistentes = Object.keys(primeiroDoc);
          setCamposDisponiveis(camposExistentes);
          
          // Gerar opções dinâmicas para todos os campos
          const opcoesGeradas: { [key: string]: string[] } = {};
          camposExistentes.forEach(campo => {
            const valoresUnicos = Array.from(new Set(docs.map((d: any) => d[campo as keyof Dado]).filter(Boolean))) as string[];
            opcoesGeradas[campo] = valoresUnicos;
          });
          
          setOpcoesDinamicas({
            faixaEtaria: opcoesGeradas.faixaEtaria || [],
            grauInstrucao: opcoesGeradas.grauInstrucao || [],
            racaCor: opcoesGeradas.racaCor || [],
            setorEconomico: opcoesGeradas.setorEconomico || [],
            situacaoPobreza: opcoesGeradas.situacaoPobreza || [],
            ano: opcoesGeradas.ano || [],
            uf: opcoesGeradas.uf || [],
            ...opcoesGeradas
          });
          
          console.log(`🎯 Campos disponíveis: ${camposExistentes.join(', ')}`);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const dadosFiltrados = filtrarDados(dados, filtros);

  return (
    <div className="bg-black">
      {/* Botão fixo no canto superior esquerdo */}
      <div className="fixed top-4 left-4 z-50">
        <button
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={() => {
            const exportData = dadosFiltrados.map(item => ({
              Categoria: item.categoria,
              Admissoes: item.admissoes,
              Desligamentos: item.desligamentos,
              Saldo: item.saldo,
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Dados");
            XLSX.writeFile(wb, "dados_filtrados.xlsx");
          }}
        >
          Exportar para Excel
        </button>
      </div>
      {/* Card preto (filtros) */}
      <div className="bg-zinc-900 p-6 rounded-md shadow-lg text-white w-full max-w-4xl mx-auto mt-12">
        <Filtros 
          onChange={setFiltros} 
          opcoesDinamicas={opcoesDinamicas}
          camposDisponiveis={camposDisponiveis}
        />
      </div>
      {/* Card roxo (tabela) */}
      <div ref={tabelaRef} className="w-full flex items-center justify-center max-w-4xl mx-auto mt-8">
        <div className="bg-purple-700 rounded-3xl p-8 shadow-2xl min-w-0 min-h-[150px] w-full flex flex-col items-center justify-center">
          <div className="w-full overflow-x-auto">
            {dadosFiltrados.length > 0 ? (
              <table className="min-w-full text-lg text-center">
                <thead>
                  <tr>
                    <th className="px-4 text-black">Categorias</th>
                    <th className="px-4 text-black">UF</th>
                    <th className="px-4 text-black">Admissões</th>
                    <th className="px-4 text-black">Desligamentos</th>
                    <th className="px-4 text-black">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="py-8 text-black/70">Carregando...</td></tr>
                  ) : dadosFiltrados.length > 0 ? (
                    dadosFiltrados.map((item, idx) => (
                      <tr key={idx} className="border-b border-black/20 last:border-0">
                        <td className="px-4 py-2 text-black font-medium">{item.categoria}</td>
                        <td className="px-4 py-2 text-black font-medium">{item.uf}</td>
                        <td className="px-4 py-2 text-black font-medium">{item.admissoes}</td>
                        <td className="px-4 py-2 text-black font-medium">{item.desligamentos}</td>
                        <td className="px-4 py-2 text-black font-medium">{item.saldo}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-black/70">Nenhum dado encontrado</td>
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
