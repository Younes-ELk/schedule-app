import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence,GoogleAuthProvider  } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; // Add these imports

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAJkq0A4Qv9mhul-EhmJrPx_0WYqAPVKk",
  authDomain: "shedule-app-ba8ad.firebaseapp.com",
  projectId: "shedule-app-ba8ad",
  storageBucket: "shedule-app-ba8ad.firebasestorage.app",
  messagingSenderId: "369615780336",
  appId: "1:369615780336:web:2fccd288b4099c54400535",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Set local persistence to keep user logged in after page refresh
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error.message);
  });

// Export Firestore methods and db
export { auth,googleProvider, db, collection, addDoc, getDocs };
