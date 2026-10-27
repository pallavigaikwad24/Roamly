const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const { where } = require("sequelize");
const logger = require("../../config/logger");
const { logErrorMessage } = require("../../services/staticMessage");

const cancellingFlightBookingController = async (req, res) => {
    try {
        const argument = {
            modelName: 'FlightBookingModel',
            methodType: 'update',
            args: [{ booking_status: false }, { where: { user_id: req.user.id, flight_id: req.body.flight_id } }]
        }
        const result = await getModelInfo(argument);
        return res.status(HTTP_CODE.ACCEPTED.code).send(result)

    } catch (error) {
        logger.error(logErrorMessage("cancelling flight booking"), {
            method: req.method, url: `${req.get("Host")}${req.originalUrl}`, message: error.message, stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message)
    }
}

module.exports = cancellingFlightBookingController;