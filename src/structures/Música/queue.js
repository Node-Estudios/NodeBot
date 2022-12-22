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
module.exports = class queue extends Command {
  constructor(client) {
    super(client, {
      name: "queue",
      description: "See the current queue of songs.",
      name_localizations: {
        "es-ES": "cola",
        "en-US": "queue",
      },
      description_localizations: {
        "es-ES": "Mira la cola actual de canciones.",
        "en-US": "Skip a song from the queue.",
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
        },
        {
          type: 10,
          name: "pagina",
          description: "página de la cola ",
        },
      ],
    });
  }
  async run(client, interaction, args) {
    let usedBotID
    let option = interaction.options.getString('bot')
    if (option) {
      usedBotID = option
    } else {
      usedBotID = await getUsedBot(interaction);
    }

    if (!usedBotID) {
      const errorembed = new MessageEmbed()
        .setColor(15548997)
        .setFooter(client.language.QUEUE[1], interaction.member.displayAvatarURL({
          dynamic: true
        }));
      return interaction.editReply({
        embeds: [errorembed],
        ephemeral: true
      });
    }

    const data = [];

    data.push(interaction.member.user.username);
    data.push(interaction.member.user.discriminator);
    data.push(interaction.member.displayAvatarURL({
      dynamic: true
    }));
    data.push(interaction.guild.id);
    data.push(interaction.guild.name);
    data.push(args);
    data.push(client.user.displayAvatarURL({
      dynamic: true
    }));
    data.push(interaction.member.voice);
    data.push(interaction.guild.shardId)

    await interaction.guild.members.fetch(usedBotID).then(member => {
      data.push(member.voice)
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
            .catch(() => {
              const errorembed = new MessageEmbed()
                .setColor(15548997)
                .setFooter(getRandomPhrase(client.language.INTERNALERROR), interaction.member.displayAvatarURL({
                  dynamic: true
                }));
              const errorembed2 = new MessageEmbed()
                .setColor(15548997)
                .setFooter("Error en el comando queue (1)", client.user.displayAvatarURL({
                  dynamic: true
                }));
              webhookClient.send(errorembed2)
              interaction.editReply({
                embeds: [errorembed]
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
                .setFooter("Error en el comando queue (2)", client.user.displayAvatarURL({
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
                .setFooter("Error en el comando queue (3)", client.user.displayAvatarURL({
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
                .setFooter("Error en el comando queue (4)", client.user.displayAvatarURL({
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
      const errorembed2 = new MessageEmbed()
        .setColor(15548997)
        .setFooter("Error en el comando queue (5)", client.user.displayAvatarURL({
          dynamic: true
        }));
      webhookClient.send(errorembed2)
      const errorembed = new MessageEmbed()
        .setColor(15548997)
        .setFooter(interaction.member.user.username + "#" + interaction.member.user.discriminator, interaction.member.displayAvatarURL({
          dynamic: true
        }));

      switch (option) {
        case '963496530818506802':
          errorembed.setDescription('Node2 <:logonodemorado:968094477480771584> no se encuentra en el servidor, invítalo haciendo [Click Aquí](https://discord.com/api/oauth2/authorize?client_id=963496530818506802&permissions=137475976512&scope=bot)')
          break
        case '963954741837201540':
          errorembed.setDescription('Node3 <:logonodenaranja:968094477019402292> no se encuentra en el servidor, invítalo haciendo [Click Aquí](https://discord.com/api/oauth2/authorize?client_id=963954741837201540&permissions=137475976512&scope=bot)')
          break
        case '853888393917497384':
          errorembed.setDescription('Node4 <:logonodeazul:968094477866659850> no se encuentra en el servidor, invítalo haciendo [Click Aquí](https://discord.com/api/oauth2/authorize?client_id=853888393917497384&permissions=137475976512&scope=bot)')
          break
      }

      interaction.editReply({
        embeds: [errorembed]
      });
    })

  }
};