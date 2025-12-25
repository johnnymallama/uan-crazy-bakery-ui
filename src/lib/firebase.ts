
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArigL1eVzC9s1wxwcHoja0GygtA8dYSJk",
  authDomain: "crazy-bakery.firebaseapp.com",
  projectId: "crazy-bakery",
  storageBucket: "crazy-bakery.firebasestorage.app",
  messagingSenderId: "327187297810",
  appId: "1:327187297810:web:dee72d00a11758e4f60acb",
  measurementId: "G-51XWK39Z9T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
