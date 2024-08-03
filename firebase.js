// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeo7bKTXNE5HrF1evefjnxvAYTbrUUapk",
  authDomain: "pantrytracker-f9245.firebaseapp.com",
  projectId: "pantrytracker-f9245",
  storageBucket: "pantrytracker-f9245.appspot.com",
  messagingSenderId: "765795913360",
  appId: "1:765795913360:web:1c5ae548c40dc8b9f59215",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { auth, firestore };
