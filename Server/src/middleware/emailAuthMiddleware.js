const { body } = require("express-validator");
const { requiredErrorMessage, validErrorMessage, notAvailableErrorMessage, notExistErrorMessage } = require("../services/staticMessage");
const getModelInfo = require("../services/getModelInfo");
const { where } = require("sequelize");

function emailAuthMiddleware() {
    return [
        body("email")
            .notEmpty()
            .withMessage(requiredErrorMessage("Email"))
            .isString()
            .withMessage(validErrorMessage("Email")),
        body("email").custom(async (value) => {
            const argument = {
                modelName: 'User',
                methodType: 'findOne',
                args: { where: { email: value } }
            };

            const isEmailValid = await getModelInfo(argument);

            if (!isEmailValid) throw new Error(notExistErrorMessage("Email", "registration").split(",")[0]);
        })
    ];
}

module.exports = emailAuthMiddleware;
