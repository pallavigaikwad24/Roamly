const { where } = require("sequelize");
const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const { logErrorMessage } = require("../../services/staticMessage");
const getModelInfo = require("../../services/getModelInfo");
const path = require("path");
const fs = require("fs");

const deleteCustomeImageController = async (req, res) => {
    try {
        const { hotel_id, imageIdx } = req.body;
        const arguments = {
            modelName: 'HotelModel',
            methodType: 'findOne',
            args: { where: { owner_id: req.user.id, id: hotel_id }, attributes: ['id', 'images'] }
        };

        const hotelInfo = await getModelInfo(arguments);
        const imageList = JSON.parse(hotelInfo.images);
        const deletedImgInfo = imageList[imageIdx];
        const filteredImageList = imageList.filter((_, index) => index != imageIdx);

        hotelInfo.images = JSON.stringify(filteredImageList);
        await hotelInfo.save();

        const deleteImagePath = path.join(__dirname, "../../../public/hotelPictures/upload", req.user.id.toString(), hotel_id.toString(), deletedImgInfo);
        if (fs.existsSync(deleteImagePath)) {
            fs.rm(deleteImagePath, { recursive: true });
        }
        return res.status(HTTP_CODE.OK.code).send(hotelInfo);
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

module.exports = deleteCustomeImageController;