const { validationResult } = require("express-validator");
const HTTP_CODE = require("../services/enum");
const logger = require("../config/logger");
const { logErrorMessage, loginFailedErrMsg, validErrorMessage } = require("../services/staticMessage");
const { where, Op } = require("sequelize");
const getModelInfo = require("../services/getModelInfo");

async function validationResultFun(req, res, next) {
    try {
        const result = validationResult(req);
        let error = null;
        if (!result.isEmpty()) {
            error = result.array();

            if (result.errors[0].msg == validErrorMessage("Password") && result.errors[0].path == 'password') {

                const getUserArguments = {
                    modelName: 'User',
                    methodType: 'findOne',
                    args: { where: { [Op.or]: [{ email: req.body.username }, { phone_number: req.body.username }] } }
                }

                const getUser = await getModelInfo(getUserArguments);

                if (getUser) {

                    const argument = {
                        modelName: 'LoginAuthModel',
                        methodType: 'findOrCreate',
                        args: { where: { user_id: getUser.id }, defaults: { failed_attempts: 1 } }
                    }
                    const [newEntry, created] = await getModelInfo(argument);

                    const now = new Date();
                    const lockTime = new Date(Date.now() + 10 * 60 * 1000);

                    if (newEntry.lock_until && now < newEntry.lock_until) {
                        const remainingTime = Math.ceil((newEntry.lock_until - now) / 1000 / 60);
                        return res.status(HTTP_CODE.FORBIDDEN.code).send({ msg: loginFailedErrMsg(remainingTime) })
                    } else if (newEntry.lock_until && now >= newEntry.lock_until) {
                        newEntry.failed_attempts = 0;
                        newEntry.lock_until = null;
                        await newEntry.save();
                        return;
                    }

                    if (!created)
                        newEntry.failed_attempts += 1;

                    if (newEntry.failed_attempts >= 5) {
                        newEntry.lock_until = lockTime;
                    }
                    await newEntry.save();
                }

            }
            return res.status(HTTP_CODE.FORBIDDEN.code).send(error);
        }
        next();

    } catch (error) {
        logger.error(logErrorMessage("Login Authentication"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.msg,
            stack: error.stack,
        });
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }

}

module.exports = validationResultFun;
