const { body } = require("express-validator");
const { requiredErrorMessage, validErrorMessage, existErrorMessage, passwordErrorMessage, confirmMatchErrorMessage, isUserType }
    = require("../services/staticMessage");
const getModelInfo = require("../services/getModelInfo");
const { where } = require("sequelize");
const { default: axios } = require("axios");

function registrationValidation() {
    let password = null;
    const result = [
        body("first_name").notEmpty().withMessage(requiredErrorMessage("First Name")),
        body("last_name").notEmpty().withMessage(requiredErrorMessage("Last Name")),
        body("email").notEmpty().withMessage(requiredErrorMessage("Email ID")),
        body("email")
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
            .withMessage(validErrorMessage("Email ID")),
        body("email").custom(async (value, { req }) => {
            console.log("req.body:", req.body);
            if (value?.trim()?.length == 0) throw new Error(requiredErrorMessage("Email ID"));
            const argument = { modelName: 'User', methodType: "findOne", args: { where: { email: value } } };
            const existEmail = await getModelInfo(argument);
            if (existEmail) throw new Error(existErrorMessage("Email", "Login"));
        }),
        body("password").notEmpty().withMessage(requiredErrorMessage("Password")),
        body("password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/)
            .withMessage(passwordErrorMessage("Password")),
        body("password").custom(async (value) => {
            if (value?.trim()?.length == 0) throw new Error(requiredErrorMessage("Password"));
            password = value;
            if (value.length < 8) throw new Error(passwordErrorMessage("Password"));
        }),
        body("confirm_password").notEmpty().withMessage(requiredErrorMessage("Confirm Password")),
        body("confirm_password").custom(async (value) => {
            if (value?.trim()?.length == 0) throw new Error(requiredErrorMessage("Confirm Password"));
            if (password !== value) throw new Error(confirmMatchErrorMessage("Confirm Password"));
        }),
        body("country").notEmpty().withMessage(requiredErrorMessage("Country")),
        body("country").custom(async (value) => {
            const response = await axios.get(`${process.env.COUNTRY_API}`);
            const countries = response.data.data.map(country => country.country);
            if (!countries?.includes(value)) throw new Error(validErrorMessage("Country"));
        }),
        body("phone_number").notEmpty().withMessage(requiredErrorMessage("Phone Number")),
        body("phone_number").matches(/^[6-9]\d{9}$/).withMessage(validErrorMessage("Phone Number")),
        body("user_type").notEmpty().withMessage(requiredErrorMessage("User Type")).custom((value) => {
            if (value == 'superAdmin') throw new Error(isUserType())
            if (value != 'admin' && value != 'user' && value != 'superAdmin') throw new Error(isUserType());
            return true;
        })
    ]
    return result;
}

module.exports = registrationValidation;