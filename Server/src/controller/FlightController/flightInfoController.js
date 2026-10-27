const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const { logErrorMessage } = require("../../services/staticMessage");

const flightInfoController = async (req, res) => {
    try {
        const argument = {
            modelName: 'FlightModel',
            methodType: 'findAll',
        }
        const allHotels = await getModelInfo(argument);
        return res.status(HTTP_CODE.OK.code).send(allHotels);
    } catch (error) {
        logger.error(logErrorMessage("Getting All Flight Info"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send({ message: error.message });
    }
}

module.exports = flightInfoController;