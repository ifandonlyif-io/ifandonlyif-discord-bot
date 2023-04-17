const { default: axios } = require('axios');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, TextInputBuilder } = require('discord.js');
const { apiUrl } = require('../../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('apply')
  .setDescription('apply for this channel can report sus NFT project.'),
  async execute(interaction) {
    
    const confirm = new ButtonBuilder()
    .setCustomId('confirm')
    .setLabel('Apply')
    .setStyle(ButtonStyle.Success);

    const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
        .addComponents(confirm, cancel);

    const response = await interaction.reply({
        content: `Are you sure you want to apply this channel can report sus NFT projects?`,
        components: [row],
    });

    const filter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({ filter, time: 60000 });

        if (confirmation.customId === 'confirm') {
            axios.post(`${apiUrl}/discord/apply`, {
                guild_id: interaction.channel.guildId,
                channel_name: interaction.guild.name,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                  }            
            }).then((response) => {
                console.log(response);
            }).catch((response) => {
                console.log(response);
            })

            await response.interaction.editReply({
                content: `Appliance sent!`,
                components: []
            });
        } else if (confirmation.customId === 'cancel') {
            await response.interaction.editReply({
                content: 'Apply cancelled.',
                components: []
            });
        }    

    } catch (e) {
        console.log(e);
        await response.interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    }    
  },
};
