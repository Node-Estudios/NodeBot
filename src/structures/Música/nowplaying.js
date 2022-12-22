const {
  Client,
  CommandInteraction,
  MessageEmbed,
  Discord,
} = require("discord.js");

const Command = require("../../../structures/command.js");
const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);
const fetch = require("node-fetch");
const getUsedBot = require("../../../utils/getUsedBot");
const simplestDiscordWebhook = require('simplest-discord-webhook')
let webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL);
const getRandomPhrase = require('../../../utils/getRandomPhrase');
module.exports = class nowplaying extends Command {
  constructor(client) {
    super(client, {
      name: "nowplaying",
      description: "See the current song playing.",
      name_localizations: {
        "es-ES": "nowplaying",
      },
      description_localizations: {
        "es-ES": "Revisa la canción que se está actualmente reproduciendo.",
      },
      cooldown: 5,
      options: [{
        type: 3,
        name: "bot",
        description: "Bot to consult.",
        name_localizations: {
          "es-ES": "bot",
        },
        description_localizations: {
          "es-ES": "Bot a consultar.",
        },
        choices: [{
            name: "🤖 Node",
            value: process.env.bot1id
          },
          {
            name: "🤖 Node 2",
            value: process.env.bot2id
          },
          {
            name: "🤖 Node 3",
            value: process.env.bot3id
          },
          {
            name: "🤖 Node 4",
            value: process.env.bot4id
          },
        ],
      }, ],
    });
  }
  /**,
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  async run(client, interaction, args) {
    let usedBotID
    let option = interaction.options.getString('bot')
    if (option) {
      usedBotID = option
    } else {
      usedBotID = await getUsedBot(interaction)
    }
    if (!usedBotID) {
      const errorembed = new MessageEmbed()
        .setColor(15548997)
        .setFooter(client.language.NOWPLAYING[2], interaction.member.displayAvatarURL({
          dynamic: true
        }));
      return interaction.editReply({
        embeds: [errorembed]
      });
    }

    const data = [];

    data.push(interaction.guild.id);
    data.push(interaction.member.user.username);
    data.push(interaction.member.user.discriminator);
    data.push(interaction.member.displayAvatarURL({
      dynamic: true
    }));
    data.push(interaction.member.voice)

    await interaction.guild.members.fetch(usedBotID).then(member => {
      data.push(member.voice)
      data.push(interaction.guild.shardId)
      data.push(args)
      switch (usedBotID) {
        case process.env.bot1id:
          fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/get_queue`, {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.jwt
              },
            })
            .then((response) => response.json())
            .then((embed) => {
              interaction.editReply({
                embeds: [embed]
              });
            })
          break;
        case process.env.bot2id:
          fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/get_queue`, {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.jwt
              },
            })
            .then((response) => response.json())
            .then((embed) => {
              interaction.editReply({
                embeds: [embed]
              });
            })
            .catch(() => {
              const errorembed = new MessageEmbed()
                .setColor(15548997)
                .setFooter(getRandomPhrase(client.language.INTERNALERROR), interaction.member.displayAvatarURL({
                  dynamic: true
                }));
              const errorembed2 = new MessageEmbed()
                .setColor(15548997)
                .setFooter("Error en el comando nowplaying (1)", client.user.displayAvatarURL({
                  dynamic: true
                }));
              webhookClient.send(errorembed2)
              interaction.editReply({
                embeds: [errorembed]
              });
            })
          break;
        case process.env.bot3id:
          fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/get_queue`, {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.jwt
              },
            })
            .then((response) => response.json())
            .then((embed) => {
              interaction.editReply({
                embeds: [embed]
              });
            })
            .catch(() => {
              const errorembed = new MessageEmbed()
                .setColor(15548997)
                .setFooter(getRandomPhrase(client.language.INTERNALERROR), interaction.member.displayAvatarURL({
                  dynamic: true
                }));
              const errorembed2 = new MessageEmbed()
                .setColor(15548997)
                .setFooter("Error en el comando nowplaying (2)", client.user.displayAvatarURL({
                  dynamic: true
                }));
              webhookClient.send(errorembed2)
              interaction.editReply({
                embeds: [errorembed]
              });
            })
          break;
        case process.env.bot4id:
          fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/get_queue`, {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.jwt
              },
            })
            .then((response) => response.json())
            .then((embed) => {
              interaction.editReply({
                embeds: [embed]
              });
            })
            .catch(() => {
              const errorembed = new MessageEmbed()
                .setColor(15548997)
                .setFooter(getRandomPhrase(client.language.INTERNALERROR), interaction.member.displayAvatarURL({
                  dynamic: true
                }));
              const errorembed2 = new MessageEmbed()
                .setColor(15548997)
                .setFooter("Error en el comando nowplaying (3)", client.user.displayAvatarURL({
                  dynamic: true
                }));
              webhookClient.send(errorembed2)
              interaction.editReply({
                embeds: [errorembed]
              });
            })
          break;
      }
    }).catch(e => {
      const errorembed = new MessageEmbed()
        .setColor(15548997)
        .setFooter(interaction.member.user.username + "#" + interaction.member.user.discriminator, interaction.member.displayAvatarURL({
          dynamic: true
        }));

      switch (option) {
        case '963496530818506802':
          errorembed.setDescription(`Node2 <:logonodemorado:968094477480771584> ${client.language.NOTINSERVER}(https://discord.com/api/oauth2/authorize?client_id=963496530818506802&permissions=137475976512&scope=bot)`)
          break
        case '963954741837201540':
          errorembed.setDescription(`Node3 <:logonodenaranja:968094477019402292> ${client.language.NOTINSERVER}(https://discord.com/api/oauth2/authorize?client_id=963954741837201540&permissions=137475976512&scope=bot)`)
          break
        case '853888393917497384':
          errorembed.setDescription(`Node4 <:logonodeazul:968094477866659850> ${client.language.NOTINSERVER}(https://discord.com/api/oauth2/authorize?client_id=853888393917497384&permissions=137475976512&scope=bot)`)
          break
      }
      console.log(errorEmbed)
      interaction.editReply({
        embeds: [errorembed]
      });
    })
  }
};