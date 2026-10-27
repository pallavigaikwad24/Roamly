const HTTP_CODE = require("../../services/enum");
const getModelInfo = require("../../services/getModelInfo");
const logger = require("../../config/logger");
const { logErrorMessage } = require("../../services/staticMessage");
const path = require("path");
const fs = require("fs");
const { where } = require("sequelize");

const hotelController = async (req, res) => {
    try {
        const { name, location,  country, price_per_night, available_rooms, services } = req.body;
        const imagePaths = [];
        const userId = req.user.id;

        const arguments = {
            modelName: 'HotelModel',
            methodType: 'create',
            args: { owner_id: req.user.id, name, location,  country, price_per_night, available_rooms, services }
        }

        const newHotelInfo = await getModelInfo(arguments);

        if (req.files) {
            for (const file of req.files) {
                const userDirPath = path.join(__dirname, "../../../public/hotelPictures/upload/", userId.toString(), newHotelInfo.id.toString());

                // Create the user-specific directory if it doesn't exist
                if (!fs.existsSync(userDirPath)) {
                    fs.mkdirSync(userDirPath, { recursive: true });
                }

                const src = path.join(__dirname, "../../../public/hotelPictures/temp/", file.filename);
                const dest = path.join(userDirPath, file.originalname);

                fs.copyFileSync(src, dest);
                imagePaths.push(file.originalname);
            }

            newHotelInfo.images = JSON.stringify(imagePaths);
            await newHotelInfo.save();
        }

        return res.status(HTTP_CODE.OK.code).send(newHotelInfo);
    } catch (error) {
        logger.error(logErrorMessage("Adding Hotel Details"), {
            method: req.method,
            url: `${req.get("Host")}${req.originalUrl}`,
            message: error.message,
            stack: error.stack,
        });
        return res.status(HTTP_CODE.BAD_REQUEST.code).send(HTTP_CODE.BAD_REQUEST.message);
    }
}

module.exports = hotelController;