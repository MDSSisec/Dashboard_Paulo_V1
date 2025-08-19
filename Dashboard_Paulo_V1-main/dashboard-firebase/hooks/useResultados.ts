// hooks/useResultados.ts
import { useEffect, useMemo, useRef, useState } from "react";

type Filtros = {
  uf: string[];
  ano: number[];
  faixaEtaria: string[];
  sexo: string[];
  racaCor: string[];
  setorEconomico: string[];
  bolsaFamilia: string[];
  situacaoPobreza: string[];
  grauInstrucao: string[];
  cadUnico: string[];
};

export function useResultados(filtros: Partial<Filtros>) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Preparar payload sempre como arrays
  const payload = useMemo(() => ({
    uf: filtros.uf ?? [],
    ano: (filtros.ano ?? []).map(Number),
    faixaEtaria: filtros.faixaEtaria ?? [],
    sexo: filtros.sexo ?? [],
    racaCor: filtros.racaCor ?? [],
    setorEconomico: filtros.setorEconomico ?? [],
    bolsaFamilia: filtros.bolsaFamilia ?? [],
    situacaoPobreza: filtros.situacaoPobreza ?? [],
    grauInstrucao: filtros.grauInstrucao ?? [],
    cadUnico: filtros.cadUnico ?? []
  }), [JSON.stringify(filtros)]);

  useEffect(() => {
    const t = setTimeout(async () => {
      // Cancelar requisição anterior
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      
      setLoading(true);
      setError(null);
      
      try {
        // Primeiro, testar rota de debug
        try {
          const debugResp = await fetch("/api/debug-filtros", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: abortRef.current.signal
          });
          const debugJson = await debugResp.json();
          console.log("🔍 [DEBUG] Resultado:", debugJson);
        } catch (debugError) {
          console.log("⚠️ [DEBUG] Erro na rota de debug:", debugError);
        }

        // Buscar dados reais
        const resp = await fetch("/api/dados-agrupados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: abortRef.current.signal
        });
        
        const json = await resp.json();
        
        if (!json.ok) {
          throw new Error(json.error || "Erro na API");
        }
        
        // Adicionar ID único para cada linha
        const withId = json.rows.map((r: any, i: number) => ({ id: i, ...r }));
        setRows(withId);
        
        console.log("📊 Total recebido:", json.rows.length);
        console.log("📊 Primeira linha:", json.rows[0]);
        
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message || "Falha ao buscar dados");
          setRows([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce de 300ms
    
    return () => clearTimeout(t);
  }, [payload]);

  return { rows, loading, error };
}
