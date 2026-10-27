const { body } = require("express-validator");
const { requiredErrorMessage, validErrorMessage, existErrorMessage, passwordErrorMessage, confirmMatchErrorMessage, isUserType }
    = require("../services/staticMessage");
const getModelInfo = require("../services/getModelInfo");
const { where } = require("sequelize");
const { default: axios } = require("axios");

function userUpdateMiddleware() {
    const result = [
        body("id").notEmpty().withMessage(requiredErrorMessage("Primary ID of User want to update"))
            .isNumeric().withMessage(validErrorMessage("Primary ID")),
        body("first_name").optional().isAlpha().withMessage(validErrorMessage("First Name")),

        body("last_name").optional().custom((value) => {
            if (value?.trim() == '') throw new Error(requiredErrorMessage("Last Name"));
        }),
        body("email").optional()
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
            .withMessage(validErrorMessage("Email ID"))
            .custom(async (value, { req }) => {
                const argument = { modelName: 'User', methodType: "findOne", args: { where: { email: value } } };
                const existEmail = await getModelInfo(argument);
                if (existEmail) throw new Error(existErrorMessage("Email", "Login"));
            }),
        body("password").optional().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/)
            .withMessage(passwordErrorMessage("Password"))
            .custom(async (value) => {
                if (value.length < 8) throw new Error(passwordErrorMessage("Password"));
            }),
        body("country").optional()
            .custom(async (value) => {
                const response = await axios.get(`${process.env.COUNTRY_API}`);
                const countries = response.data.data.map(country => country.country);
                if (!countries?.includes(value)) throw new Error(validErrorMessage("Country"));
            }),
        body("phone_number").optional()
            .matches(/^[6-9]\d{9}$/).withMessage(validErrorMessage("Phone Number")),
        body("user_type").optional().custom((value) => {
            if (value == 'superAdmin') throw new Error(isUserType())
            if (value != 'admin' && value != 'user' && value != 'superAdmin') throw new Error(isUserType());
            return true;
        })
    ]
    return result;
}

module.exports = userUpdateMiddleware;