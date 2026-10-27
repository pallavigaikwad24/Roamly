import { messaging, onMessage1 } from "/firebase.js";
import { getToken } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging.js";

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistration().then(function (registration) {
        if (!registration) {
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js", { scope: "/firebase-cloud-messaging-push-scope" })
                .then(function (registration) { console.log("Service Worker registered with scope:", registration.scope) })
                .catch(function (err) { console.log("Service Worker registration failed:", err) });
        }
    });
}

onMessage1(messaging, (payload) => {
    new Notification(payload.notification.title, {
        body: payload.notification.body,
    });
});

async function requestPermission() {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
        const vapidKey = process.env.FIREBASE_VAPIDKEY
        const token = await getToken(messaging, { vapidKey: vapidKey });
        // ----- Fetching save-token route to save token into database
        await fetch("/save-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });
    }
}

requestPermission();
