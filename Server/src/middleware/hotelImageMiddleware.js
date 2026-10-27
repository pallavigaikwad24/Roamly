const { body } = require("express-validator");
const { requiredErrorMessage, validErrorMessage, notExistErrorMessage, imageTypeErrorMessage, fileSizeErrorMessage, fileCountErrorMessage } = require("../services/staticMessage");
const { where } = require("sequelize");
const getModelInfo = require("../services/getModelInfo");
const path = require("path");
const fs = require("fs");

const hotelImageMiddleware = () => {
    return [
        body("hotel_id").notEmpty().withMessage(requiredErrorMessage("Hotel ID"))
            .custom(async (value) => {
                const arguments = { modelName: 'HotelModel', methodType: 'findOne', args: { where: { id: value } } };

                const isIDExists = await getModelInfo(arguments);
                if (!isIDExists) throw new Error(notExistErrorMessage("Hotel ID", "enter correct Hotel ID"));

            }),
        body("hotel_img").custom(async (value, { req }) => {
            if (req.files.length == 0 && !value) throw new Error(requiredErrorMessage("Hotel Images"));

            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            req.files.forEach((file) => {
                if (!allowedTypes.includes(file.mimetype)) throw new Error(imageTypeErrorMessage());

                // 5MB limit
                if (file.size > 1024 * 1024 * 5) throw new Error(fileSizeErrorMessage('5MB'));
            });

            const arguments = {
                modelName: 'HotelModel', methodType: 'findOne',
                args: { where: { id: req.body.hotel_id, owner_id: req.user.id }, attributes: ['images'] }
            };
            const existingImages = await getModelInfo(arguments);
            const existingImageList = JSON.parse(existingImages.images);

            const totalLength = existingImageList.length + req.files.length;
            if (totalLength > 5) throw new Error(fileCountErrorMessage(5));

            return true;

        })
    ]
}

const deleteHotelImageMiddleware = () => {
    return [
        body("hotel_id").notEmpty().withMessage(requiredErrorMessage("Hotel ID"))
            .custom(async (value, { req }) => {
                const arguments = { modelName: 'HotelModel', methodType: 'findOne', args: { where: { id: value } } };

                const isIDExists = await getModelInfo(arguments);
                if (!isIDExists) throw new Error(notExistErrorMessage("Hotel ID", "enter correct Hotel ID"));

                const src = path.join(__dirname, "../../../public/hotelPictures/upload", req.user.id.toString(), req.body.hotel_id.toString());
                if (!fs.existsSync(src)) throw new Error(notExistErrorMessage("Images you want to delete").split(".")[0]);

                return true;
            }),
    ]
}

const deleteCustomeImageMiddleware = () => {
    return [
        body("hotel_id").notEmpty().withMessage(requiredErrorMessage("Hotel ID"))
            .custom(async (value, { req }) => {
                const arguments = { modelName: 'HotelModel', methodType: 'findOne', args: { where: { id: value } } };
                const hotelInfo = await getModelInfo(arguments);
                if (!hotelInfo) throw new Error(notExistErrorMessage("Hotel ID", "enter correct Hotel ID"));
                let imgList = JSON.parse(hotelInfo.images);
                if (imgList.length == 0) {
                    hotelInfo.images = '[/defaultImg/image.png]';
                    await hotelInfo.save();
                }

                const isValueExists = imgList[req.body?.imageIdx];
                if (!isValueExists) throw new Error(notExistErrorMessage("Image you want to delete").split(".")[0]);

                const deleteImagePath = path.join(__dirname, "../../../public/hotelPictures/upload", req.user.id.toString(),
                    value.toString(), isValueExists);

                if (!fs.existsSync(deleteImagePath)) throw new Error(notExistErrorMessage("Image you want to delete").split(".")[0]);
                return true;
            }),
        body("imageIdx").notEmpty().withMessage(requiredErrorMessage("Image Index"))
            .isNumeric().withMessage(validErrorMessage("Image Index")),
    ]
}


module.exports = { hotelImageMiddleware, deleteHotelImageMiddleware, deleteCustomeImageMiddleware };