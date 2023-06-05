const { default: axios } = require('axios');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');

const failColor = 0xF24150
const warnColor = 0xFBA432
const successColor = 0x3FBF83

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
        content: `Do you you want to this discord channel can report sus NFT projects?`,
        components: [row],
    });

    let embedMessage = new EmbedBuilder().
        setTitle('ifandonlyif-report-bot Apply').
        setDescription('Confirmation not received within 1 minute, cancelling');

    const filter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({ filter, time: 60000 });

        if (confirmation.customId === 'confirm') {
            await axios.post(`${process.env.apiUrl}/discord/apply`, {
                guild_id: interaction.channel.guildId,
                channel_name: interaction.guild.name,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }            
            }).then((res) => {
                console.log('[command] apply, response', res.data);
                embedMessage = embedMessage.setColor(successColor).
                    setDescription(`we received your appliance`).
                    setTimestamp();

            }).catch((e) => {
                console.log('[command] apply, error', e.response.data);
                if (e.response.status == 409) {
                    embedMessage = embedMessage.setColor(warnColor).
                        setDescription(`you have applied before.`).
                        setFields(
                            {
                                name: 'apply at',
                                value: moment(e.response.data.data.createdAt).format('YYYY/MM/DD hh:mm:ss ZZ'),
                            }
                        ).setTimestamp();
                } else {
                    embedMessage = embedMessage.setColor(failColor).
                        setDescription(e.response.data.message).
                        setFields({
                            name: 'error', value: 'If you see this message, please let us know.'
                        })
                }
                response.interaction.editReply({
                    embeds: [embedMessage],
                    components: [],
                });
                return
            })
        } else {
            embedMessage = embedMessage.setDescription('action canceled.')
        }

        await response.interaction.editReply({
            embeds: [embedMessage],
            components: [],
        });

    } catch (e) {
        await response.interaction.editReply({
            embeds: [embedMessage],
            components: [],
        });
    }    
  },
};
