// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getMessaging, onMessage } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAuoMQKAZNrod1yP_epbbWNEeGvFYe53Ho",
    authDomain: "travelling-app-877c1.firebaseapp.com",
    projectId: "travelling-app-877c1",
    storageBucket: "travelling-app-877c1.firebasestorage.app",
    messagingSenderId: "915158243676",
    appId: "1:915158243676:web:1be3b8546ed66021a88999",
    measurementId: "G-YLTX7TZB61"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const onMessage1 = onMessage;

