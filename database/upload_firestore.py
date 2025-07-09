import os
import unicodedata
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore

# --- CONFIGURAÇÃO ---
CAMINHO_CREDENCIAL = r"C:\Users\Gabrielle Cristine\Documents\dash-Paulo\database\dashboard-ac748-firebase-adminsdk-fbsvc-87610db52d.json"
CAMINHO_PLANILHAS = r"C:\Users\Gabrielle Cristine\Documents\trabalho\database\arquivos_consolidados\consolidados_formatados_final"
COLECAO_FIRESTORE = "dados"

# --- Inicializar Firebase ---
cred = credentials.Certificate(CAMINHO_CREDENCIAL)
firebase_admin.initialize_app(cred)
db = firestore.client()

# --- Função para remover acentos e padronizar texto ---
def normalizar(texto):
    if isinstance(texto, str):
        texto = unicodedata.normalize("NFKD", texto).encode("ASCII", "ignore").decode("utf-8")
        return texto.upper().strip()
    return texto

# --- Função para carregar cada planilha como uma dimensão ---
def carregar_dimensao(campo, arquivo, coluna_dado, valor_fixo=None):
    caminho = os.path.join(CAMINHO_PLANILHAS, arquivo)
    df = pd.read_excel(caminho)

    print(f"📄 Lendo {arquivo}")
    print("🧾 Colunas disponíveis:", df.columns.tolist())

    if valor_fixo is not None:
        df[campo] = valor_fixo
    else:
        df[campo] = df[coluna_dado].apply(normalizar)

    df["ano"] = df.get("Ano", 0).fillna(0).astype(int)
    df["uf"] = df.get("UF", "").apply(normalizar)
    df["admissoes"] = df.get("Admissões", 0).fillna(0).astype(int)
    df["desligamentos"] = df.get("Desligamentos", 0).fillna(0).astype(int)
    df["saldo"] = df.get("Saldo", 0).fillna(0).astype(int)

    # --- Cria colunas vazias para cruzar com filtros ---
    colunas_finais = [
        "sexo", "bolsaFamilia", "situacaoPobreza", "setorEconomico",
        "racaCor", "grauInstrucao", "faixaEtaria", "cadUnico", "categoria"
    ]
    for col in colunas_finais:
        if col not in df.columns:
            df[col] = ""

    return df[["ano", "uf", "admissoes", "desligamentos", "saldo"] + colunas_finais].fillna("")

# --- Lista de planilhas: campo, arquivo, coluna com valor ou valor fixo ---
planilhas = [
    ("sexo", "Sexo_CONSOLIDADO_TODOS_ANOS.xlsx", "Sexo", None),
    ("bolsaFamilia", "BolsaFamilia_CONSOLIDADO_TODOS_ANOS.xlsx", "Bolsa Familia", None),
    ("situacaoPobreza", "SituacaoPobreza_CONSOLIDADO_TODOS_ANOS.xlsx", "Situação de Pobreza", None),
    ("setorEconomico", "SetorEconomico_CONSOLIDADO_TODOS_ANOS.xlsx", "Setor Econômico", None),
    ("racaCor", "RacaCor_CONSOLIDADO_TODOS_ANOS.xlsx", "Raça/Cor", None),
    ("grauInstrucao", "GrauInstrucao_CONSOLIDADO_TODOS_ANOS.xlsx", "Grau de Instrução", None),
    ("faixaEtaria", "FaixaEtaria_CONSOLIDADO_TODOS_ANOS.xlsx", "Faixa Etária", None),
    ("cadUnico", "CadUnico_CONSOLIDADO_TODOS_ANOS.xlsx", "", "SIM"),  # fixo
    ("categoria", "GERAL_CONSOLIDADO_TODOS_ANOS.xlsx", "Categoria", None),
]

# --- Consolidar todas as bases ---
bases = [carregar_dimensao(*args) for args in planilhas]
df_final = pd.concat(bases, ignore_index=True)

# --- Enviar para o Firestore ---
print(f"📤 Enviando {len(df_final)} documentos para o Firestore...")
for _, row in df_final.iterrows():
    doc = row.to_dict()
    db.collection(COLECAO_FIRESTORE).add(doc)

print("✅ Upload completo!")
