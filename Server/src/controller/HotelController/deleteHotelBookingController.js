const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const { where } = require("sequelize");
const { logErrorMessage } = require("../../services/staticMessage");

const deleteHotelBookingController = async (req, res) => {
    try {
        const isOwnerArgument = {
            modelName: 'HotelModel', methodType: 'findOne',
            args: { where: { owner_id: req.user.id, id: req.body.hotel_id } }
        }
        const isOwner = await getModelInfo(isOwnerArgument);
        if (isOwner) {
            const argument = {
                modelName: 'HotelBookingModel',
                methodType: 'update',
                args: [{ is_deleted: true }, { where: { user_id: req.user.id, hotel_id: req.body.hotel_id } }]
            }
            const result = await getModelInfo(argument);
            return res.status(HTTP_CODE.ACCEPTED.code).send(result)
        } else {
            return res.status(HTTP_CODE.FORBIDDEN.code).send(HTTP_CODE.FORBIDDEN.message);
        }


    } catch (error) {
        logger.error(logErrorMessage("deleting hotel booking"), {
            method: req.method, url: `${req.get("Host")}${req.originalUrl}`, message: error.message, stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message)
    }
}

module.exports = deleteHotelBookingController;