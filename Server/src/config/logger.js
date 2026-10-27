const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

// Create a daily rotating file transport
const logDir = path.join(__dirname, "../../public/logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new DailyRotateFile({
    filename: path.join(logDir, "%DATE%-app.log"),
    datePattern: "MM-DD-YYYY",
    maxSize: "20m",
    maxFiles: "30d",
});

// Create a Logger
const logger = winston.createLogger({
    level: "error",
    format: winston.format.combine(
        winston.format.timestamp({ format: "MM-DD-YYYY HH-mm-ss" }),
        winston.format.printf(({ timestamp, level, message, method, url }) => {
            return `${method}: ${url} ${timestamp} [${level}]: ${message}`;
        })
    ),

    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),

        dailyRotateFileTransport,
    ],
});

module.exports = logger;
