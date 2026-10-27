const { Router } = require("express");
const { saveToken, getTokenController } = require("../controller/UserController/firebaseController");
const { isAuth } = require("../middleware/loginPassportMiddleware");
const route = Router();

route.post("/save-token", isAuth, saveToken);
route.get("/get-token", isAuth, getTokenController);

module.exports = route;

