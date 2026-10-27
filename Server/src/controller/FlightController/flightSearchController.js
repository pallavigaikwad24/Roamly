const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const logger = require("../../config/logger");
const { Op } = require("sequelize");
const { logErrorMessage } = require("../../services/staticMessage");
const redisClient = require("../../config/redisConfig");

const flightSearchController = async (req, res) => {
    try {
        const { departure_airport, destination_airport, start_date } = req.body;
        const cacheKey = `flightSearch_${departure_airport}_${destination_airport}`;
        const cacheData = await redisClient.get(cacheKey);

        if (cacheData) return res.status(HTTP_CODE.ACCEPTED.code).send(JSON.parse(cacheData));
        
        const argument = {
            modelName: 'FlightModel',
            methodType: 'findAll',
            args: { where: { [Op.and]: [{ departure_airport }, { arrival_airport: destination_airport }] } }
        }

        const allResult = await getModelInfo(argument);
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(allResult));
       
        return res.status(HTTP_CODE.ACCEPTED.code).send(allResult);
    } catch (error) {
        logger.error(logErrorMessage("Searching Flight"), {
            method: req.method, url: `${req.get("Host")}${req.originalUrl}`, message: error.message, stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = flightSearchController;