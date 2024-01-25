const { Events } = require('discord.js');
const { startCronJob } = require('../cronjobs/cronService');
const logger = require('../utils/logger');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
			logger.info(`Ready! Logged in as ${client.user.tag}`);

        // Initialize the database and then start the cron job
        startCronJob();
    },
};