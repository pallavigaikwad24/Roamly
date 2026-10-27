const { param } = require("express-validator");
const { requiredErrorMessage, notExistErrorMessage, validErrorMessage, tokenErrorMessage } = require("../services/staticMessage");
const { where } = require("sequelize");
const getModelInfo = require("../services/getModelInfo");


function emailVerficationMiddleware() {
    const result = [
        param("token").notEmpty().withMessage(requiredErrorMessage('Token')),
        param("token").custom(async (value) => {
            if (value?.trim()?.length == 0) throw new Error(requiredErrorMessage('Token'));

            const argument = {
                modelName: 'EmailVerificationToken',
                methodType: 'findOne',
                args: { where: { token: value } }
            }

            const isExists = await getModelInfo(argument);
            if (!isExists) throw new Error(tokenErrorMessage(value));

            return true;
        }),
    ];
    return result;
}

module.exports = emailVerficationMiddleware;