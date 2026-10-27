const { body } = require("express-validator");
const { requiredErrorMessage, notAvailableErrorMessage, validErrorMessage, availableErrorMessage, notExistErrorMessage } = require("../services/staticMessage");
const { HotelBookingModel } = require("../models");
const { where, Op, fn, col } = require("sequelize");
const getModelInfo = require("../services/getModelInfo");

const hotelListMiddleware = () => {
    let available = 0;
    return [
        body("name").notEmpty().withMessage(requiredErrorMessage("Search Name")),
        body("name").custom(async (value, { req }) => {
            if (value?.trim()?.length == 0) throw new Error(requiredErrorMessage("Search Name"));
            const argument = {
                modelName: 'HotelModel',
                methodType: "findAll",
                where: {
                    [Op.or]: [
                        where(fn('LOWER', col('name')), { [Op.like]: `%${value.toLowerCase()}%` }),
                        where(fn('LOWER', col('country')), { [Op.like]: `%${value.toLowerCase()}%` }),
                        where(fn('LOWER', col('location')), { [Op.like]: `%${value.toLowerCase()}%` }),
                    ]
                },
            }
            const existName = await getModelInfo(argument);
            if (existName.length == 0) throw new Error(notExistErrorMessage(req.body.name).split(",")[0]);
            return true;
        }),
    ]
}

module.exports = hotelListMiddleware;