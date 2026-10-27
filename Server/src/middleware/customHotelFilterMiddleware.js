const { body } = require("express-validator");
const { validErrorMessage } = require("../services/staticMessage");

const customHotelFilterMiddleware = () => {
    return [
        body("price").optional().isJSON().withMessage(validErrorMessage("Price Range")),
        body("country").optional().isJSON().withMessage(validErrorMessage("Country")),
        body("location").optional().isJSON().withMessage(validErrorMessage("Location")),
        body("search_text").optional().isString().withMessage(validErrorMessage("Search Text")),
    ]
}

module.exports = customHotelFilterMiddleware;