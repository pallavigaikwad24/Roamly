const { where } = require("sequelize");
const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const { logErrorMessage } = require("../../services/staticMessage");

const updateFlightController = async (req, res) => {
    try {
        const { flight_number, airline, departure_airport, arrival_airport, departure_date, departure_time, arrival_date,
            arrival_time, price, seats_available } = req.body;

        const argument = {
            modelName: 'FlightModel',
            methodType: 'update',
            args: [{
                flight_number, airline, departure_airport, arrival_airport, departure_date, departure_time, arrival_date,
                arrival_time, price, seats_available
            }, { where: { owner_id: req.user.id } }]
        }
        const result = await getModelInfo(argument);
        return res.status(HTTP_CODE.ACCEPTED.code).send(result);
    } catch (error) {
        logger.error(logErrorMessage("updating flights"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message)
    }
}

module.exports = updateFlightController;