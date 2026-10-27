const { body } = require("express-validator");
const { requiredErrorMessage, validErrorMessage, availableErrorMessage } = require("../services/staticMessage");
const getModelInfo = require("../services/getModelInfo");
const { where, Op } = require("sequelize");
const { FlightBookingModel } = require("../models");

function flightBookingMiddleware() {
    return [
        body("flight_id")
            .notEmpty()
            .withMessage(requiredErrorMessage("Flight ID"))
            .isInt({ min: 1 })
            .withMessage(validErrorMessage("Flight ID"))
            .custom(async (value) => {
                const argument = {
                    modelName: 'FlightModel',
                    methodType: "findOne",
                    args: { where: { id: value } }
                };

                const existFlight = await getModelInfo(argument);
                if (!existFlight) throw new Error(validErrorMessage("Flight ID"));
            }),

        body("number_of_seats")
            .notEmpty()
            .withMessage(requiredErrorMessage("Number of Seats"))
            .isInt({ min: 1 })
            .withMessage(validErrorMessage("Number of Seats")),
        body("number_of_seats").custom(async (value, { req }) => {
            const flightId = req.body.flight_id;
            const getAvailableFlights = {
                modelName: 'FlightModel', methodType: 'findOne',
                args: {
                    where: { id: flightId },
                    include: [{ model: FlightBookingModel, attributes: ['flight_id', 'number_of_seats'] }]
                }
            }
            const info = await getModelInfo(getAvailableFlights);
            let availbleCount = info.seats_available;

            info.FlightBookingModels.forEach((item) => {
                availbleCount = availbleCount - item.number_of_seats
            });
            if (availbleCount < value) throw new Error(availableErrorMessage(availbleCount, "Seats"))

        }),
    ];
}

module.exports = flightBookingMiddleware;
