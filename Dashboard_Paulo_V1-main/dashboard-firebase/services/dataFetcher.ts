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

// Função para buscar opções de filtros dinamicamente do PostgreSQL
export const buscarOpcoesFiltros = async (): Promise<OpcoesDinamicas> => {
  try {
    console.log("🔍 Carregando opções de filtros do PostgreSQL...");
    
    const response = await axios.get(URLS_COMPLETAS.OPCOES_FILTROS, {
      timeout: 10000, // 10 segundos de timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.data.success) {
      const opcoesDoBanco = response.data.opcoes;
      console.log("✅ Opções de filtros carregadas do banco:", Object.keys(opcoesDoBanco));
      
      // Log detalhado de cada categoria
      Object.entries(opcoesDoBanco).forEach(([categoria, valores]) => {
        console.log(`📊 ${categoria}: ${(valores as string[]).length} opções`);
        console.log(`   Valores: [${(valores as string[]).slice(0, 5).join(', ')}${(valores as string[]).length > 5 ? '...' : ''}]`);
      });
      
      return opcoesDoBanco;
    } else {
      throw new Error("Resposta do servidor não indica sucesso");
    }
  } catch (error) {
    console.error("❌ Erro ao buscar opções de filtros do PostgreSQL: ", error);
    console.log("🔄 Usando valores padrão como fallback...");
    
    // Retornar valores padrão em caso de erro
    return VALORES_PADRAO;
  }
};

// Função para buscar dados iniciais do PostgreSQL
export const buscarDadosIniciais = async (): Promise<{
  dados: Dado[];
  opcoesDinamicas: OpcoesDinamicas;
}> => {
  try {
    console.log("Carregando dados iniciais do PostgreSQL...");
    
    // Buscar opções de filtros dinamicamente primeiro
    const opcoesDinamicas = await buscarOpcoesFiltros();
    
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

    console.log(`Dados PostgreSQL carregados: ${dadosConvertidos.length} registros`);
    console.log("Opções de filtro disponíveis:", opcoesDinamicas);
    
    return {
      dados: dadosConvertidos,
      opcoesDinamicas: opcoesDinamicas
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

// Função para buscar dados filtrados (CORRIGIDA - SUBCATEGORIAS)
export const buscarDadosFiltrados = async (filtros: Filtros): Promise<Dado[]> => {
  try {
    // Verificar se há filtros ativos
    const filtrosAtivos = Object.keys(filtros).filter(k => 
      filtros[k] && filtros[k].length > 0 && !filtros[k].includes("Todos")
    );
    
    console.log("=== BUSCANDO DADOS ===");
    console.log("Filtros ativos:", filtrosAtivos);
    console.log("Filtros completos:", filtros);
    
         // Preparar dados para envio via POST - GARANTIR ARRAYS
     const body = {
       bolsaFamilia: filtros.bolsaFamilia,
       situacaoPobreza: filtros.situacaoPobreza,
       setorEconomico: filtros.setorEconomico,
       sexo: filtros.sexo,
       racaCor: filtros.racaCor,
       grauInstrucao: filtros.grauInstrucao,
       faixaEtaria: filtros.faixaEtaria,
       cadUnico: filtros.cadUnico,
       uf: filtros.uf,
       ano: filtros.ano
     };
     
     // Garantir que cada campo é null OU array (nunca "A,B" string)
     Object.keys(body).forEach(k => {
       const v = (body as any)[k];
       if (v && !Array.isArray(v)) (body as any)[k] = [v];
       if (Array.isArray(v) && v.length === 0) (body as any)[k] = null;
       // Filtrar valores vazios e "Todos" - CORRIGIDO: manter arrays vazios como [] em vez de null
       if (Array.isArray(v) && v.length > 0) {
         const valoresValidos = v.filter(val => val && val !== "Todos" && val !== "" && val !== "null");
         (body as any)[k] = valoresValidos.length > 0 ? valoresValidos : [];
       }
     });
    
         console.log("🔗 Dados dos filtros enviados:", body);
     
     // Log detalhado de cada filtro enviado
     Object.entries(body).forEach(([campo, valores]) => {
       if (valores) {
         console.log(`📤 Enviando ${campo}: ${valores.length} valores - [${valores.join(', ')}]`);
       } else {
         console.log(`📤 Enviando ${campo}: NULL (sem restrição)`);
       }
     });
     
     // DEBUG TEMPORÁRIO - Testar rota de debug
     try {
       const resp = await fetch("/api/debug-filtros", {
         method: "POST", 
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify(body)   // exatamente o objeto que você manda ao /dados
       });
       const debugResult = await resp.json();
       console.log("🔍 [DEBUG] Resultado da rota de debug:", debugResult);
     } catch (debugError) {
       console.log("⚠️ [DEBUG] Erro na rota de debug:", debugError.message);
     }
    
    // Usar POST para enviar arrays complexos
    const response = await axios.post(URLS_COMPLETAS.DADOS_AGRUPADOS, body, {
      timeout: 15000, // 15 segundos de timeout para filtros
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log("📊 [FRONTEND] ===== RESPOSTA DA API =====");
    console.log("📊 [FRONTEND] Status da resposta:", response.status);
    
    // Verificar se a resposta tem a estrutura correta
    if (response.data && response.data.ok && response.data.rows) {
      const dadosAgrupados = response.data.rows;
      console.log("📊 [FRONTEND] Total de registros recebidos:", dadosAgrupados.length);
      
      if (dadosAgrupados.length > 0) {
        console.log("📊 [FRONTEND] Primeira linha recebida:", JSON.stringify(dadosAgrupados[0], null, 2));
        console.log("📊 [FRONTEND] Campos da primeira linha:", Object.keys(dadosAgrupados[0]));
      } else {
        console.log("📊 [FRONTEND] Nenhum registro recebido da API");
      }
    } else {
      console.log("📊 [FRONTEND] Resposta não tem estrutura esperada:", response.data);
      return [];
    }
    
    console.log("📊 [FRONTEND] ===== FIM DA RESPOSTA =====");
    
    const dadosAgrupados = response.data.rows || [];
    console.log(`Dados recebidos: ${dadosAgrupados.length} registros`);
    
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
      
      // Adicionar campos dinâmicos baseados nas categorias da tabela
      const categoriasAtuais = ['uf', 'ano', ...filtrosAtivos];
      
      // Mapeamento correto para acessar os dados (backend retorna snake_case)
      const nomesFiltros: Record<string, string> = {
        uf: "uf",
        ano: "ano",
        bolsaFamilia: "bolsa_familia",
        situacaoPobreza: "situacao_pobreza",
        setorEconomico: "setor_economico",
        sexo: "sexo",
        racaCor: "raca_cor",
        grauInstrucao: "grau_instrucao",
        faixaEtaria: "faixa_etaria",
        cadUnico: "cad_unico"
      };
      
      // Função para normalizar valores de volta para exibição
      const normalizarParaExibicao = (valor: any, campo: string) => {
        if (!valor) return "Não Informado";
        
        const valorStr = String(valor).trim();
        
                 // Mapeamento específico para cada campo
         const mapeamentoExibicao: Record<string, Record<string, string>> = {
           faixaEtaria: {
             "18 A 24 ANOS": "18 a 24 anos",
             "25 A 29 ANOS": "25 a 29 anos",
             "30 A 39 ANOS": "30 a 39 anos",
             "40 A 49 ANOS": "40 a 49 anos",
             "50 A 59 ANOS": "50 a 59 anos",
             "60 A 64 ANOS": "60 a 64 anos",
             "ACIMA DE 65 ANOS": "Acima de 65 anos",
             "ATE 17 ANOS": "Até 17 anos",
             "DATA DE NASCIMENTO NULA": "Data de nascimento nula",
             "DATA DE NASCIMENTO INVALIDA": "Data de nascimento inválida",
             "Não Informado": "Não Informado"
           },
           cadUnico: {
             "NAO": "NÃO",
             "SIM": "SIM",
             "Não Informado": "Não Informado"
           },
           bolsaFamilia: {
             "NAO": "NÃO",
             "SIM": "SIM",
             "Não Informado": "Não Informado"
           },
           situacaoPobreza: {
             "NAO": "NÃO",
             "SIM": "SIM",
             "Não Informado": "Não Informado"
           },
           sexo: {
             "Não Informado": "Não Informado"
           },
           racaCor: {
             "Não Informado": "Não Informado"
           },
           setorEconomico: {
             "Não Informado": "Não Informado"
           },
           grauInstrucao: {
             "Não Informado": "Não Informado"
           }
         };
        
        const mapeamento = mapeamentoExibicao[campo];
        if (mapeamento && mapeamento[valorStr]) {
          return mapeamento[valorStr];
        }
        
        return valorStr;
      };
      
      categoriasAtuais.forEach(cat => {
        const nomeColuna = nomesFiltros[cat];
        
        if (nomeColuna) {
          if (cat === 'ano') {
            dadoConvertido[cat] = item[nomeColuna]?.toString() || "Não Informado";
          } else {
            const valorBruto = item[nomeColuna];
            dadoConvertido[cat] = normalizarParaExibicao(valorBruto, cat);
          }
        } else {
          dadoConvertido[cat] = item[cat] || "Não Informado";
        }
      });
      
      return dadoConvertido;
    });
    
         console.log("Todos os dados convertidos:", dadosConvertidos);
     console.log(`✅ Total final: ${dadosConvertidos.length} registros (SEM LIMITAÇÃO)`);
     
     // LOG ADICIONAL - Verificar se não há limitações
     console.log("🔍 [VERIFICAÇÃO] Dados recebidos do backend:", dadosAgrupados.length);
     console.log("🔍 [VERIFICAÇÃO] Dados convertidos para frontend:", dadosConvertidos.length);
     console.log("🔍 [VERIFICAÇÃO] Primeiro registro:", dadosConvertidos[0]);
     console.log("🔍 [VERIFICAÇÃO] Último registro:", dadosConvertidos[dadosConvertidos.length - 1]);
     
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
