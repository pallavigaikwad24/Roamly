const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const { logErrorMessage, logoutSucess } = require("../../services/staticMessage");

const logoutController = async (req, res) => {
    try {
        // Using Passport
        req.logout(function (err) {
            if (err) {
                console.log(err);
                return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
            }
            req.session.destroy((error) => {
                if (err) {
                    logger.error(logErrorMessage("Logout"), {
                        method: req.method,
                        url: `${req.get("Host")}${req.originalUrl}`,
                        message: error.msg,
                        stack: error.stack,
                    });

                    return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
                }
                res.clearCookie("user_session");
                return res.status(HTTP_CODE.OK.code).send({ msg: logoutSucess() });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
};

module.exports = logoutController;