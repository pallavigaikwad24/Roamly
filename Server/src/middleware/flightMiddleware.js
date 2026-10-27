const { body } = require("express-validator");
const { requiredErrorMessage, validErrorMessage } = require("../services/staticMessage");
const { default: axios } = require("axios");
const getModelInfo = require("../services/getModelInfo");

function flightMiddleware() {
    return [
        body("flight_number")
            .notEmpty()
            .withMessage(requiredErrorMessage("Flight Number"))
            .isString()
            .withMessage(validErrorMessage("Flight Number")),

        body("airline")
            .notEmpty()
            .withMessage(requiredErrorMessage("Airline"))
            .isString()
            .withMessage(validErrorMessage("Airline")),

        body("departure_airport")
            .notEmpty()
            .withMessage(requiredErrorMessage("Departure Airport"))
            .isString()
            .withMessage(validErrorMessage("Departure Airport")),
        body("departure_airport").custom(async (value, { req }) => {
            if (value?.trim()?.length == 0) throw new Error(requiredErrorMessage("Departure Airport"));
            const arguments = {
                methodType: 'findAll',
                modelName: 'AirportModel'
            }
            const response = await getModelInfo(arguments);
            const result = response.find((item) =>
                item?.icao_code?.toLocaleLowerCase()?.startsWith(value?.toLocaleLowerCase())
            );
            if (!result) throw new Error(validErrorMessage("Departure Airport Name"));
        }),

        body("arrival_airport")
            .notEmpty()
            .withMessage(requiredErrorMessage("Arrival Airport"))
            .isString()
            .withMessage(validErrorMessage("Arrival Airport")),
        body("arrival_airport").custom(async (value, { req }) => {
            if (value?.trim()?.length == 0) throw new Error(requiredErrorMessage("Arrival Airport"));
            const arguments = {
                methodType: 'findAll',
                modelName: 'AirportModel'
            }
            const response = await getModelInfo(arguments);
            const result = response.find((item) =>
                item?.icao_code?.toLocaleLowerCase()?.startsWith(value?.toLocaleLowerCase())
            );
            if (!result) throw new Error(validErrorMessage("Arrival Airport Name"));
        }),

        body("departure_time")
            .notEmpty()
            .withMessage(requiredErrorMessage("Departure Time"))
            .matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/)
            .withMessage(validErrorMessage("Departure Time")),

        body("arrival_time")
            .notEmpty()
            .withMessage(requiredErrorMessage("Arrival Time"))
            .matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/)
            .withMessage(validErrorMessage("Arrival Time"))
            .custom((value, { req }) => {
                const arrivalTime = value;
                const departureTime = req.body.departure_time;
                if (arrivalTime <= departureTime) {
                    throw new Error(validErrorMessage("Arrival Time"));
                }
                return true;
            }),

        body("price")
            .notEmpty()
            .withMessage(requiredErrorMessage("Price"))
            .isNumeric()
            .withMessage(validErrorMessage("Price"))
            .custom((value) => {
                if (value <= 0) {
                    throw new Error(validErrorMessage("Price"));
                }
                return true;
            }),

        body("seats_available")
            .notEmpty()
            .withMessage(requiredErrorMessage("Seats Available"))
            .isInt({ min: 1 })
            .withMessage(validErrorMessage("Seats Available")),
    ];
}

module.exports = flightMiddleware;
