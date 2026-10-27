const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const logger = require("../../config/logger");
const { sendMail } = require("../../email/emailSend");
const { hotelEmailHtml } = require("../../utils/emailNotificationHtmlTemplate");
const { where } = require("sequelize");
const { logErrorMessage } = require("../../services/staticMessage");
const { getAdminCall } = require("../../services/adminNotification");
const redisClient = require("../../config/redisConfig");

const hotelBookingController = async (req, res) => {
    try {
        const { hotel_id, check_in_date, check_out_date, number_of_rooms } = req.body;

        const cacheKey = `hotelBooking_${hotel_id}_${req.user.id}`;
        const cacheData = await redisClient.get(cacheKey);

        if (cacheData) return res.status(HTTP_CODE.ACCEPTED.code).send(JSON.parse(cacheData));


        const getHotelInfoArgument = {
            modelName: 'HotelModel',
            methodType: 'findOne',
            args: { attributes: ['price_per_night'], where: { id: hotel_id } }
        }

        const hotelInfo = await getModelInfo(getHotelInfoArgument);
        const total_price = hotelInfo.price_per_night * number_of_rooms;

        const arguments = {
            modelName: 'HotelBookingModel',
            methodType: 'create',
            args: { user_id: req.user.id, hotel_id, check_in_date, check_out_date, number_of_rooms, total_price },
        }
        const newHotelBooking = await getModelInfo(arguments);
        const getHotelInfoArgs = {
            modelName: 'HotelModel',
            methodType: 'findOne',
            args: { where: newHotelBooking.hotel_id, attributes: ['name'] }
        }
        const getHotelInfo = await getModelInfo(getHotelInfoArgs);
        sendMail(
            req.user.email,
            "Welcome to Our App!",
            `Hello ${req.user.email},\n\nYour hotel booking has been successfully confirmed!`,
            hotelEmailHtml(req.user.email, getHotelInfo.name, number_of_rooms, check_in_date, check_out_date, total_price)
        );

        const notifyArgument = {
            modelName: 'FirebaseNotificationToken',
            methodType: "findOne",
            args: { where: { user_id: req.user.id } },
        };

        const token = await getModelInfo(notifyArgument);

        if (token) {
            const message = {
                notification: {
                    title: `${req.user.first_name} ${req.user.last_name} you have successfully 
                    booked hotel at ${getHotelInfo.name}!`, body: "View message!"
                },
                token,
            };

            // Firebase Notification
            await getAdminCall(message);
        }

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(newHotelBooking));

        return res.status(HTTP_CODE.ACCEPTED.code).send(newHotelBooking);
    } catch (error) {
        logger.error(logErrorMessage("Hotel booking"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = hotelBookingController;