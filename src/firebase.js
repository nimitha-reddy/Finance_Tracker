// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnD6tDL95YFlFlcyFiwKcSBHQFf8q7FKE",
  authDomain: "financly-69668.firebaseapp.com",
  projectId: "financly-69668",
  storageBucket: "financly-69668.appspot.com",
  messagingSenderId: "288783895041",
  appId: "1:288783895041:web:bab032e0c301a673c88e00",
  measurementId: "G-K8RXNNWQJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };