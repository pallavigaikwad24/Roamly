const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const logger = require("../../config/logger");
const { logErrorMessage } = require("../../services/staticMessage");
const { HotelModel } = require("../../models");
const { where } = require("sequelize");

const hotelBookingGetController = async (req, res) => {
    try {

        const arguments = {
            modelName: 'HotelBookingModel',
            methodType: 'findAll',
            args: { where: { user_id: req.user.id }, include: [{ model: HotelModel }] }
        }

        const hotelBookingInfo = await getModelInfo(arguments);

        return res.status(HTTP_CODE.OK.code).send(hotelBookingInfo);
    } catch (error) {
        logger.error(logErrorMessage("Getting Hotel Booking Details"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = hotelBookingGetController;