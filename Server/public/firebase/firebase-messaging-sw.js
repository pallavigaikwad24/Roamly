importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js')
// Your Firebase configuration (same as in your client.js)
const firebaseConfig = {
    apiKey: "AIzaSyAuoMQKAZNrod1yP_epbbWNEeGvFYe53Ho",
    authDomain: "travelling-app-877c1.firebaseapp.com",
    projectId: "travelling-app-877c1",
    storageBucket: "travelling-app-877c1.firebasestorage.app",
    messagingSenderId: "915158243676",
    appId: "1:915158243676:web:1be3b8546ed66021a88999",
    measurementId: "G-YLTX7TZB61"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
}