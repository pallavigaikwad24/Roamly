const { body, param } = require("express-validator");
const { requiredErrorMessage, notExistErrorMessage, validErrorMessage, existErrorMessage, otpExpireErrorMessage, otpIncorrectErrorMessage } = require("../services/staticMessage");
const { where } = require("sequelize");
const getModelInfo = require("../services/getModelInfo");
const { getUserInfo } = require("../services/getUserInfo");
const { OtpLogin } = require("../models");

function emailValidation() {
    const result = [
        body("email").notEmpty().withMessage(requiredErrorMessage('Email ID')),
        body("email").custom(async (value) => {
            if (value?.trim()?.length == 0) throw new Error(requiredErrorMessage('Email ID'));
            let arguments = getUserInfo(value, "email");
            const user = await getModelInfo(arguments);
            if (!user) {
                throw new Error(notExistErrorMessage("Email ID", "Register"))
            }
            return true;
        }),
    ];
    return result;
}

function emailParamValidation() {
    const result = [
        body("otp").notEmpty().withMessage(requiredErrorMessage("OTP")),
        body("otp").custom(async (value, { req }) => {

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            const email = req.params.email;
            if (!email) throw new Error(requiredErrorMessage("Email"));
            if (parseInt(email)) throw new Error(validErrorMessage("Email"));
            if (!emailRegex.test(email)) throw new Error(validErrorMessage("Email"));

            const argument = {
                modelName: 'User', methodType: 'findOne',
                args: {
                    where: { email: email }, attributes: ['id'],
                    include: [{ model: OtpLogin, attributes: ['otp', 'updatedAt',] }]
                }
            }
            const userOtp = await getModelInfo(argument);

            if (!userOtp) throw new Error(notExistErrorMessage("Email", "Register"));
            if (userOtp.OtpLogin.otp != value) throw new Error(otpIncorrectErrorMessage())

            const initialTime = new Date(userOtp.OtpLogin.updatedAt);
            const currTime = new Date();
            const timeDiff = currTime.getTime() - initialTime.getTime();
            const timeDiffInMin = timeDiff / (1000 * 60);

            if (timeDiffInMin > 10) {
                const argument = {
                    modelName: 'OtpLogin',
                    methodType: 'update',
                    args: [
                        { is_valid: false },
                        { where: { user_id: userOtp.id } }
                    ]
                }
                await getModelInfo(argument);
                throw new Error(otpExpireErrorMessage())
            };
            return true;
        })
    ];
    return result;
}

module.exports = { emailValidation, emailParamValidation };