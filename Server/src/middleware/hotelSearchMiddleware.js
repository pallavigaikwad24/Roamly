const { body } = require("express-validator");
const { requiredErrorMessage, notAvailableErrorMessage, validErrorMessage, availableErrorMessage, notExistErrorMessage } = require("../services/staticMessage");
const { HotelBookingModel } = require("../models");
const { where, Op, fn, col } = require("sequelize");
const getModelInfo = require("../services/getModelInfo");

const hotelSearchMiddleware = () => {
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
        body("start_date").notEmpty().withMessage(requiredErrorMessage("Start Date")),
        body("start_date").custom(async (value, { req }) => {
            const argument = {
                modelName: 'HotelModel',
                methodType: 'findOne',
                args: {
                    where: {
                        [Op.or]: [
                            where(fn('LOWER', col('name')), { [Op.like]: `%${req.body.name.toLowerCase()}%` }),
                            where(fn('LOWER', col('country')), { [Op.like]: `%${req.body.name.toLowerCase()}%` }),
                            where(fn('LOWER', col('location')), { [Op.like]: `%${req.body.name.toLowerCase()}%` }),
                        ]
                    },
                    include: [
                        { model: HotelBookingModel, attributes: ['hotel_id', 'number_of_rooms', 'check_out_date', 'check_in_date'] }
                    ]
                }
            }

            const info = await getModelInfo(argument);
            if (!info) throw new Error(notExistErrorMessage(req.body.name, "").split(",")[0]);

            const getAvailableRooms = {
                modelName: 'HotelModel', methodType: 'findOne',
                args: { attributes: ['available_rooms'], where: { id: info?.id } }
            }
            const availbleRoomCount = await getModelInfo(getAvailableRooms);

            const startDate = new Date(value);
            let availbleCount = availbleRoomCount.available_rooms;

            // Checking room availability for start date
            info.HotelBookingModels.forEach((item) => {
                const checkOutDate = new Date(item.check_out_date);
                const checkInDate = new Date(item.check_in_date);
                if (startDate < checkOutDate && startDate >= checkInDate)
                    availbleCount -= item.number_of_rooms
            });
            if (availbleCount <= 0)
                throw new Error(notAvailableErrorMessage(req.body.name, "Hotel Rooms for this date"))
            else
                available = availbleCount;
            return true;
        }),
        body("end_date").notEmpty().withMessage(requiredErrorMessage("End Date")),
        body("end_date").custom((value, { req }) => {
            const startDate = new Date(req.body.start_date);
            const endDate = new Date(value);

            if (endDate <= startDate) throw new Error(validErrorMessage("End Date"));
            return true;
        }),
        body("rooms").notEmpty().withMessage(requiredErrorMessage("Room Count")),
        body("rooms").isNumeric().withMessage(validErrorMessage("Room Count")),
        body("rooms").custom((value) => {
            const roomCount = parseInt(value);
            if (roomCount <= 0) throw new Error(validErrorMessage("Room Count"));
            if (available == 0) throw new Error(notAvailableErrorMessage(req.body.name, "Hotels"));
            if (roomCount > available && available > 0) throw new Error(availableErrorMessage(available, "Rooms"));
            return true;
        })
    ]
}

module.exports = hotelSearchMiddleware;