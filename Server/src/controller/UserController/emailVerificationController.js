const { where } = require("sequelize");
const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const logger = require("../../config/logger");
const { logErrorMessage, successEmailVerification } = require("../../services/staticMessage");

const emailVerificationController = async (req, res) => {
    try {
        const { token } = req.params;

        const tokenargs = {
            modelName: 'EmailVerificationToken',
            methodType: 'findOne',
            args: { attributes: ['user_id'], where: { token } }
        };

        const tokenInfo = await getModelInfo(tokenargs);

        const arguments = {
            modelName: 'User',
            methodType: 'update',
            args: [
                { is_verified: true },
                { where: { id: tokenInfo.user_id } }
            ]
        }

        await getModelInfo(arguments);
        return res.status(HTTP_CODE.ACCEPTED.code).send({ msg: successEmailVerification() });
    } catch (error) {
        logger.error(logErrorMessage("email verification"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = emailVerificationController;