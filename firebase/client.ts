// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtW50ZfAWZLQdhiOn3sVoZ8Sz8804E8Hc",
  authDomain: "intervai-c8ada.firebaseapp.com",
  projectId: "intervai-c8ada",
  storageBucket: "intervai-c8ada.firebasestorage.app",
  messagingSenderId: "523251924300",
  appId: "1:523251924300:web:cd0f49a6760df9ab0de3e9",
  measurementId: "G-NK764R276W"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);