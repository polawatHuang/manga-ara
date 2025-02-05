// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBiSpu4PdOrdUGCEDRhSNHpMyft8KKz9rM",
  authDomain: "manga-ara.firebaseapp.com",
  projectId: "manga-ara",
  storageBucket: "manga-ara.firebasestorage.app",
  messagingSenderId: "879631164216",
  appId: "1:879631164216:web:70450e69e2bcbb474557cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };