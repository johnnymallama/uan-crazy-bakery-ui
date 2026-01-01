
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAm95tZq9GX-MOg23OUo2fQrXFwhy8CFcU",
  authDomain: "uan-especializacion.firebaseapp.com",
  projectId: "uan-especializacion",
  storageBucket: "uan-especializacion.firebasestorage.app",
  messagingSenderId: "835393530868",
  appId: "1:835393530868:web:949f2d77843860c088a7a1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
