const { body } = require("express-validator");
const { requiredErrorMessage, validErrorMessage, availableErrorMessage, notAvailableErrorMessage, notExistErrorMessage } = require("../services/staticMessage");
const { HotelBookingModel } = require("../models");
const getModelInfo = require("../services/getModelInfo");
const { where, Op } = require("sequelize");

function hotelBookingMiddleware() {
    let available = 0;
    let hotelName = null;
    return [
        body("hotel_id")
            .notEmpty()
            .withMessage(requiredErrorMessage("Hotel ID"))
            .isInt()
            .withMessage(validErrorMessage("Hotel ID")),
        body("hotel_id").custom(async (value) => {
            
            const argument = {
                modelName: 'HotelModel',
                methodType: "findOne",
                args: { where: { id: value } }
            }

            const existUser = await getModelInfo(argument);
            if (!existUser) throw new Error(validErrorMessage("Hotel ID"))
        }),

        body("check_in_date")
            .notEmpty()
            .withMessage(requiredErrorMessage("Check-in Date"))
            .custom(async (value, { req }) => {
                const checkInDate = new Date(value);
                if (checkInDate < new Date()) {
                    throw new Error(validErrorMessage("Check-in Date"));
                }

                const argument = {
                    modelName: 'HotelModel',
                    methodType: 'findOne',
                    args: {
                        where: { id: req.body.hotel_id },
                        include: [
                            {
                                model: HotelBookingModel,
                                attributes: ['hotel_id', 'number_of_rooms', 'check_out_date', 'check_in_date', 'booking_status'],
                            }
                        ]
                    }
                }

                const info = await getModelInfo(argument);
                console.log("Info:", info);
                if (!info) throw new Error(notExistErrorMessage("This Hotel", "").split(",")[0]);
                hotelName = info.name;

                const getAvailableRooms = {
                    modelName: 'HotelModel', methodType: 'findOne',
                    args: { attributes: ['available_rooms'], where: { id: info?.id } }
                }
                const availbleRoomCount = await getModelInfo(getAvailableRooms);

                const startDate = new Date(value);
                let availbleCount = availbleRoomCount.available_rooms;

                const userCheckIn = new Date(value);
                const userCheckOut = new Date(req.body.check_out_date);

                // Checking room availability for start date
                info.HotelBookingModels.forEach((item) => {
                    const checkOutDate = new Date(item.check_out_date);
                    const checkInDate = new Date(item.check_in_date);
                    if ((userCheckOut <= checkOutDate && userCheckIn >= checkInDate) || (userCheckIn <= checkOutDate && userCheckOut >= checkInDate))
                        availbleCount -= item.number_of_rooms
                });
                if (availbleCount <= 0)
                    throw new Error(notAvailableErrorMessage("", ""))
                else
                    available = availbleCount;
                return true;

            }),

        body("check_out_date")
            .notEmpty()
            .withMessage(requiredErrorMessage("Check-out Date"))
            .custom((value, { req }) => {
                if (value?.trim() == null) throw new Error(requiredErrorMessage("Check Out Date"));
                const checkOutDate = new Date(value);
                const checkInDate = new Date(req.body.check_in_date);
                if (checkOutDate <= checkInDate) {
                    throw new Error(validErrorMessage("Check-out Date"));
                }
                const startDate = new Date(req.body.start_date);
                const endDate = new Date(value);

                if (endDate <= startDate) throw new Error(validErrorMessage("End Date"));
                return true;
            }),

        body("number_of_rooms")
            .notEmpty()
            .withMessage(requiredErrorMessage("Number of Guests"))
            .isInt({ min: 1 })
            .withMessage(validErrorMessage("Number of Guests")),
        body("number_of_rooms").custom(async (value, { req }) => {
            const roomCount = parseInt(value);
            if (available == 0) throw new Error(notAvailableErrorMessage(hotelName, "Hotels"));
            if (roomCount > available && available > 0) throw new Error(availableErrorMessage(available, "Rooms"));
            return true;
        }),
    ];
}

module.exports = hotelBookingMiddleware;
