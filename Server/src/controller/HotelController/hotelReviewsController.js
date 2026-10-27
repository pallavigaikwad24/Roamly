const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const { logErrorMessage } = require("../../services/staticMessage");

const hotelReviewController = async (req, res) => {
    try {

        const { review, rating } = req.body;
        const { hotel_id } = req.params;

        const arguments = {
            modelName: 'ReviewHotelModel',
            methodType: 'create',
            args: { user_id: req.user.id, hotel_id, reviewText: review, rating }
        }

        const newReview = await getModelInfo(arguments);
        return res.status(HTTP_CODE.OK.code).send(newReview);
    } catch (error) {
        logger.error(logErrorMessage("adding review"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send({ message: error.message });
    }
}

module.exports = hotelReviewController;