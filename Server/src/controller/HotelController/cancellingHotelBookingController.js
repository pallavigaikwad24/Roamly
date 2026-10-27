const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const { where } = require("sequelize");
const logger = require("../../config/logger");
const { logErrorMessage } = require("../../services/staticMessage");
const { getAdminCall } = require("../../services/adminNotification");

const cancellingHotelBookingController = async (req, res) => {
    try {
        const argument = {
            modelName: 'HotelBookingModel',
            methodType: 'update',
            args: [
                { booking_status: false },
                { where: { user_id: req.user.id, hotel_id: req.body.hotel_id } }
            ]
        }
        const result = await getModelInfo(argument);

        const notifyArgument = {
            modelName: 'FirebaseNotificationToken',
            methodType: "findOne",
            args: { where: { user_id: req.user.id } },
        };

        const token = await getModelInfo(notifyArgument);

        if (token) {
            const message = {
                notification: {
                    title: `Your hotel booking has been successfully cancelled.!`, body: "View message!"
                },
                token,
            };

            // Firebase Notification
            await getAdminCall(message);
        }

        return res.status(HTTP_CODE.ACCEPTED.code).send(result);
    } catch (error) {
        logger.error(logErrorMessage("cancelling hotel booking"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message)
    }
}

module.exports = cancellingHotelBookingController;