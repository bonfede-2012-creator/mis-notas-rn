// lib/firebase.js
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAA8-A3ygW3ZMgLRs3-yS8l_sc6qdB4mG4",
  authDomain: "mis-notas-391b7.firebaseapp.com",
  databaseURL: "https://mis-notas-391b7-default-rtdb.firebaseio.com",
  projectId: "mis-notas-391b7",
  storageBucket: "mis-notas-391b7.appspot.com",
  messagingSenderId: "645302465341",
  appId: "1:645302465341:web:841db9808d910bd4a38b54",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
