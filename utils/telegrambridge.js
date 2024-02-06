require('dotenv').config();
const { EmbedBuilder } = require('discord.js');
const TelegramBot = require('node-telegram-bot-api');
const logger = require('../utils/logger');
const { client } = require('./clientInstance');


const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

// Function to get the URL of a Telegram file
async function getFileUrl(fileId) {
    try {
        const file = await telegramBot.getFile(fileId);
        const filePath = file.file_path;
        const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;
        return fileUrl;
    } catch (error) {
        logger.error('Failed to get file URL from Telegram:', error);
        return null;
    }
}


// Telegram to Discord forwarding
telegramBot.on('message', async (msg) => {
    if (msg.chat.id.toString() === process.env.TELEGRAM_BOT_TELEGRAM_GROUP_ID) {
        const telegramUser = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
        let description = `**${telegramUser}:** `;

        // Check if the message contains text
        if (msg.text) {
            description += msg.text;
        }

        // Initialize EmbedBuilder with default description
        const embed = new EmbedBuilder()
            .setDescription(description)
            .setColor(0x0088cc);

        // Handle photos and documents separately
        if (msg.photo || msg.document) {
            // Get the highest quality photo or document file_id
            const fileId = msg.photo ? msg.photo[msg.photo.length - 1].file_id : msg.document.file_id;
            const fileUrl = await getFileUrl(fileId);

            if (fileUrl) {
                if (msg.photo) {
                  embed.setDescription(description).setThumbnail(fileUrl);
                } else {
                  embed.setDescription(`${description} ${fileUrl}`);  
                }
                
            } else {
                embed.setDescription(description + "\nImage content could not be retrieved.");
            }
        }

        const discordChannel = client.channels.cache.get(process.env.TELEGRAM_BOT_DISCORD_CHANNEL);
        if (discordChannel){
            if (msg.photo || msg.document || msg.text) {
                await discordChannel.send({ embeds: [embed] });
            }
        } else {
            logger.error('Discord channel not found');
        }
    }
});


// Discord to Telegram forwarding
client.on('messageCreate', async message => {
    if (message.channelId === process.env.TELEGRAM_BOT_DISCORD_CHANNEL) {
        if (message.author.bot) return; // Ignore bot messages

        let msgContent = message.content ? `${message.author.username}: ${message.content}` : '';

        // Check if there are attachments in the message
        if (message.attachments.size > 0) {
            const attachmentsUrls = message.attachments.map(attachment => {
                // Get the URL without any query parameters
                const url = new URL(attachment.url);
                return `${url.protocol}//${url.hostname}${url.pathname}`;
            });
            // Append each cleaned attachment URL to the message content
            const attachmentsMsg = attachmentsUrls.join('\n');
            msgContent += (msgContent ? '\n' : '') + attachmentsMsg;
        }

        // If there's no text or attachment, set a default message
        if (!msgContent.trim()) {
            msgContent = 'This message contains an attachment or embed and cannot be displayed.';
        }

        // Send the composed message or cleaned attachment URLs to Telegram
        try {
            await telegramBot.sendMessage(process.env.TELEGRAM_BOT_TELEGRAM_GROUP_ID, msgContent);
        } catch (error) {
            logger.error('Failed to send message to Telegram:', error);
        }
    }
});



module.exports = { telegramBot, client };
