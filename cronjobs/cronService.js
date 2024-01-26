const cron = require('node-cron');
const logger = require('../utils/logger');
const { fetchAndStoreRSSFeed } = require('./RSS/rssService');

function startCronJob() {
  cron.schedule('*/10 * * * *', runJob);
}

async function runJob() {
  logger.info('Checking for new RSS entries...');
  await fetchAndStoreRSSFeed;
}

module.exports = { startCronJob, runJob };
