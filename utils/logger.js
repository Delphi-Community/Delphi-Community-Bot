const winston = require('winston');
require('winston-daily-rotate-file');
const { DiscordTransport } = require( 'winston-transport-discord' );

const customFormat = winston.format((info) => {
    return info;
})();

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: './logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
});

const transports = [
    new winston.transports.Console(),
    dailyRotateFileTransport
];

// Add Discord transport if environment variables are set
if (process.env.CHANNEL_ID_LOGS) {
    const transport = new DiscordTransport({
        discord: {
            bot: {
                channel: `${process.env.CHANNEL_ID_LOGS}`,
                token: `${process.env.DISCORD_TOKEN}`
            }
        }
    });
    transports.push(transport);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        customFormat,
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: transports
});

module.exports = logger;
