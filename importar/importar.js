const admin = require("firebase-admin");
const fs = require("fs");

// Caminho para o seu arquivo de credenciais
const serviceAccount = require("./dashboard-ac748-firebase-adminsdk-fbsvc-9bc6ce73da.json");

// Inicializa o Firebase Admin com o Firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Conecta no Firestore
const db = admin.firestore();

// Lê os dados do arquivo JSON
const dados = JSON.parse(fs.readFileSync("./base_unificada_firebase.json", "utf-8"));

// Nome da coleção
const colecao = "dadosUnificados";

// Função de importação
async function importar() {
  for (const item of dados) {
    await db.collection(colecao).add(item);
    console.log("Documento adicionado:", item);
  }

  console.log("✅ Importação finalizada com sucesso!");
  process.exit(0);
}

importar();
