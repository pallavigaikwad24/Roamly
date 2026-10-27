const { body } = require("express-validator");
const { requiredErrorMessage, validErrorMessage, existErrorMessage, notExistErrorMessage } = require("../services/staticMessage");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const getModelInfo = require("../services/getModelInfo");
const { getUserInfo } = require("../services/getUserInfo");

function loginValidation() {
    const result = [
        body("username").notEmpty().withMessage(requiredErrorMessage('Mobile Number or Email ID')),
        body("username").custom(async (value) => {
            if (value?.trim()?.length == 0) throw new Error(requiredErrorMessage('Mobile Number or Email ID'));
            let arguments = null;
            if (parseInt(value)) arguments = getUserInfo(value, "phone_number");
            else arguments = getUserInfo(value, "email");
            const user = await getModelInfo(arguments);
            if (!user) {
                if (parseInt(value)) throw new Error(notExistErrorMessage("Phone Number", "Register"))
                else throw new Error(notExistErrorMessage("Email ID", "Register"))
            }
        }),
        body("password").notEmpty().withMessage(requiredErrorMessage("Password")),
        body("password").custom(async (value, { req }) => {
            if (value?.trim()?.length == 0) throw new Error(requiredErrorMessage('Passward'));
            let arguments = null;

            if (parseInt(req.body.username)) arguments = getUserInfo(req.body.username, "phone_number");
            else arguments = getUserInfo(req.body.username, "email");

            const user = await getModelInfo(arguments);
            if (user) {
                const isValidPass = bcrypt.compareSync(value, user?.password);
                if (!isValidPass) throw new Error(validErrorMessage("Password"));
            } else throw new Error(validErrorMessage("password"))
        })
    ];
    return result;
}

module.exports = loginValidation;
