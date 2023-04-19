const { SlashCommandBuilder, BaseInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('prints all commands usage'),
    /**
     * /help prints bot's command
     * @constructor
     * @param {BaseInteraction} interaction 
     */
    async execute(interaction) {
        let helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('ifandonlyif-report-bot Help')
            .setDescription('Commands:')
            .addFields(
                { name: `/apply`, value: 'Apply to use ifandonlyif-report-bot in a new Discord server. After applying, the ifandonlyif team will review the application to ensure that the server can use the /report command to report suspicious NFT projects.' },
                { name: `/report`, value: 'Report suspicious NFT websites to ifandonlyif. Use the /report command and provide the URL of the suspicious NFT website to submit a report.' }
            )
            .setTimestamp()
            .setFooter({
                text: "ifandonlyif-report-bot"
            });

        await interaction.reply({
            embeds: [helpEmbed],
        });
    }
}