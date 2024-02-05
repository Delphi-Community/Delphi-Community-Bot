require('dotenv').config();
const { EmbedBuilder } = require('discord.js');
const TelegramBot = require('node-telegram-bot-api');
const logger = require('../utils/logger');
const { client } = require('./clientInstance');


const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

// Telegram to Discord forwarding
telegramBot.on('message', (msg) => {
    if (msg.chat.id.toString() === process.env.TELEGRAM_BOT_TELEGRAM_GROUP_ID) {
        const telegramUser = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
        const embed = new EmbedBuilder()
            .setDescription(`**${telegramUser}:** ${msg.text}`)
            .setColor(0x0088cc);

        const discordChannel = client.channels.cache.get(process.env.TELEGRAM_BOT_DISCORD_CHANNEL);
        if (discordChannel) {
            discordChannel.send({ embeds: [embed] });
        } else {
            logger.error('Discord channel not found');
        }
    }
});

// Discord to Telegram forwarding
client.on('messageCreate', async message => {
    // Check if the message is from the specific Discord channel
    if (message.channelId === process.env.TELEGRAM_BOT_DISCORD_CHANNEL) {
        // Prevent bot from sending its own messages to avoid loops
        if (message.author.bot) return;

        const msgContent = `${message.author.username}: ${message.content}` || 'This message contains an attachment or embed and cannot be displayed.';
        try {
            // Send the message to the specified Telegram group
            await telegramBot.sendMessage(process.env.TELEGRAM_BOT_TELEGRAM_GROUP_ID, msgContent);
        } catch (error) {
            logger.error('Failed to send message to Telegram:', error);
        }
    }
});

module.exports = { telegramBot, client };
