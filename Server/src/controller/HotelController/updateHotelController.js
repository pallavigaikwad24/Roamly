const { where, Op } = require("sequelize");
const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const { logErrorMessage } = require("../../services/staticMessage");
const logger = require("../../config/logger");
const { User } = require("../../models");

const updateHotelController = async (req, res) => {
    try {

        const { id, name, location, count, price_per_night, available_rooms, services } = req.body;

        const findArgs = {
            modelName: 'HotelModel',
            methodType: 'findOne',
            args: { where: { id }, include: [{ model: User }] }
        }

        const hotelInfo = await getModelInfo(findArgs);

        if (!hotelInfo) return res.status(HTTP_CODE.NOT_FOUND.code).send(HTTP_CODE.NOT_FOUND.message);

        console.log("Hotel Info::", hotelInfo);

        const argument = {
            modelName: 'HotelModel',
            methodType: 'update',
            args: [
                { name, location, count, price_per_night, available_rooms, services },
                { where: { id } }
            ]
        }
        if (req.user.user_type == 'superAdmin' || (req.user.user_type == 'admin' && req.user.id == hotelInfo.owner_id)) {
            const result = await getModelInfo(argument);
            return res.status(HTTP_CODE.ACCEPTED.code).send(result);
        }

        return res.status(HTTP_CODE.FORBIDDEN.code).send(HTTP_CODE.FORBIDDEN.message);
    } catch (error) {
        logger.error(logErrorMessage("updating Hotel records"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });

        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message)
    }
}

module.exports = updateHotelController;