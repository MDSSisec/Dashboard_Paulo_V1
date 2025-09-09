#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔍 Script de teste para verificar se os valores NULL estão sendo tratados corretamente
"""

import pandas as pd
from sqlalchemy import create_engine
from urllib.parse import quote

# 📌 Configurações do Banco
db_user = "postgres"
db_password = "@dM1n090710" 
db_host = "localhost"
db_port = "5432"
db_name = "meu_banco_2"

def test_null_values():
    """Testa se os valores NULL estão sendo tratados corretamente"""
    
    print("🔍 Testando tratamento de valores NULL...")
    
    # Conectar ao banco
    password_encoded = quote(db_password)
    connection_string = f"postgresql+psycopg2://{db_user}:{password_encoded}@{db_host}:{db_port}/{db_name}"
    
    try:
        engine = create_engine(connection_string)
        
        # Testar consultas para verificar valores NULL
        queries = [
            {
                'nome': 'Valores NULL em Bolsa Família',
                'sql': 'SELECT COUNT(*) as total, COUNT("Bolsa Família") as nao_nulos FROM planilha_dashboard'
            },
            {
                'nome': 'Valores NULL em Setor Econômico', 
                'sql': 'SELECT COUNT(*) as total, COUNT("Setor Econômico") as nao_nulos FROM planilha_dashboard'
            },
            {
                'nome': 'Valores NULL em Sexo',
                'sql': 'SELECT COUNT(*) as total, COUNT("Sexo") as nao_nulos FROM planilha_dashboard'
            },
            {
                'nome': 'Exemplos de valores NULL',
                'sql': '''
                SELECT "UF", "Ano", "Bolsa Família", "Setor Econômico", "Sexo", "Raça/Cor"
                FROM planilha_dashboard 
                WHERE "Bolsa Família" IS NULL 
                   OR "Setor Econômico" IS NULL 
                   OR "Sexo" IS NULL 
                   OR "Raça/Cor" IS NULL
                LIMIT 10
                '''
            }
        ]
        
        with engine.connect() as conn:
            for query in queries:
                print(f"\n📊 {query['nome']}:")
                result = conn.execute(query['sql'])
                rows = result.fetchall()
                
                if len(rows) > 0:
                    for row in rows:
                        print(f"   {dict(row._mapping)}")
                else:
                    print("   Nenhum resultado encontrado")
                    
        print("\n✅ Teste concluído!")
        
    except Exception as e:
        print(f"❌ Erro no teste: {e}")

if __name__ == "__main__":
    test_null_values()
