import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase com fallback para desenvolvimento
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo",
};

// Verificar se as variáveis de ambiente estão configuradas
const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
                            import.meta.env.VITE_FIREBASE_PROJECT_ID;

if (!isFirebaseConfigured) {
  console.warn("⚠️ Firebase não configurado! Usando dados mock para demonstração.");
  console.warn("📝 Configure as variáveis de ambiente no arquivo .env para usar dados reais.");
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 