const {
  Client,
  CommandInteraction,
  MessageEmbed,
  Discord,
} = require("discord.js");

const Command = require("../../../structures/command.js");

const fetch = require("node-fetch");
const getUsedBot = require("../../../utils/getUsedBot");
const simplestDiscordWebhook = require('simplest-discord-webhook')
const getRandomPhrase = require('../../../utils/getRandomPhrase');
let webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL);
module.exports = class resume extends Command {
  constructor(client) {
    super(client, {
      name: "resume",
      description: "Resumes the actual player.",
      name_localizations: {
        "es-ES": "reanudar",
      },
      description_localizations: {
        "es-ES": "Reanuda el reproductor actual.",
      },
      cooldown: 5
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

    data.push(interaction.member.voice)
    data.push(interaction.guild.id);
    data.push(interaction.member.user.username);
    data.push(interaction.member.user.discriminator);
    data.push(interaction.member.displayAvatarURL({
      dynamic: true
    }));
    data.push(interaction.guild.shardId)

    switch (usedBotID) {
      case process.env.bot1id:
        fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/resume`, {
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
              .setFooter("Error en el comando resume (1)", client.user.displayAvatarURL({
                dynamic: true
              }));
            webhookClient.send(errorembed2)
            interaction.editReply({
              embeds: [errorembed]
            });
          })
        break;
      case process.env.bot2id:
        fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/resume`, {
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
              .setFooter("Error en el comando resume (2)", client.user.displayAvatarURL({
                dynamic: true
              }));
            webhookClient.send(errorembed2)
            interaction.editReply({
              embeds: [errorembed]
            });
          })
        break;
      case process.env.bot3id:
        fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/resume`, {
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
              .setFooter("Error en el comando resume (4)", client.user.displayAvatarURL({
                dynamic: true
              }));
            webhookClient.send(errorembed2)
            interaction.editReply({
              embeds: [errorembed]
            });
          })
        break;
      case process.env.bot4id:
        fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/resume`, {
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
              .setFooter("Error en el comando resume (4)", client.user.displayAvatarURL({
                dynamic: true
              }));
            webhookClient.send(errorembed2)
            interaction.editReply({
              embeds: [errorembed]
            });
          })
        break;
    }
  }
};