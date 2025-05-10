// ../ChatRoom/firebaseConfig1.js
import { initializeApp } from "@firebase/app";
import { getDatabase, ref, push, set, get, onValue, query, orderByChild, limitToLast, remove } from '@firebase/database'; // Đảm bảo import onValue

// **Quan trọng:** Thay thế các giá trị YOUR_... bằng thông tin cấu hình Firebase Realtime Database thực tế của bạn
const firebaseConfig = {
  apiKey: "AIzaSyCzq2kag7m0GC_0fVG2x6xHnKwViQTCpSU",
  authDomain: "etherealtravel-e676a.firebaseapp.com",
  databaseURL: "https://etherealtravel-e676a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "etherealtravel-e676a",
  storageBucket: "etherealtravel-e676a.firebasestorage.app",
  messagingSenderId: "695720343432",
  appId: "1:695720343432:web:7f49fcd713cb44376a2c3d",
  measurementId: "G-SVBFLD7C9B"
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase App initialization error:", error);
}

// Lấy đối tượng database cho Realtime Database
const database = getDatabase(app);

// Export instance của database và các hàm riêng lẻ cho Realtime Database, bao gồm onValue
export { database, ref, push, set, get, onValue, query, orderByChild, limitToLast, remove};