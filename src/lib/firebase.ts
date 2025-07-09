// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1gxPh44whPiZraTecv5RJuK3O-qRnQKk",
  authDomain: "crisiscompanion-b48dc.firebaseapp.com",
  projectId: "crisiscompanion-b48dc",
  storageBucket: "crisiscompanion-b48dc.firebasestorage.app",
  messagingSenderId: "695344690190",
  appId: "1:695344690190:web:e7cd279eb972814241385f",
  measurementId: "G-J08HHLVD9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
export { app, database, auth, firestore };
