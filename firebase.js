// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6xl9h3GdQyJ02vCdmsYutYOFcw2obPYE",
  authDomain: "flashcardsaas-2e956.firebaseapp.com",
  projectId: "flashcardsaas-2e956",
  storageBucket: "flashcardsaas-2e956.appspot.com",
  messagingSenderId: "135837679929",
  appId: "1:135837679929:web:6ce469ee4ed65b50f328e8",
  measurementId: "G-DRHEQV2GZ8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
