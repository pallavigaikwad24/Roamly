const { where } = require("sequelize");
const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const { logErrorMessage } = require("../../services/staticMessage");
const getModelInfo = require("../../services/getModelInfo");
const fs = require("fs");
const path = require("path");

const deleteAllHotelImageController = async (req, res) => {
    try {

        const src = path.join(__dirname, "../../../public/hotelPictures/upload", req.user.id.toString(), req.body.hotel_id.toString());
        if (fs.existsSync(src)) {
            fs.rmdirSync(src, { recursive: true, force: true });
        }

        const arguments = {
            modelName: 'HotelModel',
            methodType: 'update',
            args: [
                { images: '[/defaultImg/image.png]' },
                { where: { id: req.body.hotel_id, owner_id: req.user.id } }
            ]
        }
        const result = await getModelInfo(arguments);
        return res.status(HTTP_CODE.OK.code).send(result);
    } catch (error) {
        logger.error(logErrorMessage("Adding Images Into Exiting Hotel Images"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        console.log(error);
        return res.status(HTTP_CODE.BAD_REQUEST.code).send({ message: error.message });
    }
}

module.exports = deleteAllHotelImageController;