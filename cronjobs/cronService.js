const cron = require('node-cron');
const { fetchAndStoreRSSFeed } = require('./rss/rssService');
// const config = require('./config');

function startCronJob() {
    cron.schedule('*/10 * * * *', () => { // 10 is interval in minutes
        console.log('Checking for new RSS entries...');
        // config.RSS_FEED_URLS.forEach(url => {
        //     fetchAndStoreRSSFeed(url);
        // });
    });
}

module.exports = { startCronJob };