const logger = require("../config/logger");
const HTTP_CODE = require("../services/enum");

const serverCrashPreventMiddleware = (err, req, res, next) => {
    if (err) {
        logger.error(HTTP_CODE.INTERNAL_SERVER_ERROR.message, {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: err.message,
            stack: err.stack,
        });

        return res.status(HTTP_CODE.INTERNAL_SERVER_ERROR.code).send(HTTP_CODE.INTERNAL_SERVER_ERROR.message);
    }
    return next();
}

module.exports = serverCrashPreventMiddleware;