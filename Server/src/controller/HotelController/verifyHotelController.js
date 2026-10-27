const { where } = require("sequelize");
const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const { logErrorMessage } = require("../../services/staticMessage");
const getModelInfo = require("../../services/getModelInfo");

const verifyHotelController = async (req, res) => {
    try {
        const { hotel_id } = req.body;
        const arguments = {
            modelName: 'HotelModel',
            methodType: 'update',
            args: [{ is_verified: true }, { where: { id: hotel_id } }]
        }

        const result = await getModelInfo(arguments);
        return res.status(HTTP_CODE.ACCEPTED.code).send(result);
    } catch (error) {
        logger.error(logErrorMessage("Verifying Hotel"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = verifyHotelController;