const logger = require("../../config/logger");
const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const { logErrorMessage } = require("../../services/staticMessage");
const path = require("path");
const fs = require("fs");

const hotelImageController = async (req, res) => {
    try {
        const { hotel_id } = req.body;
        const userId = req.user.id;
        const arguments = {
            modelName: 'HotelModel', methodType: 'findOne',
            args: { where: { id: hotel_id, owner_id: userId }, attributes: ['id', 'owner_id', 'images'] }
        };
        let existingImages = await getModelInfo(arguments);
        let existingImageList = JSON.parse(existingImages.images);
        let images = req.files;
        if (images) {

            const userDirPath = path.join(__dirname, "../../../public/hotelPictures/upload/", userId.toString(), hotel_id.toString());

            // Create the user-specific directory if it doesn't exist
            if (!fs.existsSync(userDirPath)) {
                fs.mkdirSync(userDirPath, { recursive: true });
            }

            images.forEach(img => {
                existingImageList.push(img.originalname);
                const src = path.join(__dirname, "../../../public/hotelPictures/temp/", img.filename);
                const dest = path.join(userDirPath, img.originalname);

                fs.copyFileSync(src, dest);
            });

            existingImages.images = JSON.stringify(existingImageList);
            await existingImages.save();
        }

        return res.status(HTTP_CODE.ACCEPTED.code).send(existingImages);
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

module.exports = hotelImageController;