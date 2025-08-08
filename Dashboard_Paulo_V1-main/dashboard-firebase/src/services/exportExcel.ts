import * as XLSX from "xlsx";
import { nomesFiltros } from "@/constants/filters";

// Função para formatar números para melhor leitura
export const formatarNumero = (num: number) => new Intl.NumberFormat('pt-BR').format(num);

// Interface para dados de exportação
export interface DadosExportacao {
  [key: string]: any;
  admissoes: number;
  desligamentos: number;
  saldo: number;
}

// Função para exportar dados para Excel
export const exportarParaExcel = (
  dados: DadosExportacao[], 
  categoriasParaTabela: string[], 
  nomeArquivo: string = "dados_cruzados.xlsx"
) => {
  try {
    // Preparar dados para exportação
    const exportData = dados.map(item => ({
      ...categoriasParaTabela.reduce((acc, cat) => ({ 
        ...acc, 
        [nomesFiltros[cat] || cat]: item[cat] 
      }), {}),
      Admissoes: item.admissoes,
      Desligamentos: item.desligamentos,
      Saldo: item.saldo,
    }));

    // Criar planilha
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados");
    
    // Exportar arquivo
    XLSX.writeFile(wb, nomeArquivo);
    
    console.log(`✅ Arquivo ${nomeArquivo} exportado com sucesso!`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao exportar para Excel:", error);
    return false;
  }
};
