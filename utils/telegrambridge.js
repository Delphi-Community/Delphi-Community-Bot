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
        let messageContent = '';
        const telegramUser = msg.from.username ? `${msg.from.username}` : msg.from.first_name;

        // Construct the basic message content
        messageContent += `**${telegramUser}:** `;

        // Check if the message contains text and append it
        if (msg.text && msg.entities) {
            // Ensure msg.entities is defined and has elements
            msg.entities.sort((a, b) => a.offset - b.offset);
        
            let modifiedText = '';
            let lastIndex = 0;
        
            msg.entities.forEach(entity => {
                if (entity.type === "pre" && entity.language) {
                    const beforeCodeBlock = msg.text.substring(lastIndex, entity.offset);
                    const codeBlockText = msg.text.substring(entity.offset, entity.offset + entity.length);
                    const codeBlock = `\`\`\`${entity.language}\n${codeBlockText}\`\`\``;
                    
                    modifiedText += beforeCodeBlock + codeBlock;
                    lastIndex = entity.offset + entity.length;
                }
            });
        
            if (lastIndex < msg.text.length) {
                modifiedText += msg.text.substring(lastIndex);
            }

            if (modifiedText) {
                messageContent += modifiedText;
            }
        } else if (msg.text){
            messageContent += msg.text;
        }
        

        // Handle photos separately
        if (msg.photo) {
            // Get the highest quality photo file_id
            const fileId = msg.photo[msg.photo.length - 1].file_id;
            const fileUrl = await getFileUrl(fileId); // Ensure getFileUrl is implemented to fetch the actual URL

            // Append the photo URL to the message
            if (fileUrl) {
                messageContent += `\n[Image](${fileUrl})`;
            } else {
                messageContent += "\nImage content could not be retrieved.";
            }
        }

        // Handle documents (including non-image files) separately
        if (msg.document) {
            const fileId = msg.document.file_id;
            const fileUrl = await getFileUrl(fileId); // Ensure getFileUrl is implemented to fetch the actual URL

            // Append the document URL to the message
            if (fileUrl) {
                messageContent += `\n[Document](${fileUrl})`;
            } else {
                messageContent += "\nDocument content could not be retrieved.";
            }
        }

        messageContent = messageContent.replace(/@everyone/g, "@_everyone").replace(/@here/g, "@_here");

        const discordChannel = client.channels.cache.get(process.env.TELEGRAM_BOT_DISCORD_CHANNEL);
        if (discordChannel) {
            // Send the constructed message content as a normal text message
            await discordChannel.send(messageContent);
        } else {
            logger.error('Discord channel not found');
        }
    }
});



// Discord to Telegram forwarding
client.on('messageCreate', async message => {
    if (message.channelId === process.env.TELEGRAM_BOT_DISCORD_CHANNEL) {
        if (message.author.bot) return; // Ignore bot messages

        let msgContent = message.content
            .replace(/<a?:[^:]+:\d+>/g, '') // Remove custom emojis
            .replace(/<@!?(\d+)>/g, (match, userId) => { // Replace user mentions
                const user = message.guild.members.cache.get(userId);
                return user ? `@${user.user.username}` : "@someone";
            });

        // Escape MarkdownV2 special characters
        msgContent = msgContent.replace(/([_\-\.>])/g, '\\$&');

        msgContent = `${message.author.username}: ${msgContent}`;
        
        if (!msgContent.trim() && message.attachments.size === 0) {
            return; // Skip if there's nothing to send
        }

        // Send the text content to Telegram, if any
        if (msgContent.trim()) {
            try {
                await telegramBot.sendMessage(process.env.TELEGRAM_BOT_TELEGRAM_GROUP_ID, msgContent, {parse_mode: 'MarkdownV2'});
            } catch (error) {
                logger.error('Failed to send message text to Telegram:', error);
            }
        }

        // Send attachments
        message.attachments.forEach(async (attachment) => {
            // Determine if the attachment is an image (for simplicity, checking by common image file extensions)
            if (/\.(jpeg|jpg|png|gif)$/i.test(attachment.name)) {
                // Send as a photo
                try {
                    await telegramBot.sendPhoto(process.env.TELEGRAM_BOT_TELEGRAM_GROUP_ID, attachment.url);
                } catch (error) {
                    logger.error('Failed to send photo to Telegram:', error);
                }
            } else {
                // Send as a document
                try {
                    await telegramBot.sendMessage(process.env.TELEGRAM_BOT_TELEGRAM_GROUP_ID, attachment.url);
                } catch (error) {
                    logger.error('Failed to send document to Telegram:' + attachment.url, error);
                }
            }
        });
    }
});










module.exports = { telegramBot, client };