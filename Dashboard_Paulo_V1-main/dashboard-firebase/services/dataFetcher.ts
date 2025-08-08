import axios from "axios";
import { Dado } from "@/types/Dado";
import { CATEGORIAS_FIXAS_FILTROS, SUBCATEGORIAS, VALORES_PADRAO } from "@/constants/filters";
import { mockDados } from "@/data/mockDados";
import { URLS_COMPLETAS } from "@/constants/routes";

// Interface para opções dinâmicas
export interface OpcoesDinamicas {
  [key: string]: string[];
}

// Interface para filtros
export interface Filtros {
  [key: string]: string[];
}

// Função para buscar dados iniciais do PostgreSQL
export const buscarDadosIniciais = async (): Promise<{
  dados: Dado[];
  opcoesDinamicas: OpcoesDinamicas;
}> => {
  try {
    console.log("Carregando dados iniciais do PostgreSQL...");
    
    const response = await axios.get(URLS_COMPLETAS.DADOS_INICIAIS);
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
      for (const key of CATEGORIAS_FIXAS_FILTROS) {
        if (docData[key] !== undefined && docData[key] !== null) {
          if (!novasOpcoes[key]) {
            novasOpcoes[key] = new Set<string>();
          }
          novasOpcoes[key].add(String(docData[key]));
        }
      }
    });

    const opcoesFinais: OpcoesDinamicas = {};
    for (const key in novasOpcoes) {
      opcoesFinais[key] = Array.from(novasOpcoes[key]).sort((a, b) => 
        a.localeCompare(b, undefined, { numeric: true })
      );
    }
    
    // Usar as subcategorias definidas para garantir que todas as opções estejam disponíveis
    Object.keys(SUBCATEGORIAS).forEach(categoria => {
      if (SUBCATEGORIAS[categoria]) {
        opcoesFinais[categoria] = SUBCATEGORIAS[categoria];
      }
    });
    
    // Adicionar UF e Ano se não existirem
    if (!opcoesFinais.uf) {
      opcoesFinais.uf = VALORES_PADRAO.uf;
    }
    
    if (!opcoesFinais.ano) {
      opcoesFinais.ano = VALORES_PADRAO.ano;
    }

    console.log(`Dados PostgreSQL carregados: ${dadosConvertidos.length} registros`);
    console.log("Opções de filtro disponíveis:", opcoesFinais);
    
    return {
      dados: dadosConvertidos,
      opcoesDinamicas: opcoesFinais
    };
  } catch (error) {
    console.error("Erro ao buscar dados iniciais do PostgreSQL: ", error);
    console.log("Usando dados mock como fallback...");
    
    // Retornar dados mock em caso de erro
    return {
      dados: mockDados,
      opcoesDinamicas: VALORES_PADRAO
    };
  }
};

// Função para buscar dados filtrados
export const buscarDadosFiltrados = async (filtros: Filtros): Promise<Dado[]> => {
  try {
    // Verificar se há filtros ativos
    const filtrosAtivos = Object.keys(filtros).filter(k => 
      filtros[k] && filtros[k].length > 0 && !filtros[k].includes("Todos")
    );
    
    console.log("=== BUSCANDO DADOS ===");
    console.log("Filtros ativos:", filtrosAtivos);
    console.log("Filtros completos:", filtros);
    
    // Construir query parameters
    const queryParams = new URLSearchParams();
    Object.entries(filtros).forEach(([campo, valores]) => {
      if (valores && valores.length > 0 && !valores.includes("Todos")) {
        queryParams.append(campo, valores.join(','));
      }
    });
    
    console.log("Query params:", queryParams.toString());
    
    const url = `${URLS_COMPLETAS.DADOS_AGRUPADOS}?${queryParams.toString()}`;
    console.log("URL da requisição:", url);
    
    const response = await axios.get(url);
    const dadosAgrupados = response.data;
    
    console.log(`Dados recebidos: ${dadosAgrupados.length} registros`);
    
    // Converter dados do PostgreSQL para o formato esperado
    const dadosConvertidos: Dado[] = dadosAgrupados.map((item: any, index: number) => {
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
        
        if (nomeColuna) {
          if (cat === 'cadUnico') {
            // Tratamento especial para CadÚnico
            const valorCadUnico = item[nomeColuna];
            if (valorCadUnico === "NAO" || valorCadUnico === "NÃO") {
              dadoConvertido[cat] = "NÃO";
            } else if (valorCadUnico === "SIM") {
              dadoConvertido[cat] = "SIM";
            } else {
              dadoConvertido[cat] = valorCadUnico || "Não Informado";
            }
          } else if (cat === 'ano') {
            dadoConvertido[cat] = item[nomeColuna]?.toString() || "Não Informado";
          } else {
            dadoConvertido[cat] = item[nomeColuna] || "Não Informado";
          }
        } else {
          dadoConvertido[cat] = item[cat] || "Não Informado";
        }
      });
      
      return dadoConvertido;
    });
    
    console.log("Todos os dados convertidos:", dadosConvertidos);
    return dadosConvertidos;
    
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error("Detalhes do erro:", (error as any).response?.data || (error as any).message);
    }
    console.log("Usando dados mock como fallback...");
    return mockDados;
  }
};

// Função para filtrar dados localmente (fallback)
export const filtrarDados = (dados: Dado[], filtros: Filtros): Dado[] => {
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
};
