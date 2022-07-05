import {SlashCommandBuilder, SlashCommandUserOption} from '@discordjs/builders';
import type { CommandInteraction, User } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('books')
		.setDescription('Select a member and send them helpful resources.')
		.addUserOption((user: SlashCommandUserOption) => user.setName('target').setDescription('Person which should recive resources.')),
	async execute(interaction: CommandInteraction) {
        if (interaction.options.getUser('target') != null) {
            const user: User | null = interaction.options.getUser('target');

            if (user != null) {
              return interaction.reply({ content: `Hey <@${user.id}>, https://www.embarcadero.com/resources/white-papers (All Free!)\nhttps://github.com/coderserdar/Documents (All Free!)\nhttps://delphi-books.com/en/!` });
            }

        }else{
            return interaction.reply({ content: `https://www.embarcadero.com/resources/white-papers (All Free!)\nhttps://github.com/coderserdar/Documents (All Free!)\nhttps://delphi-books.com/en/!`, ephemeral: true });  
        }
    }
}