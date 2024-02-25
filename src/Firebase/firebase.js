import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  GithubAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1kRxb9uQvm0StSY4J_slrvPjhc3wzivs",
  authDomain: "letspray-41ad6.firebaseapp.com",
  projectId: "letspray-41ad6",
  storageBucket: "letspray-41ad6.appspot.com",
  messagingSenderId: "390785687071",
  appId: "1:390785687071:web:a6de0a7f87eddfbf037f2a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const GoogleProvider = new GoogleAuthProvider();
// const FacebookProvider = new FacebookAuthProvider();
const GithubProvider = new GithubAuthProvider();

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app); // Add this line

export {
  app,
  auth,
  GoogleProvider,
  db,
  GithubProvider,
  sendPasswordResetEmail,
  database,
  storage,
};
