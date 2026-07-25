import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9qeKv1mu4GkepoJcQEhYPE7tfg_qGfEA",
  authDomain: "ai-website-growth-assistant.firebaseapp.com",
  projectId: "ai-website-growth-assistant",
  storageBucket: "ai-website-growth-assistant.firebasestorage.app",
  messagingSenderId: "1064213128683",
  appId: "1:1064213128683:web:12480b0948c3b2f18e25ae"
};

// Main App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Secondary App instance specifically for user registration without mutating main auth state
const secondaryApp = getApps().find(a => a.name === 'SecondaryRegistrationApp') 
  || initializeApp(firebaseConfig, 'SecondaryRegistrationApp');

export const auth = getAuth(app);
export const secondaryAuth = getAuth(secondaryApp);
export const db = getFirestore(app);

export default app;
