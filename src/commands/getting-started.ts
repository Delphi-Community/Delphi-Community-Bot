import {SlashCommandBuilder, SlashCommandUserOption} from '@discordjs/builders';
import type { CommandInteraction, User } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getting-started')
		.setDescription('Select a member and send them helpful resources.')
		.addUserOption((user: SlashCommandUserOption) => user.setName('target').setDescription('Person which should recive resources.')),
	async execute(interaction: CommandInteraction) {
        if (interaction.options.getUser('target') != null) {
            const user: User | null = interaction.options.getUser('target');

            if (user != null) {
              return interaction.reply({ content: `Hey, <@${user.id}>, check out <#781823626630266881> to get started!` });
            }

        }else{
            return interaction.reply({ content: `Check out <#781823626630266881> to get started!`, ephemeral: true });  
        }
    }
}