const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const { logErrorMessage, isEmailVerificationErrorMessage } = require("../../services/staticMessage");
const getModelInfo = require("../../services/getModelInfo");
const { where } = require("sequelize");

function getArgument(value, param) {
    const arguments = {
        modelName: 'User',
        methodType: "findOne",
        args: { where: { [param]: value } }
    }
    return arguments;
}

const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        let userInfo = null;
        if (username) {
            if (password) {
                const updateArgs = {
                    modelName: 'LoginAuthModel',
                    methodType: 'update',
                    args: [{ failed_attempts: 0 }, { where: { user_id: req.user.id } }]
                }
                await getModelInfo(updateArgs);
            }

            let argument = null;
            if (parseInt(username)) {
                argument = getArgument(username, "phone_number");
            }
            else {
                argument = getArgument(username, "email");
            }

            userInfo = await getModelInfo(argument);
            if (!userInfo.is_verified) return res.status(HTTP_CODE.FORBIDDEN.code).send({ msg: isEmailVerificationErrorMessage() });
        }
        if (req.params.email) {
            userInfo = await getModelInfo(getArgument(req.params.email, "email"));
            if (!userInfo.is_verified) return res.status(HTTP_CODE.FORBIDDEN.code).send({ msg: isEmailVerificationErrorMessage() });
        }

        return res.status(HTTP_CODE.ACCEPTED.code).send(userInfo);

    } catch (error) {
        logger.error(logErrorMessage("Login"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send({ message: error.message });
    }
}

module.exports = loginController;