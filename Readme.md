# Roamly — Travel Booking Platform

Roamly is a full-stack travel booking application. Travellers can search hotels and flights, filter
results, book stays and seats, pay online, and review properties. Property owners ("admins") can
list hotels and flights and manage their inventory, while a super admin verifies listings and
manages users.

The project is split into two independent applications:

| Part | Folder | Stack |
|---|---|---|
| Frontend (SPA) | `Client` | React 18 + Vite, Redux Toolkit, MUI, Bootstrap |
| Backend (REST API) | `Server` | Node.js + Express, PostgreSQL via Sequelize, Redis, Passport |

---

## Table of contents

- [Features](#features)
- [Tech stack and why each piece is used](#tech-stack-and-why-each-piece-is-used)
- [Repository structure](#repository-structure)
- [How a request flows](#how-a-request-flows)
- [Backend components — where and how they are used](#backend-components--where-and-how-they-are-used)
- [Frontend components — where and how they are used](#frontend-components--where-and-how-they-are-used)
- [Data model](#data-model)
- [API overview](#api-overview)
- [Getting started](#getting-started)
- [Before your first run (required fixes)](#before-your-first-run-required-fixes)
- [Environment variables](#environment-variables)
- [Useful commands](#useful-commands)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)

---

## Features

**Accounts and auth**
- Registration with email verification (token link sent by email)
- Password login (email or 10-digit phone number as the username)
- Passwordless OTP login by email
- Forgot / reset password over an emailed token
- Session-based auth with sessions persisted in PostgreSQL
- Failed-login tracking with temporary account lock
- Three roles: `user`, `admin` (property/flight owner), `superAdmin`

**Hotels**
- Search by text, country and location; price-range and custom filters
- Hotel detail page with image gallery, services and reviews
- Multi-image upload per hotel, plus deletion of a single image or all of them
- Booking with check-in/check-out dates and room count; cancellation
- Star ratings and text reviews
- Super-admin verification queue for newly listed hotels

**Flights**
- Search by airport and date (airport reference data is seeded into the database)
- Flight listing, booking by seat count, cancellation
- Owner CRUD on flight inventory

**Payments, messaging and operations**
- Razorpay Checkout for hotel and flight payments
- Transactional email (verification, OTP, password reset, booking notices) via Nodemailer
- Push notifications to admins via Firebase Cloud Messaging
- Redis caching of search and list results (1-hour TTL)
- Rotating daily error logs via Winston
- Swagger UI API docs (development only)

---

## Tech stack and why each piece is used

### Backend

| Library | Used for | Where |
|---|---|---|
| `express` | HTTP server, routing, static files | `index.js`, `src/routes/` |
| `sequelize` + `pg` | PostgreSQL ORM, migrations, seeders | `src/models/`, `src/migrations/`, `src/seeders/` |
| `sequelize-cli` | Running migrations/seeders (paths set in `.sequelizerc`) | CLI |
| `passport`, `passport-local`, `passport-custom` | Login strategies — `local` for password, `otpLogin` for OTP | `src/Authentication/passportAuth.js` |
| `express-session` + `connect-pg-simple` | Server-side sessions stored in the `sessions` table | `src/utils/passportSession.js`, `src/middleware/passportAuth.js` |
| `bcrypt` | Password hashing | registration, password reset, seeder |
| `express-validator` | Request body/param validation | everything under `src/middleware/` |
| `multer` | Hotel image uploads into a temp folder, later moved per owner/hotel | `src/utils/hotelImagesUpload.js`, `src/controller/HotelController/hotelImageController.js` |
| `redis` | Caching hotel/flight search and list responses | `src/config/redisConfig.js`, search/list/booking controllers |
| `nodemailer` | Outbound email with HTML templates | `src/email/emailSend.js`, `src/utils/*HtmlTemplate.js` |
| `firebase-admin` | Sending FCM push notifications to admins | `src/utils/firebaseAdmin.js`, `src/services/adminNotification.js` |
| `razorpay` | Creating payment orders | `src/services/paymentIntegration.js`, `src/controller/UserController/paymentController.js` |
| `winston` + `winston-daily-rotate-file` | Error logs in `public/logs/MM-DD-YYYY-app.log` | `src/config/logger.js` |
| `swagger-jsdoc` + `swagger-ui-express` | API docs generated from JSDoc comments in the routers | `src/config/swaggerConfig.js` |
| `cors` | Allows the Vite dev origin with credentials | `index.js` |
| `axios` | Server-side call to an external country-list API | registration / hotel middleware |

### Frontend

| Library | Used for | Where |
|---|---|---|
| `react`, `react-dom` | UI | `src/` |
| `vite` | Dev server and production build | `vite.config.js` |
| `react-router-dom` v7 | Routing and protected routes | `src/App.jsx`, `src/component/ProtectedRoute/` |
| `@reduxjs/toolkit`, `react-redux` | Global state: auth UI, search criteria, hotel/flight data, backend URL | `src/redux/` |
| `@mui/material`, `@mui/icons-material`, `@emotion/*` | Form inputs, alerts, dialogs, icons | login/signup, hotel form, profile |
| `bootstrap` (via CDN) + custom CSS | Layout and grid | `index.html`, `src/assets/style/` |
| `formik` + `yup` | Form state and validation schemas | login, signup, hotel form |
| `axios` | API calls with `withCredentials` so the session cookie is sent | all pages and components |
| `lucide-react` | Icons | home and search components |
| Razorpay Checkout (via CDN) | Payment modal | `src/pages/Payment_gateway/Payment.jsx` |

---

## Repository structure

```
Roamly/
├─ Client/
│  ├─ index.html                 # CDN links (Bootstrap, Font Awesome, fonts, Razorpay) + app mount point
│  ├─ vite.config.js
│  └─ src/
│     ├─ main.jsx                # React root + Redux <Provider>
│     ├─ App.jsx                 # Route table
│     ├─ pages/                  # Route-level screens
│     ├─ component/              # Reusable UI grouped by domain
│     ├─ redux/                  # store + feature slices
│     └─ assets/                 # images and per-screen CSS
│
└─ Server/
   ├─ index.js                   # Bootstrap: parsers, CORS, static, auth, routes, 404
   ├─ .sequelizerc               # Points sequelize-cli at src/{config,models,seeders,migrations}
   ├─ public/
   │  ├─ hotelPictures/          # defaultImg/ (shipped), temp/ + upload/ (created at runtime)
   │  ├─ firebase/               # Browser-side FCM helpers and service worker
   │  └─ logs/                   # Created at runtime by Winston
   └─ src/
      ├─ routes/                 # Express routers, one per domain + index.js aggregator
      ├─ middleware/             # Validation, auth guards, logging setup, crash guard
      ├─ controller/             # Request handlers (UserController, HotelController, FlightController)
      ├─ models/                 # Sequelize models and associations
      ├─ migrations/             # Schema history
      ├─ seeders/                # Super admin + airport seed data
      ├─ services/               # Shared logic: ORM helper, filters, payments, notifications, messages
      ├─ utils/                  # Uploads, email templates, Firebase admin, session store
      ├─ email/                  # Nodemailer transport
      ├─ Authentication/         # Passport strategy definitions
      └─ config/                 # DB, Redis, logger and Swagger configuration
```

---

## How a request flows

```
Browser (React page)
   │  axios, withCredentials: true
   ▼
Express  index.js
   │  body parsers → CORS → static /public → passportAuth (session + passport)
   │  → serverCrashPreventMiddleware → src/routes/index.js
   ▼
Router (e.g. /hotel)
   │  isAuth / isAdmin / isSuperAdmin  →  express-validator middleware
   │  → validationResultFun (returns 400 on invalid input)
   ▼
Controller
   │  services/getModelInfo.js   (single ORM entry point; always adds is_deleted: false)
   │  services/filterService.js  (builds Sequelize where-clauses for search)
   │  Redis cache read/write, email, FCM and Razorpay as needed
   ▼
PostgreSQL (Sequelize models)
```

Two cross-cutting pieces are worth knowing before reading any controller:

- **`src/services/getModelInfo.js`** is the only place models are called. Controllers pass
  `{ modelName, methodType, args }` and the helper transparently appends `is_deleted: false`, so
  every read honours soft deletes.
- **`src/services/enum.js`** holds HTTP status codes paired with user-facing messages, and
  `src/services/staticMessage.js` holds reusable validation and error strings — controllers never
  hardcode either.

---

## Backend components — where and how they are used

| Layer | Files | Responsibility |
|---|---|---|
| Bootstrap | `index.js` | Mounts parsers, CORS (credentials enabled), `public/` as static, auth, the router tree and the 404 handler |
| Auth strategies | `src/Authentication/passportAuth.js` | Registers the `local` (password) and `otpLogin` (custom) Passport strategies and session serialisation |
| Session wiring | `src/middleware/passportAuth.js`, `src/utils/passportSession.js` | `express-session` with a PostgreSQL store (`sessions` table), cookie key `user_session` |
| Guards | `src/middleware/loginPassportMiddleware.js` | `isAuth`, `isAdmin`, `isSuperAdmin` — applied per route |
| Validation | `src/middleware/*Middleware.js` + `validationFun.js` | Per-endpoint `express-validator` chains; `validationResultFun` turns failures into a 400 |
| Crash guard | `src/middleware/serverCrashPreventMiddleware.js` | Catches unhandled errors so the process survives |
| Log setup | `src/middleware/setlog.js` | Enables `console.log` only when `NODE_ENV=development`, silences it otherwise |
| Routers | `src/routes/*.js` | Grouped by domain, aggregated in `routes/index.js`; also carry the Swagger JSDoc blocks |
| Controllers | `src/controller/**` | One file per use case (e.g. `hotelBookingController.js`, `sendOtpController.js`) |
| Services | `src/services/*.js` | `getModelInfo`, `getUserInfo`, `filterService`, `paymentIntegration`, `adminNotification`, `enum`, `staticMessage` |
| Utils | `src/utils/*.js` | `hotelImagesUpload` (multer), HTML email templates, `firebaseAdmin`, `isSuperAdminExist`, `findOneHotelArgs` |
| Data | `src/models`, `src/migrations`, `src/seeders` | Schema, history and seed data |

**Image storage.** Uploads land in `public/hotelPictures/temp/`, then the controller moves them to
`public/hotelPictures/upload/<owner_id>/<hotel_id>/<filename>`. The frontend reads them directly
from `<backend-url>/hotelPictures/...` because `public/` is served statically. Both `temp/` and
`upload/` are created on demand and are not tracked in version control.

---

## Frontend components — where and how they are used

**Routes** (`src/App.jsx`) — anything unmatched redirects to `/login`.

| Route | Screen | Guard |
|---|---|---|
| `/login` | `pages/User/login.jsx` | `ProtectedLoginRoute` (sends signed-in users away) |
| `/signup` | `pages/User/signUp.jsx` | — |
| `/search` | `pages/Search/Search.jsx` | `ProtectedRoute` |
| `/home` | `pages/Home/Home.jsx` | `ProtectedRoute` |
| `/hotelname/:id` | `pages/Hotel/SingleHotel.jsx` | `ProtectedRoute` |
| `/profile` | `pages/User/Profile.jsx` | `ProtectedRoute` |
| `/verify/verification-request` | `pages/Hotel/VerificationRequest.jsx` | `ProtectedRoute` (super-admin screen) |
| `/email-verification/:token` | `component/EmailVerification/EmailVerification.jsx` | `ProtectedRoute` |

**Component groups** (`src/component/`)

| Group | Components | Used by |
|---|---|---|
| `HomeComponent` | `Header`, `Hero`, `Destinations`, `About`, `Contact`, `Footer` | Home page; `Header` is reused on Search and Profile |
| `HotelComponent` | `HotelSearch` (search form), `Cards` (result list), `HotelForm` (admin add/edit hotel), `Review` | Search page, SingleHotel page |
| `FlightComponent` | `FlightSearch`, `FlightCard` | Search page |
| `LoginComponent` | `EmailInput`, `OTP` | Login page (OTP flow) |
| `LoginSignupCommon` | `ImageDisplay`, `FrontText`, `RediectOption` | Login and Signup pages |
| `UserComponent` | `ProfileHeader`, `ProfilePage`, `HotelBooking` (my bookings), `PropertyList` (my listings) | Profile page |
| `ProtectedRoute` | `ProtectedRoute`, `ProtectedLoginRoute` | `App.jsx` |
| `EmailVerification` | `EmailVerification` | Verification-link route |
| Payment | `pages/Payment_gateway/Payment.jsx` | Rendered as a button inside the hotel and flight booking flows |

**Redux slices** (`src/redux/features/`)

| Slice | State it owns |
|---|---|
| `auth/loginSlice` | Login form UI: error text, alert visibility, password visibility, OTP step, email |
| `search/searchHotelSlice` | Hotel search criteria and which search tab is active |
| `search/searchFlightSlice` | Flight search criteria |
| `hotel/hotelSlice` | Hotel lists, selected hotel, admin form visibility |
| `flight/flightSlice` | Flight lists and selection |
| `backendUrl/backendUrl` | API base URL from `VITE_BACKEND_URL`, plus the cached country list |
| `protectedRoute/protectedRouteSlice` | Auth flag for route guards |

> The route guards currently read a `user_login` marker from `localStorage`. That only decides what
> the SPA renders — the real authorisation check happens server-side on every protected endpoint via
> the session cookie.

---

## Data model

PostgreSQL, managed by Sequelize migrations. Tables use an `is_deleted` soft-delete flag.

| Model | Key fields | Associations |
|---|---|---|
| `User` | `first_name`, `last_name`, `email`, `password` (bcrypt), `country`, `phone_number`, `user_type`, `is_verified` | has many hotels, flights, bookings and reviews; has one login-auth and one OTP record |
| `HotelModel` | `owner_id`, `name`, `location`, `country`, `price_per_night`, `available_rooms`, `services` (JSON), `images` (JSON), `is_verified` | belongs to `User`; has many bookings and reviews |
| `HotelBookingModel` | `user_id`, `hotel_id`, `check_in_date`, `check_out_date`, `number_of_rooms`, `total_price`, `booking_status` | belongs to `User` and `HotelModel` |
| `FlightModel` | `owner_id`, `flight_number`, `airline`, departure/arrival airport, date and time, `price`, `seats_available` | belongs to `User`; has many bookings |
| `FlightBookingModel` | `user_id`, `flight_id`, `number_of_seats`, `total_price`, `booking_status` | belongs to `User` and `FlightModel` |
| `ReviewHotelModel` | `user_id`, `hotel_id`, `reviewText`, `rating` | belongs to `User` and `HotelModel` |
| `AirportModel` | `name`, `icao_code`, `city`, `country`, `timezone` | seeded reference data for flight search |
| `LoginAuthModel` | `user_id`, `failed_attempts`, `lock_until` | brute-force lockout state |
| `OtpLogin` | `user_id`, `otp`, `is_valid` | one-time login codes |
| `PasswordResetToken` | token + expiry | forgot-password flow |
| `EmailVerificationToken` | token + expiry | signup verification |
| `FirebaseNotificationToken` | device token per user | FCM push targets |
| `sessions` | session id, payload, expiry | created and managed by `connect-pg-simple` |

---

## API overview

All paths are relative to the backend base URL. Protected endpoints require the session cookie, so
the client sends requests with `withCredentials: true`.

| Router | Endpoints | Access |
|---|---|---|
| `/user` | `POST /registration`, `POST /login`, `POST /send-otp`, `POST /otp-login/:email`, `POST /forgetPassword-email-auth`, `POST /forgetpassword/:token`, `POST /email-verification/:token`, `GET /logout` | Public |
| `/user-info` | `GET /all-user`, `PUT /update-user`, `DELETE /delete-user` | Super admin |
| `/search` | `POST /hotels`, `POST /hotel-list`, `POST /flights`, `POST /flight-list`, `POST /filter`, `POST /custom-filter` | Public |
| `/hotel` | `GET /get-all-hotels`, `GET /:hotel_id`, `POST /gethotels`, `POST /hotel-booking`, `GET /hotel-booking/get-hotel-booking`, `PATCH /canceling-hotel-booking`, `POST /add-hotel-reviews/:hotel_id` | Signed-in user |
| `/hotel` (owner) | `POST /add-hotel`, `POST /add-hotel-images`, `PUT /update-hotel-info`, `DELETE /delete-hotel-info`, `DELETE /delete-hotel-image`, `DELETE /delete-custome-image`, `GET /property/get-property`, `DELETE /deleting-hotel-booking` | Admin |
| `/hotel` (review queue) | `GET /get-hotels/verify`, `PATCH /verify-hotel` | Super admin |
| `/flight` | `POST /flight-booking`, `PATCH /canceling-flight-booking` | Signed-in user |
| `/flight` (owner) | `POST /add-flight`, `PUT /update-flight-info`, `DELETE /delete-flight-info`, `DELETE /deleting-flight-booking`, `GET /get-all-flights` | Admin / super admin |
| `/payment` | `POST /createOrder` | Signed-in user |
| `/firebase` | `POST /save-token`, `GET /get-token` | Signed-in user |
| `/api-docs` | Swagger UI | `NODE_ENV=development` only |

---

## Getting started

### Prerequisites

- Node.js 18 or newer (the backend start script uses `--env-file`)
- npm
- PostgreSQL 13+ with an empty database created for the app
- A reachable Redis instance (the search and list endpoints read and write the cache)
- Your own credentials for the optional integrations: Razorpay (test keys are fine), an
  SMTP-capable mailbox for Nodemailer, and a Firebase project for push notifications

### 1. Backend

```bash
cd Server
npm install
```

Create a `.env` file in that folder — see [Environment variables](#environment-variables) for the
full list — then create the schema and seed reference data:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Start the API (nodemon, reloads on change):

```bash
npm start
```

The server listens on `PORT`, or `3300` when `PORT` is unset. Set `PORT=3000` to match the Swagger
and frontend defaults. With `NODE_ENV=development`, the docs are at `http://localhost:3000/api-docs`.

### 2. Frontend

```bash
cd Client
npm install
```

Create a `.env` file in that folder:

```
VITE_BACKEND_URL=http://localhost:3000
VITE_COUNTRY_API=<country-list API endpoint>
```

Start the dev server:

```bash
npm run dev
```

Vite serves the app on `http://localhost:5173`. That origin is hard-coded in the CORS allow-list
in `index.js`, so update it there if you serve the frontend from a different port.

### 3. First login

`npx sequelize-cli db:seed:all` creates one super-admin user plus the airport reference data.
**Open `src/seeders/20250110055814-super-admin-credentials.js` and replace the email and password
with your own values before running the seeder** — the values committed there are placeholders and
should not be used anywhere but a throwaway local database. Accounts created through `/signup`
choose their own role (`user` or `admin`); `superAdmin` cannot be self-assigned at registration.

---

## Before your first run (required fixes)

These are known rough edges in the current snapshot.

> **Already applied in this working copy:** items 1, 3 and 4 below are fixed — the CSS imports are
> relative, the server starts without a Firebase service account, and the Redis host and port come
> from the environment. They are left documented here for context. Items 2 and 5 still need you.

1. **Machine-specific CSS imports.** Three files import a stylesheet by absolute Windows path
   instead of a relative one:
   - `src/pages/Search/Search.jsx`
   - `src/pages/User/login.jsx`
   - `src/pages/User/Profile.jsx`

   Replace each with the relative equivalent, for example
   `import '../../assets/style/login.css';`

2. **Firebase web configuration.** `Server/public/firebase/firebase.js` contains
   a web app config block — replace every value with your own Firebase project's config, or remove
   the push-notification wiring if you do not need it.

3. **Firebase service account.** `src/utils/firebaseAdmin.js` requires a service-account JSON from
   `src/config/`. That file is deliberately not in the repository (`src/config/*.json` is ignored).
   Download your own service-account key, place it in `src/config/`, and point the `require` in
   `firebaseAdmin.js` at its filename. Without it, the server fails to boot as soon as a
   notification module is loaded.

4. **Redis port.** `src/config/redisConfig.js` reads the host and password from the environment but
   has the port hardcoded. Change it to your Redis port (or promote it to an environment variable)
   before connecting to a local instance.

5. **Razorpay order handling.** `src/pages/Payment_gateway/Payment.jsx` passes the whole
   create-order response into the Checkout `key` field. Confirm the payload your backend returns and
   wire the publishable key, `amount` and `order_id` explicitly before accepting real payments.

---

## Environment variables

Both `.env` files are git-ignored — keep them that way and never commit real credentials. Each
folder ships a `.env.example`; copy it to `.env` and fill in your own values.

### `Server/.env`

| Variable | Purpose |
|---|---|
| `PORT` | API port (falls back to `3300`) |
| `NODE_ENV` | `development` enables console logs and Swagger UI |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | PostgreSQL connection |
| `DB_DIALECT` | Sequelize dialect — `postgres` |
| `SECRET_KEY` | `express-session` signing secret (use a long random value) |
| `EMAIL_ID`, `EMAIL_PASS` | Mailbox credentials for Nodemailer (use an app password, not your account password) |
| `RAZORPAY_ID_KEY`, `RAZORPAY_SECRET_KEY` | Razorpay API credentials |
| `COUNTRY_CODE` | Currency code used when creating payment orders, e.g. `INR` |
| `COUNTRY_API` | External endpoint returning the country list used to validate addresses |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | Redis connection. The older lowercase `host` / `password` names still work as a fallback |
| `FIREBASE_SERVICE_ACCOUNT` | Optional path to the Admin SDK JSON, relative to `Server/`. Any `*.json` in `src/config/` is picked up automatically |
| `FIREBASE_VAPIDKEY` | Web push VAPID key |

### `Client/.env`

| Variable | Purpose |
|---|---|
| `VITE_BACKEND_URL` | Base URL of the API, e.g. `http://localhost:3000` |
| `VITE_COUNTRY_API` | Country-list endpoint used by the signup and hotel forms |

---

## Useful commands

**Backend** (`Server`)

```bash
npm start                                   # nodemon with .env loaded
npx sequelize-cli db:migrate                # apply migrations
npx sequelize-cli db:migrate:undo           # roll back the last migration
npx sequelize-cli db:seed:all               # super admin + airports
npx sequelize-cli migration:generate --name <name>
```

**Frontend** (`Client`)

```bash
npm run dev       # Vite dev server on :5173
npm run build     # production build into dist/
npm run preview   # serve the production build
npm run lint      # ESLint
```

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Vite cannot resolve a CSS import | Absolute-path imports — see fix 1 above |
| `401 Unauthorized` on every protected call | Session cookie not sent: the frontend origin must match the CORS allow-list in `index.js`, and axios needs `withCredentials: true` |
| Push notifications never arrive | Firebase service account absent — the server logs a warning at boot and disables push |
| `Redis connection error` at boot | Wrong `REDIS_HOST`/`REDIS_PORT`/`REDIS_PASSWORD`. The API stays up, but search and list endpoints return 500 |
| Search endpoints return stale data | Results are cached in Redis for one hour; flush the key or wait for expiry |
| No emails arrive | `EMAIL_ID`/`EMAIL_PASS` missing, or the provider requires an app-specific password |
| `/api-docs` returns 404 | Swagger is mounted only when `NODE_ENV=development` |
| Uploaded hotel images 404 | They are served from `public/hotelPictures/upload/<owner_id>/<hotel_id>/`; check the folder exists and the backend URL is correct |

Runtime error logs are written to `Server/public/logs/MM-DD-YYYY-app.log`,
rotated daily and kept for 30 days.

---

## Security notes

- Replace the seeded super-admin email and password before running the seeder anywhere.
- Generate your own `SECRET_KEY`, Razorpay keys, mail credentials and Firebase config; do not reuse
  values found in source files.
- Passwords are hashed with bcrypt and are never returned by the API; sessions live in PostgreSQL.
- Restrict the CORS origin and serve over HTTPS before any non-local deployment.
- Keep `.env` files and the Firebase service-account JSON out of version control.
