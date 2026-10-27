const { body } = require("express-validator");
const { requiredErrorMessage, validErrorMessage, ratingErrorMessage, notExistErrorMessage } = require("../services/staticMessage");
const { where } = require("sequelize");
const getModelInfo = require("../services/getModelInfo");

const verifyHotelMiddleware = () => {
    return [
        body("hotel_id").notEmpty().withMessage(requiredErrorMessage("Review"))
            .custom(async (value) => {
                const argument = {
                    modelName: 'HotelModel',
                    methodType: 'findOne',
                    args: { where: { id: value } }
                }
                const isHotelExists = await getModelInfo(argument);
                if (!isHotelExists) throw new Error(notExistErrorMessage("Hotel").split(",")[0]);
            })
            .isNumeric().withMessage(validErrorMessage("Hotel ID"))
    ]
}

module.exports = verifyHotelMiddleware;