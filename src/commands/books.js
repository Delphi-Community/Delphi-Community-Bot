const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('books')
		.setDescription('Select a member and send them helpful resources.')
		.addUserOption(option => option.setName('target').setDescription('Person which should recive resources.')),
	async execute(interaction) {
        try {
            const user = interaction.options.getUser('target');
            return interaction.reply({ content: `You wanted to kick: ${user.username}`, ephemeral: true });
        } catch (error) {
            return interaction.reply({ content: `You wanted to kick: ${user.username}`, ephemeral: true });   
        }
		
        
		
	},
};