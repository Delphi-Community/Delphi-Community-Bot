import {SlashCommandBuilder} from '@discordjs/builders';
import type { CommandInteraction, User } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('markdown')
		.setDescription('Select a member and send them helpful resources.')
		.addUserOption(option => option.setName('target').setDescription('Person which should recive resources.')),
	async execute(interaction: CommandInteraction) {
        if (interaction.options.getUser('target') != null) {
            const user: User | null = interaction.options.getUser('target');

            if (user != null) {
              return interaction.reply({ content: `Hey, <@${user.id}>, check out <#${process.env.CHANNEL_ID_GETTING_STARTED}> to get started!`, files: [`${process.env.MARKDOWN_URL}`] });
            }
        }else{
            return interaction.reply({ content: `Check out <#${process.env.CHANNEL_ID_GETTING_STARTED}> to get started!`, files: [`${process.env.MARKDOWN_URL}`], ephemeral: true  }); 
        }
    }
}