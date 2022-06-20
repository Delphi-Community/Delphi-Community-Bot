const { SlashCommandBuilder } = require('@discordjs/builders');
const { channel_id_getting_started, markdown_url } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('markdown')
		.setDescription('Select a member and send them helpful resources.')
		.addUserOption(option => option.setName('target').setDescription('Person which should recive resources.')),
	async execute(interaction) {
        if (interaction.options.getUser('target') != null) {
            const user = interaction.options.getUser('target');
            return interaction.reply({ content: `Hey, <@${user.id}>, check out <#${channel_id_getting_started}> to get started!`, files: [`${markdown_url}`] }); 
        }else{
            return interaction.reply({ content: `Check out <#${channel_id_getting_started}> to get started!`, files: [`${markdown_url}`], ephemeral: true  }); 
        }
    }
}