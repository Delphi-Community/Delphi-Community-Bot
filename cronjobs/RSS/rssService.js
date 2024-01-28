const Parser = require('rss-parser');
const parser = new Parser();
const logger = require('../../utils/logger');
const { listRssFromStorage, updateLatestEntryDate } = require('../../database/rssDatabase');
// In other files
const { client } = require('../../utils/clientInstance');



// Use 'client' as needed


async function processRssFeed(feed) {
    try {

        const rssData = await parser.parseURL(feed.url);
        for (const item of rssData.items) {
            const pubDate = new Date(item.pubDate);
            const latestEntryDate = feed.latest_entry_date ? new Date(feed.latest_entry_date) : new Date(0);
            

            const channel = client.channels.cache.get(feed.channel_id);

            // Consider updating the latest entry date here
            // await updateLatestEntryDate(feed.id, pubDate.toISOString());
                

            
            if (pubDate > latestEntryDate) {
                const channel = client.channels.cache.get(feed.channel_id);
                if (channel && channel.type === 15) {
                    //channel.type === 15 GUILD FORUM
                
                    await channel.threads.create({
                        name: item.title,
                        message: { content: item.content },
                        autoArchiveDuration: 60, // Replace with actual tag IDs
                    });
                    
                    // await channel.threads.create({ name: 'Test12345', message: { content: 'Dies ist ein Test!' } });

                    // await channel.threads.create(
                    //     { name: 'Post name', message: { content: 'Message content' } }
                    //     );
                    // Consider updating the latest entry date here
                    // await updateLatestEntryDate(feed.id, pubDate.toISOString());
                }
            }
        }
    } catch (error) {
        logger.error(`Error processing RSS feed ${feed.url}: ${error.message}`);
    }
}






async function fetchAndStoreRSSFeed() {
    // try {
        const rssFeeds = await listRssFromStorage();
        for (const feed of rssFeeds) {
            await processRssFeed(feed);
        }
    // } catch (error) {
    //     logger.error(`Error in fetchAndStoreRSSFeed: ${error.message}`);
    // }
}

module.exports = { fetchAndStoreRSSFeed };
