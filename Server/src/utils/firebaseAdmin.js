const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

// The service-account JSON is git-ignored (`src/config/*.json`), so on a fresh
// clone it is simply absent. This module is pulled in at require-time by the
// hotel routes, so throwing here used to take the whole server down before it
// could listen. Initialise only when credentials are actually present.
//
// Point FIREBASE_SERVICE_ACCOUNT at your key, or drop any *.json into
// src/config/ and it is picked up automatically.
function resolveServiceAccount() {
    const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (fromEnv) {
        const abs = path.isAbsolute(fromEnv) ? fromEnv : path.resolve(__dirname, "..", "..", fromEnv);
        return fs.existsSync(abs) ? abs : null;
    }

    const configDir = path.resolve(__dirname, "..", "config");
    if (!fs.existsSync(configDir)) return null;

    const candidate = fs.readdirSync(configDir)
        .filter((f) => f.endsWith(".json"))
        .sort()[0];

    return candidate ? path.join(configDir, candidate) : null;
}

let initialised = false;
const serviceAccountPath = resolveServiceAccount();

if (serviceAccountPath) {
    try {
        admin.initializeApp({ credential: admin.credential.cert(require(serviceAccountPath)) });
        initialised = true;
        console.log("Firebase Admin initialised from", path.basename(serviceAccountPath));
    } catch (err) {
        console.error("Firebase Admin failed to initialise:", err.message);
    }
} else {
    console.warn("Firebase Admin not configured - push notifications are disabled. " +
        "Add a service-account JSON to Server/src/config/ or set FIREBASE_SERVICE_ACCOUNT.");
}

// Same shape as the real SDK, so callers need no changes: when Firebase is not
// configured, send() resolves to null instead of blowing up.
module.exports = initialised ? admin : {
    messaging: () => ({
        send: async () => {
            console.warn("Push notification skipped - Firebase Admin is not configured.");
            return null;
        }
    })
};
