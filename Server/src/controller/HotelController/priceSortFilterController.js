const { where, Op } = require("sequelize");
const logger = require("../../config/logger");
const { logErrorMessage } = require("../../services/staticMessage");
const getModelInfo = require("../../services/getModelInfo");
const HTTP_CODE = require("../../services/enum");

const priceSortFilterController = async (req, res) => {
    try {
        const { leastPrice, selectedPrice } = req.body;
        const arguments = {
            modelName: 'HotelModel',
            methodType: 'findAll',
            args: { where: { price_per_night: { [Op.gte]: leastPrice, [Op.lte]: selectedPrice } } }
        }
        const result = await getModelInfo(arguments);
        return res.status(HTTP_CODE.OK.code).send(result);
    } catch (error) {
        logger.error(logErrorMessage("Price Sort Filter"), {
            method: req.method, url: `${req.get("Host")}${req.originalUrl}`, message: error.message, stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = priceSortFilterController;