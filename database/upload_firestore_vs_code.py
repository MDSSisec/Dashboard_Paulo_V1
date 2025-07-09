import os
import time
import pandas as pd
from unidecode import unidecode
from google.cloud import firestore

# Caminho base das planilhas
CAMINHO_BASE = r"C:\Users\Gabrielle Cristine\Documents\trabalho - backup\database\planilhas"

# Caminho da chave do Firebase
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\Gabrielle Cristine\Documents\dash Paulo\dashboard-ac748-firebase-adminsdk-fbsvc-e18c5e1c7f.json"

# Conecta ao Firestore
db = firestore.Client()

def padronizar_coluna(col):
    return unidecode(col).strip().replace(" ", "_").lower()

def processar_arquivo(caminho_arquivo, ano, categoria):
    nome_arquivo = os.path.basename(caminho_arquivo)
    print(f"📄 Lendo: {nome_arquivo}")
    try:
        df = pd.read_excel(caminho_arquivo)
    except Exception as e:
        print(f"❌ Erro ao ler {nome_arquivo}: {e}")
        return

    df.columns = [padronizar_coluna(c) for c in df.columns]
    condicao = os.path.splitext(nome_arquivo)[0].split("_")[-1].lower()

    if "sigla_uf" not in df.columns or "uf" not in df.columns:
        print(f"⚠️ Colunas obrigatórias ausentes em: {nome_arquivo}")
        return

    df = df.dropna(subset=["uf", "sigla_uf"])

    for _, row in df.iterrows():
        sigla = str(row["sigla_uf"]).strip()
        dados = row.to_dict()
        try:
            doc_ref = (
                db.collection("dados")
                .document(ano)
                .collection(categoria)
                .document(condicao)
                .collection("uf")
                .document(sigla)
            )
            doc_ref.set(dados)
            time.sleep(0.3)  # Evita quota exceeded
        except Exception as e:
            print(f"❌ Erro ao enviar dados de {sigla} em {nome_arquivo}: {e}")
    print(f"✅ Enviado: {nome_arquivo}")

def processar_planilhas(caminho_base):
    for ano in os.listdir(caminho_base):
        caminho_ano = os.path.join(caminho_base, ano)
        if not os.path.isdir(caminho_ano):
            continue

        for item in os.listdir(caminho_ano):
            caminho_item = os.path.join(caminho_ano, item)

            if os.path.isfile(caminho_item) and caminho_item.endswith(".xlsx"):
                processar_arquivo(caminho_item, ano, "GERAL")
            elif os.path.isdir(caminho_item):
                categoria = item
                for arquivo in os.listdir(caminho_item):
                    if not arquivo.endswith(".xlsx"):
                        continue
                    caminho_arquivo = os.path.join(caminho_item, arquivo)
                    processar_arquivo(caminho_arquivo, ano, categoria)

# Execução
if __name__ == "__main__":
    processar_planilhas(CAMINHO_BASE)
