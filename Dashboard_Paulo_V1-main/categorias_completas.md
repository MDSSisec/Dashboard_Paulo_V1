# Categorias e Subcategorias - Dashboard

## 📊 **Categorias e Subcategorias Completas**

### **1. Bolsa Família**
```typescript
const bolsaFamilia = [
  "SIM",
  "NAO"
];
```

### **2. Situação de Pobreza**
```typescript
const situacaoPobreza = [
  "SIM",
  "NAO"
];
```

### **3. Setor Econômico**
```typescript
const setorEconomico = [
  "Agronegócio",
  "Comércio",
  "Construção",
  "Indústria",
  "Serviço"
];
```

### **4. Sexo**
```typescript
const sexo = [
  "Homem",
  "Mulher",
  "Não Identificado"
];
```

### **5. Raça/Cor**
```typescript
const racaCor = [
  "Amarelo",
  "Branco",
  "Indígena",
  "Não Identificado",
  "Não Informado",
  "Pardo",
  "Preto"
];
```

### **6. Grau de Instrução**
```typescript
const grauInstrucao = [
  "5º completo fundamental",
  "6º a 9º fundamental",
  "Analfabeto",
  "Até 5º incompleto",
  "Doutorado",
  "Fundamental completo",
  "Médio completo",
  "Médio incompleto",
  "Mestrado",
  "Pós-graduação completa",
  "Superior completo",
  "Superior incompleto",
  "Não identificado"
];
```

### **7. Faixa Etária**
```typescript
const faixaEtaria = [
  "18 a 24 anos",
  "25 a 29 anos",
  "30 a 39 anos",
  "40 a 49 anos",
  "50 a 59 anos",
  "60 a 64 anos",
  "Acima de 65 anos",
  "Até 17 anos",
  "Data de nascimento nula",
  "Data de nascimento inválida"
];
```

### **8. CadÚnico**
```typescript
const cadUnico = [
  "SIM",
  "NÃO"
];
```

### **9. UF (Estados)**
```typescript
const uf = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins"
];
```

### **10. Ano**
```typescript
const ano = [
  "2021",
  "2022",
  "2023"
];
```

---

## 🎯 **Resumo das Categorias:**

| Categoria | Quantidade de Subcategorias |
|-----------|----------------------------|
| Bolsa Família | 2 |
| Situação de Pobreza | 2 |
| Setor Econômico | 5 |
| Sexo | 3 |
| Raça/Cor | 7 |
| Grau de Instrução | 13 |
| Faixa Etária | 10 |
| CadÚnico | 2 |
| UF | 27 |
| Ano | 3 |

**Total: 10 categorias principais**

---

## 🚀 **Como usar com MatrizFiltro:**

```typescript
// Importar as categorias
import { 
  bolsaFamilia,
  situacaoPobreza,
  setorEconomico,
  sexo,
  racaCor,
  grauInstrucao,
  faixaEtaria,
  cadUnico,
  uf,
  ano
} from './categorias';

// Usar no MatrizFiltro
<MatrizFiltro
  options={bolsaFamilia}
  selected={selectedBolsaFamilia}
  onChange={setSelectedBolsaFamilia}
  placeholder="Bolsa Família"
/>
```

---

## ✅ **Vantagens:**

- **Todas as 10 categorias** estão organizadas
- **Subcategorias completas** para cada categoria
- **Pronto para usar** com o MatrizFiltro
- **Sem problemas de piscar** com múltiplas seleções
- **Layout estável** para todas as quantidades

---

*Categorias organizadas para o Dashboard Paulo V1*

