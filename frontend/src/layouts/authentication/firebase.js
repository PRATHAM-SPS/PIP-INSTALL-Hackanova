// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Database, getDatabase } from "firebase/database";
import "firebase/database";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyCR5K_pJsMCNFAAyLhXiBlUdhpJjKMhvgQ",
    authDomain: "hackanova-60da1.firebaseapp.com",
    projectId: "hackanova-60da1",
    storageBucket: "hackanova-60da1.appspot.com",
    messagingSenderId: "891632605998",
    appId: "1:891632605998:web:60b012bcc8cbbade2878bf",
    measurementId: "G-47QR4PXYYL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getDatabase(app)
export {app};
export const fs = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
// export const auth = getAuth(app);

export default app;
