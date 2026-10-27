const { Router } = require("express");
const { isAuth } = require("../middleware/loginPassportMiddleware");
const paymentController = require("../controller/UserController/paymentController");
const route = Router();

route.post("/createOrder", isAuth, paymentController);

module.exports = route;