const multer = require('multer');
const fs = require('fs');
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const dirPath = path.join(__dirname, '../../public/hotelPictures/temp');

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        return cb(null, dirPath);
    },
    filename: function (req, file, cb) {
        const timestampedFilename = `${Date.now()}-${file.originalname}`;
        return cb(null, timestampedFilename);
    }
});

const upload = multer({
    storage: storage,
});

module.exports = upload;

