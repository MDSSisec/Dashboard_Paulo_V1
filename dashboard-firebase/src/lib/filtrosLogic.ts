// src/lib/filtrosLogic.ts
import { useState, useEffect, useCallback } from "react";

export type FiltroState = { [key: string]: string[] };

export interface FiltrosLogicProps {
  dados?: any[];
}

export const useFiltrosLogic = ({ dados = [] }: FiltrosLogicProps) => {
  const [filtros, setFiltros] = useState<FiltroState>({});

  // Campos padrão dos filtros
  const camposPadrao = [
    'bolsaFamilia', 'faixaEtaria', 'grauInstrucao', 'racaCor', 
    'setorEconomico', 'sexo', 'cadUnico', 'situacaoPobreza', 
    'ano', 'uf'
  ];

  // Valores padrão para cada campo
  const valoresPadrao: Record<string, string[]> = {
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
    cadUnico: ["SIM", "NAO"],
    uf: [
      "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
    ],
    ano: ["2021", "2022", "2023"]
  };

  // Função para resetar todos os filtros
  const resetarFiltros = useCallback(() => {
    const novosFiltros: FiltroState = {};
    camposPadrao.forEach(campo => {
      novosFiltros[campo] = [];
    });
    setFiltros(novosFiltros);
  }, []);

  // Função para alterar um filtro específico
  const alterarFiltro = useCallback((campo: string, valores: string[]) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valores
    }));
  }, []);

  // Função para verificar se um filtro está ativo
  const isFiltroAtivo = useCallback((campo: string): boolean => {
    return filtros[campo] && filtros[campo].length > 0 && !filtros[campo].includes("Todos");
  }, [filtros]);

  // Função para obter filtros ativos
  const getFiltrosAtivos = useCallback((): string[] => {
    return Object.keys(filtros).filter(k => isFiltroAtivo(k));
  }, [filtros, isFiltroAtivo]);

  // Função para aplicar filtros aos dados
  const aplicarFiltros = useCallback((dados: any[], filtrosAtuais: FiltroState): any[] => {
    // Função auxiliar para verificar se um filtro está ativo
    const isFiltroAtivoLocal = (campo: string): boolean => {
      return filtrosAtuais[campo] && filtrosAtuais[campo].length > 0 && !filtrosAtuais[campo].includes("Todos");
    };

    const chavesFiltroAtivas = Object.keys(filtrosAtuais).filter(isFiltroAtivoLocal);

    if (chavesFiltroAtivas.length === 0) {
      return dados;
    }

    return dados.filter((item) => {
      for (const campo of chavesFiltroAtivas) {
        const valores = filtrosAtuais[campo];
        if (!valores || valores.length === 0) continue;

        const valorItem = item[campo];
        if (valorItem === undefined || valorItem === null) {
          return false;
        }

        const valorItemStr = String(valorItem).trim().toUpperCase();
        const valoresFiltroStr = valores.map(v => String(v).trim().toUpperCase());

        const match = valoresFiltroStr.includes(valorItemStr);
        if (!match) {
          return false;
        }
      }
      return true;
    });
  }, []);

  // Função para obter opções de um campo (dinâmicas ou padrão)
  const getOpcoesCampo = useCallback((campo: string, opcoesDinamicas?: Record<string, string[]>): string[] => {
    if (opcoesDinamicas && opcoesDinamicas[campo] && opcoesDinamicas[campo].length > 0) {
      return opcoesDinamicas[campo];
    }
    
    const opcoesPadrao = valoresPadrao[campo] || [];
    return opcoesPadrao;
  }, []);

  // Função para adicionar opção "Todos" às opções
  const adicionarOpcaoTodos = useCallback((opcoes: string[]): string[] => {
    return ["Todos", ...opcoes.filter((v) => v !== "Todos")];
  }, []);

  // Calcular dados filtrados diretamente sem useEffect
  const dadosFiltrados = aplicarFiltros(dados, filtros);

  // Função para debug dos filtros (comentada para não poluir o console)
  const debugFiltros = useCallback(() => {
    // console.log("=== DEBUG FILTROS ===");
    // console.log("Estado atual dos filtros:", filtros);
    // console.log("Filtros ativos:", getFiltrosAtivos());
    // console.log("Dados originais:", dados.length);
    // console.log("Dados filtrados:", dadosFiltrados.length);
    // console.log("=====================");
  }, [filtros, getFiltrosAtivos, dados.length, dadosFiltrados.length]);

  return {
    // Estado
    filtros,
    dadosFiltrados,
    
    // Funções
    resetarFiltros,
    alterarFiltro,
    isFiltroAtivo,
    getFiltrosAtivos,
    aplicarFiltros,
    getOpcoesCampo,
    adicionarOpcaoTodos,
    debugFiltros,
    
    // Constantes
    camposPadrao,
    valoresPadrao
  };
}; 