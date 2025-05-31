// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAuWVTFBiqj4fctB9ImarI7Jm9-jbYP9BU",
  authDomain: "iot2-744e6.firebaseapp.com",
  databaseURL: "https://iot2-744e6-default-rtdb.firebaseio.com",
  projectId: "iot2-744e6",
  storageBucket: "iot2-744e6.firebasestorage.app",
  messagingSenderId: "912497865132",
  appId: "1:912497865132:web:437c70c19e68e4ae9a8a09",
  measurementId: "G-5KS2ZFJ1K5"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref };