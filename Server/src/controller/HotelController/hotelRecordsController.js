const { where, Op } = require("sequelize");
const getModelInfo = require("../../services/getModelInfo");
const logger = require("../../config/logger");
const { logErrorMessage } = require("../../services/staticMessage");
const HTTP_CODE = require("../../services/enum");

const hotelRecordsController = async (req, res) => {
    try {
        const { count, name } = req.body;

        // const offset = (count - 1) * 10; // Work like pagination
        // const limit = 10;
        const offset = 0;
        const limit = (count * 10) + 10;
        // args: { where: { [Op.or]: [{ name }, { country: name }], is_verified: true }, offset, limit }

        const argument = {
            modelName: 'HotelModel',
            methodType: 'findAll',
            args: { where: { [Op.or]: [{ name }, { country: name }] }, offset, limit }
        }
        const allResult = await getModelInfo(argument);
        return res.status(HTTP_CODE.OK.code).send(allResult);

    } catch (error) {
        logger.error(logErrorMessage("getting Hotel Information"), {
            method: req.method, url: `${req.get("Host")}${req.originalUrl}`, message: error.message, stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message)
    }
}

module.exports = hotelRecordsController;