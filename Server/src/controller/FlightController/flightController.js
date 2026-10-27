const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const logger = require("../../config/logger");
const { logErrorMessage } = require("../../services/staticMessage");

const flightController = async (req, res) => {
    try {
        const { flight_number, airline, departure_airport, arrival_airport, departure_date, departure_time, arrival_date,
            arrival_time, price, seats_available } = req.body;
        const arguments = {
            modelName: 'FlightModel',
            methodType: "create",
            args: {
                owner_id: req.user.id, flight_number, airline, departure_airport, arrival_airport, departure_date,
                departure_time, arrival_date, arrival_time, price, seats_available
            }
        }

        const newFlightEntry = await getModelInfo(arguments);
        return res.status(HTTP_CODE.ACCEPTED.code).send(newFlightEntry);
    } catch (error) {
        logger.error(logErrorMessage("Adding Flight Information"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = flightController;