// src/services/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFlHqVeVRxJnQjsxBPpr3I3ihFyQ_J-1g",
  authDomain: "familyfinanceappweb.firebaseapp.com",
  projectId: "familyfinanceappweb",
  storageBucket: "familyfinanceappweb.appspot.com",
  messagingSenderId: "842229967094",
  appId: "1:842229967094:web:e27fedb0ca900d7e19e4d7",
  measurementId: "G-D4NY0WQ5QS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);

export { auth, provider, db };
