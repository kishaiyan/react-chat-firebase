// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_API_KEY ,
  authDomain: "chat-app-779ec.firebaseapp.com",
  projectId: "chat-app-779ec",
  storageBucket: "chat-app-779ec.appspot.com",
  messagingSenderId: "18584881067",
  appId: "1:18584881067:web:9662e280691bf921f6f4ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth()
export const db=getFirestore()
export const storage=getStorage()