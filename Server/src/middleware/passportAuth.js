const { Router } = require("express");
const passport = require('passport');
const sessionStore = require("../utils/passportSession.js");
const { initializationPassport } = require("../Authentication/passportAuth.js");
const session = require("express-session");
const router = Router();

initializationPassport(passport);
router.use(passport.initialize());
router.use(session({ key: "user_session", store: sessionStore, secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false }));
router.use(passport.session());

module.exports = router