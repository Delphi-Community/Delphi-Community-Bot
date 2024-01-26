const sqlite3 = require('sqlite3').verbose();
const logger = require('../utils/logger');

// Initialize and set up the database
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        const database = new sqlite3.Database('./database/rss_feed.db', (err) => {
            if (err) {
                logger.error(err.message);
                reject(err);
            } else {
                database.serialize(() => {
                    database.run(`CREATE TABLE IF NOT EXISTS rss_channels (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        url TEXT,
                        channel_id TEXT,
                        latest_entry_date TEXT
                    )`, err => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(database);
                        }
                    });
                });
            }
        });
    });
};

// Add an RSS feed to the database
const addRssToStorage = (rssUrl, channelId) => {
    return new Promise((resolve, reject) => {
        initializeDatabase().then(database => {
            const query = 'INSERT INTO rss_channels (url, channel_id) VALUES (?, ?)';
            database.run(query, [rssUrl, channelId], (err) => {
                if (err) {
                    logger.error(`Error adding RSS feed to database: ${err.message}`);
                    reject(err);
                } else {
                    logger.info(`RSS feed added to database: URL = ${rssUrl}, Channel ID = ${channelId}`);
                    resolve();
                }
            });
        }).catch(err => {
            logger.error(`Error initializing database: ${err.message}`);
            reject(err);
        });
    });
};

const removeRssFromStorage = (id) => {
    return new Promise((resolve, reject) => {
        initializeDatabase().then(database => {
            const query = 'DELETE FROM rss_channels WHERE id = ?';
            database.run(query, [id], (err) => {
                if (err) {
                    logger.error(`Error removing RSS feed from database: ${err.message}`);
                    reject(err);
                } else {
                    logger.info(`RSS feed with ID ${id} removed from database`);
                    resolve();
                }
            });
        }).catch(err => {
            logger.error(`Error initializing database: ${err.message}`);
            reject(err);
        });
    });
};

const listRssFromStorage = () => {
    return new Promise((resolve, reject) => {
        initializeDatabase().then(database => {
            const query = 'SELECT * FROM rss_channels';
            database.all(query, [], (err, rows) => {
                if (err) {
                    logger.error(`Error querying RSS feeds from database: ${err.message}`);
                    reject(err);
                } else {
                    logger.info('Retrieved RSS feeds from database');
                    resolve(rows);
                }
            });
        }).catch(err => {
            logger.error(`Error initializing database: ${err.message}`);
            reject(err);
        });
    });
};

const updateLatestEntryDate = (feedId, newDate) => {
    return new Promise((resolve, reject) => {
        initializeDatabase().then(database => {
            const query = 'UPDATE rss_channels SET latest_entry_date = ? WHERE id = ?';
            database.run(query, [newDate, feedId], (err) => {
                if (err) {
                    logger.error(`Error updating latest entry date in database: ${err.message}`);
                    reject(err);
                } else {
                    logger.info(`Updated latest entry date for feed ID ${feedId}`);
                    resolve();
                }
            });
        }).catch(err => {
            logger.error(`Error initializing database: ${err.message}`);
            reject(err);
        });
    });
};

module.exports = {
    addRssToStorage,
    listRssFromStorage,
    removeRssFromStorage,
    updateLatestEntryDate
};
