
require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });
const express = require("express");
const route = require("./src/routes/index.js");
const app = express();
const path = require("path");
const fs = require("fs");
const passportAuthMiddleware = require("./src/middleware/passportAuth.js")
const pageNotFoundController = require("./src/controller/pageNotFoundController.js");
const serverCrashPreventMiddleware = require("./src/middleware/serverCrashPreventMiddleware.js");
const cors = require("cors");
const { setupLogging } = require("./src/middleware/setlog.js");
setupLogging();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Allowed browser origins, comma-separated. In the single-container build the
// client is same-origin so CORS never engages; this matters for `npm run dev`
// (client on Vite's port, API on 3000) and for any split deployment. Falls back
// to APP_PUBLIC_URL, which is already the browser-facing origin.
const corsOrigins = (process.env.CORS_ORIGIN || process.env.APP_PUBLIC_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin: corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Allowed headers
    credentials: true, // Important: Allows credentials (cookies, auth headers)
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));
app.use(passportAuthMiddleware)
app.use(serverCrashPreventMiddleware);
app.use(route);

// In development the client is served by Vite on :5173. In the single-image
// Docker build, Client/dist sits next to Server/, so Express serves the React
// app from the same origin as the API - which is why VITE_BACKEND_URL is built
// empty and no CORS entry is needed for it.
const clientDist = path.join(__dirname, "..", "Client", "dist");
if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));

    // Deep links like /login are client-side routes, so a refresh has to come
    // back as index.html. API paths are listed explicitly rather than inferred,
    // so an unmatched /hotel/... still reaches pageNotFoundController and
    // returns a 404 instead of silently handing back HTML.
    const apiPrefixes = ["/user", "/user-info", "/hotel", "/flight", "/search",
        "/firebase", "/payment", "/api-docs", "/hotelPictures", "/logs"];
    app.get(/.*/, (req, res, next) => {
        const isApi = apiPrefixes.some((prefix) =>
            req.path === prefix || req.path.startsWith(prefix + "/"));
        if (isApi) return next();
        return res.sendFile(path.join(clientDist, "index.html"));
    });
}

app.use(pageNotFoundController);
app.listen(process.env.PORT || 3300, () => {
    console.log("SERVER LISTENING ON PORT", process.env.PORT)
});
