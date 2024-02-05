const { Events } = require('discord.js');
const { startCronJob } = require('../cronjobs/cronService');
const logger = require('../utils/logger');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        //RSS-Cronjob
        startCronJob(); 

        //Start telegram bridge
        const { telegramBot, discordClient } = require('../utils/telegrambridge');
    },
};