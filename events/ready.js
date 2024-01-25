const { Events } = require('discord.js');
const initializeDatabase = require('../database/database'); // This is now a function
const { startCronJob } = require('../cronjobs/cronService');
const logger = require('../utils/logger');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
			logger.info(`Ready! Logged in as ${client.user.tag}`);

        // Initialize the database and then start the cron job
        initializeDatabase()
            .then((database) => {
                // You can use 'database' here if needed
                startCronJob();
            })
            .catch(err => {
							logger.error('Failed to connect to the database:', err);
            });
    },
};