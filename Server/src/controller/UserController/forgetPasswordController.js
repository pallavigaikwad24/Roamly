const { where, Op } = require("sequelize");
const bcrypt = require("bcrypt");
const getModelInfo = require("../../services/getModelInfo");
const HTTP_CODE = require("../../services/enum");
const { expireTokenErrorMessage, logErrorMessage, forgetPasswordSuccess } = require("../../services/staticMessage");
const logger = require("../../config/logger");

const forgetPasswordController = async (req, res) => {
    try {
        const { password } = req.body;
        const token = req.query.token;
        const email = req.session.email;

        const findOneArguments = {
            modelName: 'PasswordResetToken', methodType: "findOne",
            args: { where: { token, expireToken: { [Op.gt]: Date.now() } } },
        };

        const currToken = await getModelInfo(findOneArguments);
        if (!currToken) {
            return res.status(HTTP_CODE.NOT_FOUND.code).send({ msg: expireTokenErrorMessage() });

        } else {
            const updateArguments = {
                modelName: 'User',
                methodType: "update",
                args: [{ password: bcrypt.hashSync(password, 8) }, { where: { email } }],
            };

            const userInfo = await getModelInfo(updateArguments);

            const removeTokenArgument = {
                modelName: 'PasswordResetToken', methodType: 'destroy',
                args: { where: { user_id: userInfo.id } }
            }
            await getModelInfo(removeTokenArgument);
            return res.status(HTTP_CODE.OK.code).send({ msg: forgetPasswordSuccess() });
        }
    } catch (error) {
        logger.error(logErrorMessage("Forget Password"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
};

module.exports = forgetPasswordController;
