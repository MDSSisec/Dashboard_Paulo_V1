import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para agrupar dados por categorias
export function agruparDados(
  dados: any[],
  categorias: string[],
  camposNumericos: string[]
): any[] {
  if (!dados || dados.length === 0) {
    console.log("Nenhum dado para agrupar");
    return [];
  }

  console.log(`Agrupando ${dados.length} registros por ${categorias.length} categorias:`, categorias);

  const grupos = new Map<string, any>();

  dados.forEach((item, index) => {
    // Criar chave única para o grupo
    const chave = categorias.map(cat => {
      const valor = item[cat];
      return valor !== undefined && valor !== null ? String(valor) : 'Não informado';
    }).join('|');
    
    if (!grupos.has(chave)) {
      // Inicializar grupo
      const novoGrupo: any = {};
      categorias.forEach(cat => {
        novoGrupo[cat] = item[cat] !== undefined && item[cat] !== null ? String(item[cat]) : 'Não informado';
      });
      camposNumericos.forEach(campo => {
        novoGrupo[campo] = 0;
      });
      grupos.set(chave, novoGrupo);
    }

    // Somar valores numéricos
    const grupo = grupos.get(chave)!;
    camposNumericos.forEach(campo => {
      grupo[campo] += Number(item[campo]) || 0;
    });
  });

  // Ordenar por UF e Ano primeiro, depois pelas outras categorias
  const resultado = Array.from(grupos.values());
  resultado.sort((a, b) => {
    // Ordenar por UF primeiro
    if (a.uf !== b.uf) {
      return a.uf.localeCompare(b.uf);
    }
    // Depois por Ano
    if (a.ano !== b.ano) {
      return a.ano.localeCompare(b.ano);
    }
    // Depois pelas outras categorias
    for (const cat of categorias) {
      if (cat !== 'uf' && cat !== 'ano' && a[cat] !== b[cat]) {
        return a[cat].localeCompare(b[cat]);
      }
    }
    return 0;
  });

  console.log(`Agrupamento concluído: ${resultado.length} grupos criados`);
  return resultado;
}
