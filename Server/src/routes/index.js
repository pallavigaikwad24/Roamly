const { Router } = require("express");
const loginRoute = require("../routes/loginRoute");
const hotelRoute = require("../routes/hotelRoute");
const fligtRoute = require("../routes/flightRoute");
const searchRoute = require("../routes/searchRoute");
const firebaseRoute = require("../routes/firebaseNotificationRoute");
const paymentRoute = require("../routes/paymentRoute.js");
const userRoute = require("../routes/userRoute.js");
const swaggerJSDOC = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const swaggerConfig = require("../config/swaggerConfig.js");
const route = Router();

const swaggerSpec = swaggerJSDOC(swaggerConfig);
if (process.env.NODE_ENV == 'development')
    route.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

route.use("/user", loginRoute);
route.use("/user-info", userRoute);
route.use("/hotel", hotelRoute);
route.use("/flight", fligtRoute);
route.use("/search", searchRoute);
route.use("/firebase", firebaseRoute);
route.use("/payment", paymentRoute);

module.exports = route;