const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const logger = require("../../config/logger");
const { flightEmailHtml } = require("../../utils/emailNotificationHtmlTemplate");
const { sendMail } = require("../../email/emailSend");
const { logErrorMessage } = require("../../services/staticMessage");
const redisClient = require("../../config/redisConfig");

const flightBookingController = async (req, res) => {
    try {
        const { flight_id, number_of_seats, price } = req.body;
        const total_price = price * number_of_seats;

        const arguments = {
            modelName: 'FlightBookingModel',
            methodType: "create",
            args: { user_id: req.user.id, flight_id, number_of_seats, total_price }
        }

        const newFlightBooking = await getModelInfo(arguments);
        const getFlightInfoArgs = {
            modelName: 'FlightModel',
            methodType: 'findOne',
            args: { where: newFlightBooking.flight_id }
        }
        const getFlightInfo = await getModelInfo(getFlightInfoArgs);

        sendMail(
            req.user.email,
            "Welcome to Our App!",
            `Hello ${req.user.email},\n\nYour Flight booking has been successfully confirmed!`,
            flightEmailHtml(req.user.email, getFlightInfo.flight_number, getFlightInfo.departure_airport,
                getFlightInfo.departure_date, getFlightInfo.departure_time, getFlightInfo.arrival_airport,
                getFlightInfo.arrival_date, getFlightInfo.arrival_time, number_of_seats, total_price, getFlightInfo.airline)
        );
        return res.status(HTTP_CODE.ACCEPTED.code).send(newFlightBooking);
    } catch (error) {
        logger.error(logErrorMessage("flight booking"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = flightBookingController;