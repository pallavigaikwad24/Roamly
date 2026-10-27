const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const { logErrorMessage } = require("../../services/staticMessage");
const { ReviewHotelModel } = require("../../models");
const { where } = require("sequelize");

const hotelInfoController = async (req, res) => {
    try {

        const argument = {
            modelName: 'HotelModel',
            methodType: 'findAll',
            args: { where: { is_verified: true }, include: { model: ReviewHotelModel }, order: [[ReviewHotelModel, 'rating', 'ASC']] }
        }
        const allHotels = await getModelInfo(argument);
        return res.status(HTTP_CODE.OK.code).send(allHotels);
    } catch (error) {
        logger.error(logErrorMessage("Getting All Hotel Info"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send({ message: error.message });
    }
}

const hotelInfoVerifyController = async (req, res) => {
    try {

        const argument = {
            modelName: 'HotelModel',
            methodType: 'findAll',
        }
        const allHotels = await getModelInfo(argument);
        return res.status(HTTP_CODE.OK.code).send(allHotels);
    } catch (error) {
        logger.error(logErrorMessage("Getting All Hotel Info"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send({ message: error.message });
    }
}

module.exports = { hotelInfoController, hotelInfoVerifyController };