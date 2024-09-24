import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDFQDe69zSL0gGZuT9P6KNWUyAYzbHC5Tg",
    authDomain: "ludo-list.firebaseapp.com",
    projectId: "ludo-list",
    storageBucket: "ludo-list.appspot.com",
    messagingSenderId: "952994560584",
    appId: "1:952994560584:web:00095333c23a1aeda4b67d"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };