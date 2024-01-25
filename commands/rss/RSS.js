const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require(`discord.js`);
const { addRssToStorage, listRssFromStorage } = require(`../../database/rssDatabase`); // Adjust the path as necessary


module.exports = {
    data: new SlashCommandBuilder()
        .setName(`rss`)
        .setDescription(`RSS Command`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName(`add`)
                .setDescription(`Add RSS entry`)
                .addStringOption(option =>
                    option
                        .setName(`url`)
                        .setDescription(`Rss url (https)`)
                        .setRequired(true),
                )
                .addChannelOption(option =>
                    option
                        .setName(`channel`)
                        .setDescription(`Channel where to write RSS`)
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(`list`)
                .setDescription(`List all RSS entries`)
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(`remove`)
                .setDescription(`Remove a RSS entry`)
                .addIntegerOption(option =>
                    option
                        .setName(`id`)
                        .setDescription(`ID of rss entry. Type /rss list to get the id`)
                        .setRequired(true),
                )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case `add`:
              const rssUrl = interaction.options.getString(`url`);
              const channel = interaction.options.getChannel(`channel`);

              try {
                  await addRssToStorage(rssUrl, channel.id);
                  await interaction.reply({ content: `RSS feed ${rssUrl} added to channel ${channel.name}.!`, ephemeral: true });
              } catch (error) {
                  console.error(error);
                  await interaction.reply(`Failed to add the RSS feed. Please try again later.`);
              }
              break;

            case `list`:
              try {
                const rssFeeds = await listRssFromStorage();
                const embed = new EmbedBuilder()
                    .setTitle(`List of RSS Feeds`)
                    .setColor(0x0099FF);
        
                if (rssFeeds.length === 0) {
                    embed.setDescription(`No RSS feeds found.`);
                } else {
                    rssFeeds.forEach((feed, index) => {
                        embed.addFields(
                          { name: `Feed ${feed.id}`, value: `URL: ${feed.url}\nChannel: <#${feed.channel_id}>` }
                        )
                    });
                }
        
                await interaction.reply({ embeds: [embed] });
                } catch (error) {
                    console.error(error);
                    await interaction.reply({ content: `Failed to retrieve RSS feeds. Please try again later.`, ephemeral: true });
                }
            break;

            case `remove`:
                // Handle remove logic
                const id = interaction.options.getInteger(`id`);
                // Remove RSS logic here
                await interaction.reply(`RSS entry with ID ${id} removed.`);
                break;

            default:
                await interaction.reply(`Invalid command.`);
        }
    },
};
