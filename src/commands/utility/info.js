const { SlashCommandBuilder, BaseInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('introducing this bot to you.'),
    /**
     * /help prints bot's command
     * @constructor
     * @param {BaseInteraction} interaction 
     */
    async execute(interaction) {
        let helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('ifandonlyif-report-bot')
            .setDescription('ifandonlyif-report-bot is developed to report suspicious NFT introduction websites. ifandonlyif has a review system in place to ensure that all reports are properly reviewed, in order to protect the Discord community from potential fraud.')
            .setTimestamp()
            .setFooter({
                text: "ifandonlyif-report-bot"
            });

        await interaction.reply({
            embeds: [helpEmbed],
        });
    }
}