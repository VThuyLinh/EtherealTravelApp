import { getFirestore } from "@firebase/firestore";
import { getDatabase } from "@firebase/database";
import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { getStorage } from "@firebase/storage";
import { getAuth } from "@firebase/auth";


export const firebaseConfig = {
  apiKey: "AIzaSyCzq2kag7m0GC_0fVG2x6xHnKwViQTCpSU",
  authDomain: "etherealtravel-e676a.firebaseapp.com",
  databaseURL: "https://etherealtravel-e676a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "etherealtravel-e676a",
  storageBucket: "etherealtravel-e676a.firebasestorage.app",
  messagingSenderId: "695720343432",
  appId: "1:695720343432:web:7f49fcd713cb44376a2c3d",
  measurementId: "G-SVBFLD7C9B"
};




export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB= getFirestore(FIREBASE_APP);
export const STORAGE= getStorage(FIREBASE_APP);
export const DATABASE = getDatabase(FIREBASE_APP);