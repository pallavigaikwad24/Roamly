const { where } = require("sequelize");
const logger = require("../../config/logger");
const { sendMail } = require("../../email/emailSend");
const HTTP_CODE = require("../../services/enum");
const { logErrorMessage, otpSendSuccess } = require("../../services/staticMessage");
const otpEmailHtmlTemplate = require("../../utils/otpLoginHtmlTemplate");
const getModelInfo = require("../../services/getModelInfo");

const sendOtpController = async (req, res) => {
    try {

        const otp = Math.floor(1000 + Math.random() * 9000);

        const userArgs = {
            modelName: 'User',
            methodType: 'findOne',
            args: { where: { email: req.body.email } }
        }

        const user = await getModelInfo(userArgs);

        const argument = {
            modelName: 'OtpLogin',
            methodType: 'findOrCreate',
            args: { where: { user_id: user.id }, defaults: { otp } }
        }

        const [newEntry, created] = await getModelInfo(argument);

        if (!created) {
            const updateOtpArgument = {
                modelName: 'OtpLogin',
                methodType: 'update',
                args: [{ otp }, { where: { user_id: user.id } },]
            }

            await getModelInfo(updateOtpArgument);
        }

        sendMail(
            req.body.email,
            "Welcome to Our App!",
            `Hello ${req.body.email},\n\nUse the OTP below to log in to your account`,
            otpEmailHtmlTemplate(otp)
        );

        return res.status(HTTP_CODE.OK.code).send({ msg: otpSendSuccess(req.body.email) });
    } catch (error) {
        logger.error(logErrorMessage("sending Otp"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = sendOtpController;
