import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfb_k8fKrXnCCrGMWUISxnHEomGD7C5Dg",
  authDomain: "bhangro-website.firebaseapp.com",
  projectId: "bhangro-website",
  storageBucket: "bhangro-website.firebasestorage.app",
  messagingSenderId: "486245805994",
  appId: "1:486245805994:web:4e42c9bdb7e5301f0e45d3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
export default app;