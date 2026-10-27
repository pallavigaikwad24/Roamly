const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const { logErrorMessage } = require("../../services/staticMessage");
const filterService = require("../../services/filterService");

const customFilterHotelController = async (req, res) => {
    try {
        const filterData = req.body;
        const allResult = await filterService(filterData);
        return res.status(HTTP_CODE.ACCEPTED.code).send(allResult);
    } catch (error) {
        logger.error(logErrorMessage("Custom Hotel Filter"), {
            method: req.method, url: `${req.get("Host")}${req.originalUrl}`, message: error.message, stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = customFilterHotelController;