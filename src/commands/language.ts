import {SlashCommandBuilder, SlashCommandUserOption} from '@discordjs/builders';
import type { CommandInteraction, User } from 'discord.js';

const ROLE_CHANNEL: string = '<#632205987763191818>'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('language')
		.setDescription('Select a member and send them helpful resources.')
		.addUserOption((user: SlashCommandUserOption) => user.setName('target').setDescription('Person which should recive resources.').setRequired(true))
        .addStringOption(option =>
            option.setName('language')
                .setDescription('Enter the language')
                .setRequired(true)
                .addChoices(
                    { name: 'German / Deutsch', value: 'de' },
                    // { name: 'French / Français', value: 'fr' },
                )),
	async execute(interaction: CommandInteraction) {
        if (interaction.options.getUser('target') != null) {
            const user: User | null = interaction.options.getUser('target');

            if (user != null) {
                switch (interaction.options.getString('language')) {
                    case 'de':
                        return interaction.reply({ content: `Hallo <@${user.id}>, jemand denkt dass Du Deutsch kannst.\
                                                           \rEs gibt hier extra einen deutschsprachigen Bereich, dieser nur für Leute sichtbar ist, welche die deutsche Rolle besitzen.\
                                                           \rReagiere bei ${ROLE_CHANNEL} mit der \u{1F1E9}\u{1F1EA} Flagge um die Rolle zu bekommen.
                                                           \rIgnore this if you don't speak German. ` });
                    // case 'fr':
                    //     return interaction.reply({ content: `Bonjour <@${user.id}>` });
                    default:
                        break;
                }

              ;
            }

        }
    }
}

