    const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const logger = require("../../config/logger");
const { logErrorMessage } = require("../../services/staticMessage");
const { Op, where, fn, col } = require("sequelize");
const redisClient = require("../../config/redisConfig");

const flightListController = async (req, res) => {
    try {
        const { name } = req.body;
        const cacheKey = `flightSearch_${name}`;
        const cacheData = await redisClient.get(cacheKey);

        if (cacheData) return res.status(HTTP_CODE.ACCEPTED.code).send(JSON.parse(cacheData));

        const argument = {
            modelName: 'AirportModel',
            methodType: 'findAll',
            args: {
                where: {
                    [Op.or]: [
                        where(fn('LOWER', col('name')), { [Op.like]: `%${name.toLowerCase()}%` }),
                        where(fn('LOWER', col('icao_code')), { [Op.like]: `%${name.toLowerCase()}%` }),
                        where(fn('LOWER', col('city')), { [Op.like]: `%${name.toLowerCase()}%` }),
                        where(fn('LOWER', col('country')), { [Op.like]: `%${name.toLowerCase()}%` }),
                    ],
                },
            }
        }
        // Setting Result Value into redis cache
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

module.exports = flightListController;