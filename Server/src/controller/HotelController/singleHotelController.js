const { where } = require("sequelize");
const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const { logErrorMessage } = require("../../services/staticMessage");
const { ReviewHotelModel } = require("../../models");

const singleHotelController = async (req, res) => {
    try {
        const { hotel_id } = req.params;
        console.log("Inside single", hotel_id);

        const argument = {
            modelName: 'HotelModel',
            methodType: 'findOne',
            args: { where: { id: Number(hotel_id) }, include: [{ model: ReviewHotelModel }] }
        }
        const singleHotels = await getModelInfo(argument);
        return res.status(HTTP_CODE.OK.code).send(singleHotels);
    } catch (error) {
        logger.error(logErrorMessage("Getting single Hotel Info"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send({ message: error.message });
    }
}

module.exports = singleHotelController;