const { where } = require("sequelize");
const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const { logErrorMessage } = require("../../services/staticMessage");

const propertyGetController = async (req, res) => {
    try {
        console.log("Inside property controller")
        const argument = {
            modelName: 'HotelModel',
            methodType: 'findAll',
            args: { where: { owner_id: Number(req.user.id) } }
        }
        const property = await getModelInfo(argument);
        return res.status(HTTP_CODE.OK.code).send(property);
    } catch (error) {
        logger.error(logErrorMessage("Getting property Hotel Info"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send({ message: error.message });
    }
}

module.exports = propertyGetController;