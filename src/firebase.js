// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCU3r56cS5B4C2SwvMbriulJo8vcH8iI0A",
  authDomain: "solarsystemmanagment.firebaseapp.com",
  projectId: "solarsystemmanagment",
  storageBucket: "solarsystemmanagment.firebasestorage.app",
  messagingSenderId: "129844523380",
  appId: "1:129844523380:web:4ab0e3253a111aa5ad3c21",
  measurementId: "G-1D1MX4X36B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;