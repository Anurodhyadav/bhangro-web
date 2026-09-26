import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfb_k8fKrXnCCrGMWUISxnHEomGD7C5Dg",
  authDomain: "bhangro-website.firebaseapp.com",
  projectId: "bhangro-website",
  storageBucket: "bhangro-website.firebasestorage.app",
  messagingSenderId: "486245805994",
  appId: "1:486245805994:web:4e42c9bdb7e5301f0e45d3",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;