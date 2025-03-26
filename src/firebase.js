import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDR5LcEOkn8Zh78WOkNEbElwGYVw2xkGPE",
  authDomain: "example-ac72b.firebaseapp.com",
  projectId: "example-ac72b",
  storageBucket: "example-ac72b.appspot.com",
  messagingSenderId: "1032838332370",
  appId: "1:1032838332370:web:0d7f78d520b2a1e736120b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
};
