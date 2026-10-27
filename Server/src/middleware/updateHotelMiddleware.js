const { body } = require("express-validator");
const { requiredErrorMessage, validErrorMessage, notAvailableErrorMessage, imageTypeErrorMessage, requiredImageErrorMessage, fileSizeErrorMessage, fileCountErrorMessage } = require("../services/staticMessage");
const getModelInfo = require("../services/getModelInfo");
const { default: axios, options } = require("axios");

function updateHotelMiddleware() {
    return [
        body("id").notEmpty().withMessage(requiredErrorMessage("Primary ID"))
            .isNumeric().withMessage(validErrorMessage("Primary ID")),
        body("name")
            .optional()
            .isString()
            .withMessage(validErrorMessage("Name")),

        body("location")
            .optional()
            .isString()
            .withMessage(validErrorMessage("Location")),

        body("country").optional()
            .custom(async (value) => {
                const response = await axios.get(`${process.env.COUNTRY_API}`);
                const countries = response.data.data.map(country => country.country);
                if (!countries?.includes(value)) throw new Error(validErrorMessage("Country"));
            }),

        body("price_per_night")
            .optional()
            .isNumeric()
            .withMessage(validErrorMessage("Price per Night"))
            .custom(value => {
                if (value <= 0) {
                    throw new Error(validErrorMessage("Price per Night"));
                }
                return true;
            }),

        body("available_rooms")
            .optional()
            .isInt({ min: 1 })
            .withMessage(validErrorMessage("Available Rooms")),

        body("services")
            .optional()
            .isJSON()
            .withMessage(validErrorMessage("Services"))
            .custom(services => {
                if (services?.length === 0) {
                    throw new Error(validErrorMessage("Services"));
                }
                return true;
            }),
    ];
}

module.exports = updateHotelMiddleware;
