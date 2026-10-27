const { body } = require("express-validator");
const { requiredErrorMessage, notExistErrorMessage } = require("../services/staticMessage");
const { where } = require("sequelize");
const getModelInfo = require("../services/getModelInfo");
const findOneHotelArgs = require("../utils/findOneHotelArgs");

const deleteMiddleware = (param) => {
    return [
        body("id").notEmpty().withMessage(requiredErrorMessage(param))
            .custom(async (value) => {
                const isHotel = await getModelInfo(findOneHotelArgs(value, param));
                if (!isHotel) throw new Error(notExistErrorMessage(`${value} ${param}`).split(",")[0]);
            }),
    ]
}

const userCancelMiddleware = (param) => {
    return [
        body(param).notEmpty().withMessage(requiredErrorMessage(param))
            .custom(async (value) => {

                const isHotel = await getModelInfo(findOneHotelArgs(value, param));
                if (!isHotel) throw new Error(notExistErrorMessage(`${value} Hotel ID`).split(",")[0]);

                const arguments = {
                    modelName: param == 'hotel_id' ? 'HotelBookingModel' : 'FlightBookingModel',
                    methodType: 'findOne',
                    args: { where: { hotel_id: value } }
                }
                const isBooking = await getModelInfo(arguments);
                if (!isBooking) throw new Error(notExistErrorMessage(`${value} Hotel Booking`).split(",")[0]);

            })
    ]
}

module.exports = { deleteMiddleware, userCancelMiddleware };