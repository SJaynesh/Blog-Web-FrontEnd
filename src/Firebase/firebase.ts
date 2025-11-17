import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyC1Ygm4cPa36t24sGiuJOI991mZm6Vwpi4",
    authDomain: "blog-web-app-aa0f4.firebaseapp.com",
    projectId: "blog-web-app-aa0f4",
    storageBucket: "blog-web-app-aa0f4.firebasestorage.app",
    messagingSenderId: "441326573488",
    appId: "1:441326573488:web:8550e2d82df9a49868a875",
    measurementId: "G-RDRSEG278T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);