const { body } = require("express-validator");
const { requiredErrorMessage, validErrorMessage, ratingErrorMessage } = require("../services/staticMessage");

const hotelReviewMiddleware = () => {
    return [
        body("review").notEmpty().withMessage(requiredErrorMessage("Review")),
        body("review").isString().withMessage(validErrorMessage("Review")),

        body("rating").notEmpty().withMessage(requiredErrorMessage("Rating"))
            .isNumeric().withMessage(validErrorMessage("Rating"))
            .isLength({ min: 1, max: 5 }).withMessage(ratingErrorMessage)
    ]
}

module.exports = hotelReviewMiddleware;