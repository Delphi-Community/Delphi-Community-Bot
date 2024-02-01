const cron = require('node-cron');
const logger = require('../utils/logger');
const { fetchAndStoreRSSFeed } = require('./RSS/rssService');

function startCronJob() {
  cron.schedule('*/10 * * * *', runJob);
}

async function runJob() {
  await fetchAndStoreRSSFeed();
}

module.exports = { startCronJob, runJob };
