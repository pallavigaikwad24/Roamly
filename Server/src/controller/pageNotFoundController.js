const HTTP_CODE = require("../services/enum");
const { logErrorMessage } = require("../services/staticMessage");

const pageNotFoundController = (req, res) => {
    try {
        return res.status(HTTP_CODE.NOT_FOUND.code).send(HTTP_CODE.NOT_FOUND.message)
    } catch (error) {
        logger.error(logErrorMessage("accessing not found route"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = pageNotFoundController;