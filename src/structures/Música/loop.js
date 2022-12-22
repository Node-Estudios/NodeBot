const {
  Client,
  CommandInteraction,
  MessageEmbed,
  Discord,
} = require("discord.js");
const Command = require("../../../structures/command.js");
const fetch = require("node-fetch");
const getUsedBot = require("../../../utils/getUsedBot");
const getRandomPhrase = require("../../../utils/getRandomPhrase");
const simplestDiscordWebhook = require('simplest-discord-webhook')
let webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL);
module.exports = class loop extends Command {
  constructor(client) {
    super(client, {
      name: "loop",
      description: "Loop a song or playlist, if dont dont make choice it will automatically loop the current song.",
      name_localizations: {
        "es-ES": "bucle",
      },
      description_localizations: {
        "es-ES": "Mantén en bucle una canción o playlist, automaticamente se mantendrá en bucle la canción.",
      },
      cooldown: 5,
      options: [{
        type: 3,
        name: "choice",
        description: "Make the choice between the song or the playlist",
        name_localizations: {
          "es-ES": "selección",
        },
        description_localizations: {
          "es-ES": "Selecciona si deseas mantener en bucle la canción o la playlist",
        },
        choices: [{
            name: "playlist",
            name_localizations: {
              "es-ES": "lista de reproducción",
            },
            value: "queue",
          },
          {
            name: "song",
            name_localizations: {
              "es-ES": "canción",
            },
            value: "song",
          },
        ],
        required: false,
      }, ],
    });
  }
  /**,
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  async run(client, interaction, args) {
    let usedBotID = await getUsedBot(interaction);

    if (!usedBotID) {
      const errorembed = new MessageEmbed()
        .setColor(15548997)
        .setFooter(getRandomPhrase(client.language.SKIP[1]), interaction.member.displayAvatarURL({
          dynamic: true
        }));
      return interaction.editReply({
        embeds: [errorembed]
      });
    }

    const data = [];

    data.push(interaction.guild.id);
    data.push(args);
    data.push(interaction.member.voice)
    data.push(interaction.member.user.username);
    data.push(interaction.member.user.discriminator);
    data.push(interaction.member.displayAvatarURL({
      dynamic: true
    }));
    data.push(interaction.guild.shardId)

    switch (usedBotID) {
      case process.env.bot1id:
        fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/loop`, {
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
              .setFooter("Error en el comando loop (1)", client.user.displayAvatarURL({
                dynamic: true
              }));
            webhookClient.send(errorembed2)
            interaction.editReply({
              embeds: [errorembed]
            });
          })
        break;
      case process.env.bot2id:
        fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/loop`, {
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
              .setFooter("Error en el comando loop (2)", client.user.displayAvatarURL({
                dynamic: true
              }));
            webhookClient.send(errorembed2)
            interaction.editReply({
              embeds: [errorembed]
            });
          });
      case process.env.bot3id:
        fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/loop`, {
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
              .setFooter("Error en el comando loop (3)", client.user.displayAvatarURL({
                dynamic: true
              }));
            webhookClient.send(errorembed2)
            interaction.editReply({
              embeds: [errorembed]
            });
          })
        break;
      case process.env.bot4id:
        fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/loop`, {
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
              .setFooter("Error en el comando loop (4)", client.user.displayAvatarURL({
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