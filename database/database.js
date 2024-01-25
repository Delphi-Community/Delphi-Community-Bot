const sqlite3 = require('sqlite3').verbose();

const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        let database = new sqlite3.Database('./database/rss_feed.db', (err) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                console.log('Connected to the RSS feed database.');
                database.serialize(() => {
                    database.run('CREATE TABLE IF NOT EXISTS feed_items (title TEXT, link TEXT, pubDate TEXT)', (err) => {
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

module.exports = initializeDatabase;
