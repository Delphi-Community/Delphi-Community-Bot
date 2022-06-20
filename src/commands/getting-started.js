const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getting-started')
		.setDescription('Select a member and send them helpful resources.')
		.addUserOption(option => option.setName('target').setDescription('Person which should recive resources.')),
	async execute(interaction) {
        if (interaction.options.getUser('target') != null) {
            const user = interaction.options.getUser('target');
            return interaction.reply({ content: `Hey, <@${user.id}>, check out <#781823626630266881> to get started!` });
        }else{
            return interaction.reply({ content: `Check out <#781823626630266881> to get started!` });  
        }
    }
}