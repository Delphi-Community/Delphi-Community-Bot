const Parser = require('rss-parser');
const parser = new Parser();
const logger = require('../../utils/logger');
const { listRssFromStorage, updateLatestEntryDate } = require('../../database/rssDatabase');
const { client } = require('../../utils/clientInstance');

async function processRssFeed(feed) {
    try {
        const rssData = await parser.parseURL(feed.url);
        for (const item of rssData.items) {
            const pubDate = new Date(item.isoDate);
            const latestEntryDate = feed.latest_entry_date ? new Date(feed.latest_entry_date) : new Date(0);
            
            if (pubDate > latestEntryDate) {
                const channel = client.channels.cache.get(feed.channel_id);
                if (channel && channel.type === 15 && item.contentSnippet.length<2000) { //channel.type === 15 GUILD FORUM
                    
                    await channel.threads.create({
                        name: item.title,
                        message: { content: `${item.contentSnippet}\n\nSource: ${item.link}` },
                        autoArchiveDuration: 60, 
                    });
                    
                    await updateLatestEntryDate(feed.id, pubDate.toISOString());
                }
            }
        }
    } catch (error) {
        logger.error(`Error processing RSS feed ${feed.url}: ${error.message}`);
    }
}

async function fetchAndStoreRSSFeed() {
    try {
        const rssFeeds = await listRssFromStorage();
        for (const feed of rssFeeds) {
            await processRssFeed(feed);
        }
    } catch (error) {
        logger.error(`Error in fetchAndStoreRSSFeed: ${error.message}`);
    }
}

module.exports = { fetchAndStoreRSSFeed };