const { Events } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.mentions.has(message.client.user)) {
            const mentionRegex = new RegExp(`<@!?${message.client.user.id}>`, 'g');
            const contentWithoutMention = message.content.replace(mentionRegex, '').trim();

            if (contentWithoutMention.startsWith('code')) {
                const codeText = contentWithoutMention.slice(4).trim();

                if (codeText.length === 0) {
                    message.reply("Please provide some text to format as code.");
                    return;
                }

                if (codeText.startsWith('```') && codeText.endsWith('```')) {
                    message.reply("The provided text is already formatted as a code block.");
                    return;
                }

                const codeBlock = '```pascal' + '\n' + codeText + '\n' + '```';

                try {
                    await message.reply(codeBlock);
                    await message.delete();
                } catch (error) {
                    logger.error("Error in deleting the message: " + error.message);
                }
            }
        }
    },
};
