const Parser = require('rss-parser');
const logger = require('../../utils/logger');
const { listRssFromStorage } = require('../../database/rssDatabase');
const parser = new Parser();

async function processRssFeed(url) {
    try {
        const feed = await parser.parseURL(url);
        logger.info(`Processing feed: ${feed.title}`);
        feed.items.forEach(item => {
            // For now, just log each item. Later, you can add logic to check if the item is new
            logger.info(`Title: ${item.title}, Link: ${item.link}`);
        });
    } catch (error) {
        logger.error(`Error processing RSS feed ${url}: ${error.message}`);
    }
}

async function fetchAndStoreRSSFeed() {
    try {
        const rssFeeds = await listRssFromStorage();
        for (const feed of rssFeeds) {
            await processRssFeed(feed.url);
        }
    } catch (error) {
        logger.error(`Error in fetchAndStoreRSSFeed: ${error.message}`);
    }
}

module.exports = { fetchAndStoreRSSFeed };
