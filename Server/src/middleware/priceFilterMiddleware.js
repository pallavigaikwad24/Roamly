const { body } = require("express-validator");
const { requiredErrorMessage, validErrorMessage } = require("../services/staticMessage");

const priceFilterMiddleware = () => {
    return [
        body("leastPrice").notEmpty().withMessage(requiredErrorMessage("Least Price"))
            .isNumeric().withMessage(validErrorMessage("Least Price")),

        body("selectedPrice").notEmpty().withMessage(requiredErrorMessage("selected Price"))
            .isNumeric().withMessage(validErrorMessage("selected Price")),
    ]
}

module.exports = priceFilterMiddleware;