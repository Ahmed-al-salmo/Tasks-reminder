
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

type FirebaseType={
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

const firebaseConfig:FirebaseType = {
  apiKey: "AIzaSyCFtKksv7rK2sqxttgVCn1NC9enO1JYBwk",
  authDomain: "task-reminder-4d0e7.firebaseapp.com",
  projectId: "task-reminder-4d0e7",
  storageBucket: "task-reminder-4d0e7.firebasestorage.app",
  messagingSenderId: "552254177183",
  appId: "1:552254177183:web:5a1d34a2aec0e74cb607aa",
  measurementId: "G-RMK0G5HQZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
