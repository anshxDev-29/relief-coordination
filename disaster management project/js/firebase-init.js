// ============================================================
// FIREBASE SETUP — Disaster Relief Coordination project
// This file is shared by every page. Don't rename or move it
// without updating the <script type="module" src="..."> path
// in each HTML file.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA7tSgP6RXZ8J_dQIbIPJz_vLJS3FoW4Ss",
  authDomain: "disaster-relief-coordina-f7e4e.firebaseapp.com",
  projectId: "disaster-relief-coordina-f7e4e",
  storageBucket: "disaster-relief-coordina-f7e4e.firebasestorage.app",
  messagingSenderId: "302775991355",
  appId: "1:302775991355:web:f60fa6dd12359626fa701e",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
};
