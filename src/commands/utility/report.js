const { SlashCommandBuilder, EmbedBuilder, CommandInteraction } = require('discord.js');
const axios = require('axios').default;
const moment = require('moment');
const { apiUrl } = require('../../../config.json')

const failColor = 0xF24150
const warnColor = 0xFBA432
const successColor = 0x3FBF83

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report suspicious NFT project')
    .addStringOption(option => 
      option.setName('url')
        .setDescription('url of the NFT project you want to report')
        .setRequired(true)
    ),
  /**
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    let embedMessage = new EmbedBuilder().
      setTitle('report result')

    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild

    const url = interaction.options.getString('url');
    var validator = require("validator")

    if (!validator.isURL(url, {
      require_protocol: true,
    })) {
      embedMessage = embedMessage.setColor(failColor).
        setDescription('invalid url, correct format is like: https://github.com/ifandonlyif-io')

      await interaction.reply({
        "embeds" : [embedMessage],
      })

      return 
    }

    console.log(interaction);

    await axios.post(`${apiUrl}/discord/report`, {
      url: url,
      guild_id: interaction.guildId,
      guild_name: interaction.guild.name,
      reporter_name: interaction.user.username,
      reporter_avatar: interaction.user.avatar,
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      embedMessage = embedMessage.setColor(successColor).
        setDescription(`we receive your report
          project link: ${response.data.data.httpAddress}
          report at: ${moment(response.data.data.createdAt).format('YYYY/MM/DD hh:mm:ss ZZ')}
        `);

    }).catch((err) => {
      let response = err.response
      if (response.status == 409) {
        embedMessage = embedMessage.setColor(warnColor).
          setDescription(`${response.data.message}
            link: ${response.data.data.httpAddress}
            report at: ${moment(response.data.data.createdAt).format('YYYY/MM/DD hh:mm:ss ZZ')}
            `)
      }

      if (response.status == 403) {
        if (response.data != null) {
          console.log(response);
          embedMessage.setColor(warnColor).
            setDescription(`
              You have applied report command for this server, /report will be avaliable when we accept your appliance.\n
              apply at: ${moment(response.data.data.createdAt).format('YYYY/MM/DD hh:mm:ss ZZ')}
            `)
        } else {
          embedMessage = embedMessage.setColor(failColor).
          setDescription(`your server have not apply for report command\n
            You have to /apply report command for this channel first!
          `)
        }
      }

      if (response.status == 422) {
        embedMessage = embedMessage.setColor(failColor).
          setDescription(`ooh, your url format isn't right
          ${response.data.message}`)
      }
    });

    await interaction.reply({
      "embeds" : [embedMessage],
    })
  },
};