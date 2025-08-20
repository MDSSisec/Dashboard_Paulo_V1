import axios from "axios";
import { Dado } from "../types/Dado";
import { CATEGORIAS_FIXAS_FILTROS, SUBCATEGORIAS, VALORES_PADRAO } from "../constants/filters";
import { mockDados } from "../data/mockDados";
import { URLS_COMPLETAS } from "../constants/routes";

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
    const response = await axios.get(URLS_COMPLETAS.DADOS_INICIAIS, {
      timeout: 10000, // 10 segundos de timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const dadosPostgres = response.data;
    
    if (!Array.isArray(dadosPostgres)) {
      throw new Error("Dados recebidos não são um array válido");
    }
    
    // Converter dados do PostgreSQL para o formato esperado
    const dadosConvertidos: Dado[] = dadosPostgres.map((item: any, index: number) => {
      try {
        return {
          estado: item["uf"] || item["UF"] || "Não Informado",
          categoria: item["setor_economico"] || item["Setor Econômico"] || "Não Informado",
          admissoes: parseInt(item["admissoes"] || item["Admissoes"]) || 0,
          desligamentos: parseInt(item["desligamentos"] || item["Desligamentos"]) || 0,
          saldo: parseInt(item["saldo"] || item["Saldo"]) || 0,
          faixaEtaria: item["faixa_etaria"] || item["Faixa Etária"] || "Não Informado",
          grauInstrucao: item["grau_instrucao"] || item["Grau de Instrução"] || "Não Informado",
          racaCor: item["raca_cor"] || item["Raça/Cor"] || "Não Informado",
          setorEconomico: item["setor_economico"] || item["Setor Econômico"] || "Não Informado",
          situacaoPobreza: item["situacao_pobreza"] || item["Situação de Pobreza"] || "Não Informado",
          ano: (item["ano"] || item["Ano"])?.toString() || "Não Informado",
          uf: item["uf"] || item["UF"] || "Não Informado",
          sexo: item["sexo"] || item["Sexo"] || "Não Informado",
          bolsaFamilia: item["bolsa_familia"] || item["Bolsa Família"] || "Não Informado",
          cadUnico: item["cad_unico"] || item["CadÚnico"] || "Não Informado"
        };
      } catch (error) {
        console.error(`❌ Erro ao converter item ${index}:`, error);
        return {
          estado: "Erro",
          categoria: "Erro",
          admissoes: 0,
          desligamentos: 0,
          saldo: 0,
          faixaEtaria: "Erro",
          grauInstrucao: "Erro",
          racaCor: "Erro",
          setorEconomico: "Erro",
          situacaoPobreza: "Erro",
          ano: "Erro",
          uf: "Erro",
          sexo: "Erro",
          bolsaFamilia: "Erro",
          cadUnico: "Erro"
        };
      }
    });

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
    
    // Garantir que cada categoria tenha suas opções corretas
    // Se não há dados dinâmicos, usar as opções padrão
    Object.keys(SUBCATEGORIAS).forEach(categoria => {
      if (!opcoesFinais[categoria] || opcoesFinais[categoria].length === 0) {
        opcoesFinais[categoria] = SUBCATEGORIAS[categoria];
      }
    });
    
    // Garantir que UF e Ano tenham suas opções corretas
    if (!opcoesFinais.uf || opcoesFinais.uf.length === 0) {
      opcoesFinais.uf = VALORES_PADRAO.uf;
    }
    
    if (!opcoesFinais.ano || opcoesFinais.ano.length === 0) {
      opcoesFinais.ano = VALORES_PADRAO.ano;
    }

    return {
      dados: dadosConvertidos,
      opcoesDinamicas: opcoesFinais
    };
  } catch (error) {
    console.error("Erro ao buscar dados iniciais do PostgreSQL: ", error);
    
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
    
    // Preparar dados para envio
    const dadosFiltros: Record<string, string[]> = {};
    Object.entries(filtros).forEach(([campo, valores]) => {
      if (valores && valores.length > 0 && !valores.includes("Todos")) {
        dadosFiltros[campo] = valores;
      }
    });
    
    // Usar POST para enviar arrays complexos
    const response = await axios.post(URLS_COMPLETAS.DADOS_AGRUPADOS, dadosFiltros, {
      timeout: 15000, // 15 segundos de timeout para filtros
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const dadosAgrupados = response.data.rows || response.data;
    
    if (!dadosAgrupados || !Array.isArray(dadosAgrupados)) {
      console.error("❌ Dados inválidos recebidos:", response.data);
      return [];
    }
    
         // Verificar anos únicos nos dados recebidos
     const anosUnicos = [...new Set(dadosAgrupados.map((item: any) => item["ano"]))].sort();
     
     // Converter dados do PostgreSQL para o formato esperado
     const dadosConvertidos: Dado[] = dadosAgrupados.map((item: any, index: number) => {
      
      const dadoConvertido: Dado = {
        estado: item["uf"] || "Não Informado",
        categoria: item["setor_economico"] || "Não Informado",
        admissoes: item["admissoes"] || 0,
        desligamentos: item["desligamentos"] || 0,
        saldo: item["saldo"] || 0,
        faixaEtaria: item["faixa_etaria"] || "Não Informado",
        grauInstrucao: item["grau_instrucao"] || "Não Informado",
        racaCor: item["raca_cor"] || "Não Informado",
        setorEconomico: item["setor_economico"] || "Não Informado",
        situacaoPobreza: item["situacao_pobreza"] || "Não Informado",
        ano: item["ano"]?.toString() || "Não Informado",
        uf: item["uf"] || "Não Informado",
        sexo: item["sexo"] || "Não Informado",
        bolsaFamilia: item["bolsa_familia"] || "Não Informado",
        cadUnico: item["cad_unico"] || "Não Informado"
      };
      
      
      
      return dadoConvertido;
    });
    
         return dadosConvertidos;
    
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error("Detalhes do erro:", (error as any).response?.data || (error as any).message);
    }
    return mockDados;
  }
};

// Função para filtrar dados localmente (fallback)
export const filtrarDados = (dados: Dado[], filtros: Filtros): Dado[] => {
  const chavesFiltroAtivas = Object.keys(filtros).filter(
    (k) => filtros[k] && filtros[k].length > 0 && !filtros[k].includes("Todos")
  );

  if (chavesFiltroAtivas.length === 0) {
    return dados;
  }

  const resultado = dados.filter((item, index) => {
    for (const campo of chavesFiltroAtivas) {
      const valores = filtros[campo];
      const valorItem = item[campo];
      
      // Verificação mais robusta
      const valorItemStr = String(valorItem || "").trim().toUpperCase();
      const valoresFiltroStr = valores.map(v => String(v).trim().toUpperCase());
      
      const match = valoresFiltroStr.includes(valorItemStr);
      
      if (!match) {
        return false;
      }
    }
    
    return true;
  });
  
  return resultado;
};
