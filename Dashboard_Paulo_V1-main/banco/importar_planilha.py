import pandas as pd
from sqlalchemy import create_engine
import sys
from urllib.parse import quote

# 📌 Configurações do Banco
db_user = "postgres"
db_password = "Infra2022@#"  # 
db_host = "localhost"
db_port = "5432"
db_name = "meu_banco_1"

# 📌 Configurações da Planilha
excel_path = r"/Users/lucasfontoura/Documents/lucas/Projetos_React/Dashboard_Paulo_V1/Dashboard_Paulo_V1-main/banco/banco de dados.xlsx"
sheet_name = "Dados"
table_name = "planilha_dashboard"

try:
    # 1️⃣ Ler a planilha
    print("📖 Lendo a planilha...")
    df = pd.read_excel(excel_path, sheet_name=sheet_name)
    
    print("✅ Colunas encontradas na planilha:", df.columns.tolist())
    print(f"📊 Total de linhas: {len(df)}")
    print("📄 Primeiras linhas:")
    print(df.head())
    
    # 2️⃣ Limpar dados
    print("\n🧹 Limpando dados...")
    # Remover linhas completamente vazias
    df_limpo = df.dropna(how='all')
    
    # Preencher valores NaN com 'Não Informado' para colunas de texto
    colunas_texto = ['Bolsa Família', 'Situação de Pobreza', 'Setor Econômico', 'Sexo', 'Raça/Cor', 'Grau de Instrução', 'Faixa Etária', 'CadÚnico', 'UF']
    for col in colunas_texto:
        if col in df_limpo.columns:
            df_limpo[col] = df_limpo[col].fillna('Não Informado')
    
    # Preencher valores NaN com 0 para colunas numéricas
    colunas_numericas = ['Ano', 'Admissoes', 'Desligamentos', 'Saldo']
    for col in colunas_numericas:
        if col in df_limpo.columns:
            df_limpo[col] = df_limpo[col].fillna(0)
    
    print(f"✅ Dados limpos: {len(df_limpo)} linhas válidas")
    
    # 3️⃣ Testar conexão com PostgreSQL
    print("\n🔌 Testando conexão com PostgreSQL...")
    # Codificar a senha para evitar problemas com caracteres especiais
    password_encoded = quote(db_password)
    connection_string = f"postgresql+psycopg2://{db_user}:{password_encoded}@{db_host}:{db_port}/{db_name}"
    
    try:
        engine = create_engine(connection_string)
        # Testar conexão
        with engine.connect() as conn:
            print("✅ Conexão com PostgreSQL estabelecida!")
    except Exception as e:
        print(f"❌ Erro na conexão com PostgreSQL: {e}")
        print("\n🔧 Possíveis soluções:")
        print("1. Verifique se o PostgreSQL está rodando")
        print("2. Confirme se a senha está correta")
        print("3. Verifique se o banco 'meu_banco' existe")
        print("4. Tente criar o banco: CREATE DATABASE meu_banco;")
        sys.exit(1)
    
    # 4️⃣ Importar para o PostgreSQL
    print("\n📤 Importando dados para PostgreSQL...")
    df_limpo.to_sql(table_name, engine, if_exists="replace", index=False)
    
    print(f"🎉 Planilha importada com sucesso para a tabela '{table_name}'!")
    print(f"📊 Total de registros importados: {len(df_limpo)}")

except FileNotFoundError:
    print(f"❌ Arquivo não encontrado: {excel_path}")
    print("Verifique se o caminho da planilha está correto.")
except Exception as e:
    print(f"❌ Erro inesperado: {e}")
    print("Verifique se todas as dependências estão instaladas:")
    print("pip install pandas sqlalchemy psycopg2-binary openpyxl")