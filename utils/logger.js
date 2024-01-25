const winston = require('winston');
require('winston-daily-rotate-file');

const customFormat = winston.format((info) => {
    // Exclude the stack trace parsing to remove file path
    return info;
})();

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: './logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        customFormat,
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console(),
        dailyRotateFileTransport
    ]
});

module.exports = logger;
