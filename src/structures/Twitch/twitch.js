const {
  Client,
  CommandInteraction,
  MessageEmbed,
  Discord,
} = require("discord.js");
const Command = require("../../../structures/command.js");
const TwitchModel = require("../../../models/twitch");
const axios = require("axios");
const headers = {
  "Client-ID": process.env.twitch_client_id,
  Authorization: process.env.twitch_authorization,
};

module.exports = class twitch extends Command {
  constructor(client) {
    super(client, {
      name: "twitch",
      description: "Get a notification when a streamer goes live or shut down.",
      description_localizations: {
        "es-ES":
          "Recibir una notificación cuando un streamer prende o apaga directo.",
      },
      cooldown: 5,
      options: [
        {
          type: 2,
          name: "guild",
          description: "If you want to get a notification in this guild",
          options: [
            {
              type: 1,
              name: "embed",
              description: "Send a custom embed when the stream starts/stop",
              options: [
                {
                  type: 3,
                  name: "color",
                  description: "Color of the embed that the bot will send",
                  required: true,
                  choices: [
                    {
                      name: "Default",
                      name_localizations: {
                        "es-ES": "Defecto",
                      },
                      value: "default",
                    },
                    {
                      name: "Aqua",
                      name_localizations: {
                        "es-ES": "Agua",
                      },
                      value: "aqua",
                    },
                    {
                      name: "Dark Aqua",
                      name_localizations: {
                        "es-ES": "Agua Oscuro",
                      },
                      value: "DARK_AQUA",
                    },
                    {
                      name: "Green",
                      name_localizations: {
                        "es-ES": "Verde",
                      },
                      value: "GREEN",
                    },
                    {
                      name: "Dark Green",
                      name_localizations: {
                        "es-ES": "Verde Oscuro",
                      },
                      value: "DARK_GREEN",
                    },
                    {
                      name: "Blue",
                      name_localizations: {
                        "es-ES": "Azul",
                      },
                      value: "BLUE",
                    },
                    {
                      name: "Dark Blue",
                      name_localizations: {
                        "es-ES": "Azul Oscuro",
                      },
                      value: "DARK_BLUE",
                    },
                    {
                      name: "Purple",
                      name_localizations: {
                        "es-ES": "Morado",
                      },
                      value: "PURPLE",
                    },
                    {
                      name: "Dark Purple",
                      name_localizations: {
                        "es-ES": "Morado Oscuro",
                      },
                      value: "DARK_PURPLE",
                    },
                    {
                      name: "Lumious Vivid Pink",
                      name_localizations: {
                        "es-ES": "Rosa Brillante",
                      },
                      value: "LUMINOUS_VIVID_PINK",
                    },
                    {
                      name: "Dark Vivid Pink",
                      name_localizations: {
                        "es-ES": "Rosa Brillante Oscuro",
                      },
                      value: "DARK_VIVID_PINK",
                    },
                    {
                      name: "Gold",
                      name_localizations: {
                        "es-ES": "Oro",
                      },
                      value: "GOLD",
                    },
                    {
                      name: "Dark Gold",
                      name_localizations: {
                        "es-ES": "Oro Oscuro",
                      },
                      value: "DARK_GOLD",
                    },
                    {
                      name: "Orange",
                      name_localizations: {
                        "es-ES": "Naranja",
                      },
                      value: "ORANGE",
                    },
                    {
                      name: "Dark Orange",
                      name_localizations: {
                        "es-ES": "Naranja Oscuro",
                      },
                      value: "DARK_ORANGE",
                    },
                    {
                      name: "Red",
                      name_localizations: {
                        "es-ES": "Rojo",
                      },
                      value: "RED",
                    },
                    {
                      name: "Dark Red",
                      name_localizations: {
                        "es-ES": "Rojo Oscuro",
                      },
                      value: "DARK_RED",
                    },
                    {
                      name: "Grey",
                      name_localizations: {
                        "es-ES": "Gris",
                      },
                      value: "GREY",
                    },
                    {
                      name: "Dark Grey",
                      name_localizations: {
                        "es-ES": "Gris Oscuro",
                      },
                      value: "DARK_GREY",
                    },
                    {
                      name: "Darker Grey",
                      name_localizations: {
                        "es-ES": "Gris Oscuro",
                      },
                      value: "DARKER_GREY",
                    },
                    {
                      name: "Light Grey",
                      name_localizations: {
                        "es-ES": "Gris Claro",
                      },
                      value: "LIGHT_GREY",
                    },
                    {
                      name: "Navy",
                      name_localizations: {
                        "es-ES": "Azul Marino",
                      },
                      value: "NAVY",
                    },
                    {
                      name: "Dark Navy",
                      name_localizations: {
                        "es-ES": "Azul Marino Oscuro",
                      },
                      value: "DARK_NAVY",
                    },
                    {
                      name: "Yellow",
                      name_localizations: {
                        "es-ES": "Amarillo",
                      },
                      value: "YELLOW",
                    },
                  ],
                },
                {
                  type: 3,
                  name: "streamer",
                  description:
                    "Username of the streamer that you want to get notified",
                  required: true,
                },
                {
                  type: 7,
                  name: "channel",
                  channel_types: ["0"],
                  description: "Channel to send the embed",
                  required: true,
                },
                {
                  type: 3,
                  name: "title",
                  description: "Title for the embed that the bot will send",
                  required: true,
                },
                {
                  type: 3,
                  name: "description",
                  description:
                    "Description of  the embed that the bot will send",
                  required: true,
                },
                {
                  type: 3,
                  name: "footer",
                  description: "Want the embed to have any footer text?",
                  required: false,
                },
                {
                  type: 3,
                  name: "footericon",
                  description:
                    "Want the embed to have any footer image? Paste the url",
                  required: false,
                },
                {
                  type: 3,
                  name: "thumbnail",
                  description:
                    "Want the embed to have any footer image? Paste the URL",
                  required: false,
                },
                {
                  type: 3,
                  name: "titleurl",
                  description: "Want the embed to have any footer image?",
                  required: false,
                },
                {
                  type: 5,
                  name: "timestamp",
                  description:
                    "Do you want me to show the time when the message was sended in the footer?",
                  required: false,
                },
              ],
            },
            {
              type: 1,
              name: "remove",
              description: "Remove the notification for the current guild",
              options: [
                {
                  type: 3,
                  name: "streamer",
                  description:
                    "Username of the streamer that you want to get notified",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          type: 2,
          name: "private",
          description:
            "Node bot will send you a private message when your favourite streamer goes Live!",
          options: [
            {
              type: 1,
              name: "create",
              description: "Create the notification",
              options: [
                {
                  type: 3,
                  name: "streamer",
                  description:
                    "Username of the streamer that you want to get notified",
                  required: true,
                },
                {
                  type: 3,
                  name: "message",
                  description:
                    "Message to send, you can use variables like {link} or {streamer}",
                  required: true,
                },
              ],
            },
            {
              type: 1,
              name: "remove",
              description: "Remove the notification",
              options: [
                {
                  type: 3,
                  name: "streamer",
                  description:
                    "Username of the streamer that you want to get notified",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
  }
  /**,
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  async run(client, interaction, args) {
    switch (interaction.options._group) {
      case "guild":
        switch (interaction.options._subcommand) {
          case "embed":
            let color;
            let colors = [
              "DEFAULT",
              "AQUA",
              "DARK_AQUA",
              "GREEN",
              "DARK_GREEN",
              "BLUE",
              "DARK_BLUE",
              "PURPLE",
              "DARK_PURPLE",
              "LUMINOUS_VIVID_PINK",
              "DARK_VIVID_PINK",
              "GOLD",
              "DARK_GOLD",
              "ORANGE",
              "DARK_ORANGE",
              "RED",
              "DARK_RED",
              "GREY",
              "DARK_GREY",
              "DARKER_GREY",
              "LIGHT_GREY",
              "NAVY",
              "DARK_NAVY",
              "YELLOW",
            ];
            for (let index in colors) {
              if (
                interaction.options.getString("color").toUpperCase() ==
                colors[index]
              ) {
                color = colors[index];
              }
            }
            axios
              .get(
                `https://api.twitch.tv/helix/users?login=${interaction.options
                  .getString("streamer")
                  .toString()}`,
                {
                  headers: headers,
                }
              )
              .then(async (res) => {
                if (!res.data.data[0]) {
                  return interaction.editReply({
                    content: "The streamer does not exist",
                    embeds: [],
                    components: [],
                  });
                }
                TwitchModel.findOne({
                  broadcaster_user_id:
                    res.data.data[0]
                      .id /*parseInt(req.body.subscription.condition.broadcaster_user_id)*/,
                }).then((s, err) => {
                  if (!s) {
                    if (res.data.data[0]) {
                      axios
                        .post(
                          `https://api.twitch.tv/helix/eventsub/subscriptions`,
                          {
                            type: "stream.online",
                            version: "1",
                            condition: {
                              broadcaster_user_id: res.data.data[0].id,
                            },
                            transport: {
                              method: "webhook",
                              callback:
                                "https://api.nodebot.xyz/twitch/interaction/webhooks/callback",
                              secret: "vTMtZYg8AyBegs3N8M3M",
                            },
                          },
                          {
                            headers: headers,
                          }
                        )
                        .then(async (res2) => {
                          TwitchModel.create({
                            id: res2.data.data[0].id,
                            type: res2.data.data[0].id.toString(),
                            broadcaster_user_id: res.data.data[0].id,
                            created_at: res2.data.data[0].created_at,
                            cost: res2.data.data[0].cost,
                            login: res.data.data[0].login,
                            display_name: res.data.data[0].display_name,
                            Interacciones: {
                              Guilds: [
                                {
                                  id: interaction.guild.id.toString(),
                                  textChannel: interaction.options
                                    .getChannel("channel")
                                    .toString()
                                    .replace("<#", "")
                                    .replace(">", ""),
                                  customMessage: {
                                    embed: {
                                      color: interaction.options
                                        .getString("color")
                                        .toString(),
                                      title: interaction.options
                                        .getString("title")
                                        .toString(),
                                      description: interaction.options
                                        .getString("description")
                                        .toString(),
                                      footer:
                                        interaction.options.getString("footer"),
                                      footericon:
                                        interaction.options.getString(
                                          "footericon"
                                        ),
                                      thumbnail:
                                        interaction.options.getString(
                                          "thumbnail"
                                        ),
                                      titleurl:
                                        interaction.options.getString(
                                          "titleurl"
                                        ),
                                      timestamp:
                                        interaction.options.getBoolean(
                                          "timestamp"
                                        ),
                                    },
                                  },
                                },
                              ],
                              Users: [],
                            },
                          });
                          const tituloEmbed = interaction.options
                            .getString("title")
                            .toString()
                            .replace(
                              "{streamer}",
                              res.data.data[0].display_name
                            );
                          const descripcionEmbed = interaction.options
                            .getString("description")
                            .toString()
                            .replace(
                              "{streamer}",
                              res.data.data[0].display_name
                            )
                            .replace(
                              "{link}",
                              `https://twitch.tv/${res.data.data[0].display_name}`
                            );
                          const embed = new MessageEmbed()
                            .setTitle(tituloEmbed)
                            .setColor(color)
                            .setDescription(descripcionEmbed)
                            .setAuthor(
                              "Node Bot",
                              "https://cdn.discordapp.com/avatars/828771710676500502/c0e14a183dead07a277b0aa907ebc270.webp?size=4096",
                              "https://nodebot.xyz"
                            )
                            .setImage(
                              `https://static-cdn.jtvnw.net/previews-ttv/live_user_${res.data.data[0].login}-1920x1089.jpg`
                            );
                          if (
                            interaction.options.getString("footer") &&
                            interaction.options.getString("footericon")
                          ) {
                            embed.setFooter({
                              text: interaction.options
                                .getString("footer")
                                .toString()
                                .replace(
                                  "{streamer}",
                                  res.data.data[0].display_name
                                )
                                .replace(
                                  "{link}",
                                  `https://twitch.tv/${res.data.data[0].display_name}`
                                ),
                              iconURL: interaction.options
                                .getString("footericon")
                                .toString(),
                            });
                          } else if (
                            interaction.options.getString("footer") &&
                            !interaction.options.getString("footericon")
                          ) {
                            embed.setFooter({
                              text: interaction.options
                                .getString("footer")
                                .toString()
                                .replace(
                                  "{streamer}",
                                  res.data.data[0].display_name
                                )
                                .replace(
                                  "{link}",
                                  `https://twitch.tv/${res.data.data[0].display_name}`
                                ),
                            });
                          }
                          if (interaction.options.getString("thumbnail")) {
                            embed.setThumbnail(
                              interaction.options
                                .getString("thumbnail")
                                .toString()
                            );
                          }
                          if (interaction.options.getString("titleurl")) {
                            embed.setURL(
                              interaction.options
                                .getString("titleurl")
                                .toString()
                                .replace(
                                  "{link}",
                                  `https://twitch.tv/${res.data.data[0].display_name}`
                                )
                            );
                          }
                          if (
                            interaction.options.getBoolean("timestamp") == true
                          ) {
                            embed.setTimestamp();
                          }
                          interaction.guild.channels.cache
                            .get(
                              interaction.options
                                .getChannel("channel")
                                .toString()
                                .replace("<#", "")
                                .replace(">", "")
                            )
                            .send({
                              embeds: [embed],
                              content: `Test Message`,
                            });
                          interaction.editReply({
                            content:
                              "The notification has been created for this guild, we will send in the channel a test notification so u can see how it looks like",
                            embeds: [],
                          });
                        })
                        .catch((e) => {
                          client.logger.error(e);
                          if (e.response.status.status === 409) {
                          }
                        });
                    }
                  } else {
                    /*
                                    Guilds: [
                                        {
                                            id: '',
                                            textChannel: '',
                                            customMessage: ''
                                        }
                                    ],
                                    Users: [
                                        {
                                            id: '',
                                        }
                                    ]
                                    */
                    if (
                      s.Interacciones.Guilds.findIndex(
                        (i) => i.id === interaction.guild.id
                      ) == -1
                    ) {
                      s.Interacciones.Guilds.push({
                        id: interaction.guild.id.toString(),
                        textChannel: interaction.options
                          .getChannel("channel")
                          .toString()
                          .replace("<#", "")
                          .replace(">", ""),
                        customMessage: {
                          embed: {
                            color: color,
                            title: interaction.options
                              .getString("title")
                              .toString(),
                            description: interaction.options
                              .getString("description")
                              .toString(),
                            footer: interaction.options.getString("footer"),
                            footericon:
                              interaction.options.getString("footericon"),
                            thumbnail:
                              interaction.options.getString("thumbnail"),
                            titleurl: interaction.options.getString("titleurl"),
                            timestamp:
                              interaction.options.getBoolean("timestamp"),
                          },
                        },
                      });
                      s.save();
                      interaction.editReply({
                        content: `Añadido a la base de datos correctamente, a partir de ahora recibiras las notificaciones en ${interaction.options
                          .getChannel("channel")
                          .toString()}`,
                        embeds: [],
                      });
                      const tituloEmbed = interaction.options
                        .getString("title")
                        .toString()
                        .replace("{streamer}", s.display_name);
                      const descripcionEmbed = interaction.options
                        .getString("description")
                        .toString()
                        .replace("{streamer}", s.display_name)
                        .replace(
                          "{link}",
                          `https://twitch.tv/${s.display_name}`
                        );
                      const embed = new MessageEmbed()
                        .setTitle(tituloEmbed)
                        .setColor(color)
                        .setDescription(descripcionEmbed)
                        .setAuthor(
                          "Node Bot",
                          "https://cdn.discordapp.com/avatars/828771710676500502/c0e14a183dead07a277b0aa907ebc270.webp?size=4096",
                          "https://nodebot.xyz"
                        )
                        .setImage(
                          `https://static-cdn.jtvnw.net/previews-ttv/live_user_${res.data.data[0].login}-1920x1089.jpg`
                        );
                      if (
                        interaction.options.getString("footer") &&
                        interaction.options.getString("footericon")
                      ) {
                        embed.setFooter({
                          text: interaction.options
                            .getString("footer")
                            .toString()
                            .replace(
                              "{streamer}",
                              res.data.data[0].display_name
                            )
                            .replace(
                              "{link}",
                              `https://twitch.tv/${res.data.data[0].display_name}`
                            ),
                          iconURL: interaction.options
                            .getString("footericon")
                            .toString(),
                        });
                      } else if (
                        interaction.options.getString("footer") &&
                        !interaction.options.getString("footericon")
                      ) {
                        embed.setFooter({
                          text: interaction.options
                            .getString("footer")
                            .toString()
                            .replace(
                              "{streamer}",
                              res.data.data[0].display_name
                            )
                            .replace("{link}"),
                        });
                      }
                      if (interaction.options.getString("thumbnail")) {
                        embed.setThumbnail(
                          interaction.options.getString("thumbnail").toString()
                        );
                      }
                      if (interaction.options.getString("titleurl")) {
                        embed.setURL(
                          interaction.options
                            .getString("titleurl")
                            .toString()
                            .replace(
                              "{link}",
                              `https://twitch.tv/${res.data.data[0].display_name}`
                            )
                        );
                      }
                      if (interaction.options.getBoolean("timestamp") == true) {
                        embed.setTimestamp();
                      }
                      interaction.guild.channels.cache
                        .get(
                          interaction.options
                            .getChannel("channel")
                            .toString()
                            .replace("<#", "")
                            .replace(">", "")
                        )
                        .send({
                          embeds: [embed],
                          content: `Mensaje de prueba`,
                        });
                    } else {
                      if (
                        s.Interacciones.Guilds[
                          s.Interacciones.Guilds.findIndex(
                            (i) => i.id === interaction.guild.id
                          )
                        ]
                      ) {
                        interaction.editReply({
                          content:
                            "Esta guild ya está registrada en nuestra base de datos con este streamer. ",
                          embeds: [],
                        });
                      }
                    }
                  }
                });
              })
              .catch((e) => {
                client.logger.debug(e);
              });
            break;
          case "remove":
            axios
              .get(
                `https://api.twitch.tv/helix/users?login=${interaction.options
                  .getString("streamer")
                  .toString()}`,
                {
                  headers: headers,
                }
              )
              .then(async (res) => {
                if (!res.data.data[0]) {
                  return interaction.editReply("The streamer does not exist");
                }
                TwitchModel.findOne({
                  broadcaster_user_id:
                    res.data.data[0]
                      .id /*parseInt(req.body.subscription.condition.broadcaster_user_id)*/,
                }).then((s, err) => {
                  if (s) {
                    if (res.data.data[0]) {
                      s.Interacciones.Guilds.splice(
                        s.Interacciones.Guilds.findIndex(
                          (i) => i.id === interaction.guild.id
                        ),
                        1
                      );
                      s.save().then((s) => {
                        if (
                          s.Interacciones.Users.length == 0 &&
                          s.Interacciones.Guilds.length == 0
                        ) {
                          axios
                            .delete(
                              `https://api.twitch.tv/helix/eventsub/subscriptions`,
                              {
                                headers: headers,
                                data: {
                                  id: s.id,
                                },
                              }
                            )
                            .then(async (res2) => {
                              interaction.editReply({
                                content: `Se ha eliminado la subscripción correctamente`,
                                embeds: [],
                              });
                            });
                        }
                      });
                    }
                  } else if (!s) return;
                });
              });
            break;
        }
        break;
      case "private":
        switch (interaction.options._subcommand) {
          case "create":
            axios
              .get(
                `https://api.twitch.tv/helix/users?login=${interaction.options
                  .getString("streamer")
                  .toString()}`,
                {
                  headers: headers,
                }
              )
              .then(async (res) => {
                if (!res.data.data[0]) {
                  return interaction.editReply("The streamer does not exist");
                }
                TwitchModel.findOne({
                  broadcaster_user_id:
                    res.data.data[0]
                      .id /*parseInt(req.body.subscription.condition.broadcaster_user_id)*/,
                }).then((s, err) => {
                  if (!s) {
                    if (res.data.data[0]) {
                      axios
                        .post(
                          `https://api.twitch.tv/helix/eventsub/subscriptions`,
                          {
                            type: "stream.online",
                            version: "1",
                            condition: {
                              broadcaster_user_id: res.data.data[0].id,
                            },
                            transport: {
                              method: "webhook",
                              callback:
                                "https://api.nodebot.xyz/twitch/interaction/webhooks/callback",
                              secret: "vTMtZYg8AyBegs3N8M3M",
                            },
                          },
                          {
                            headers: headers,
                          }
                        )
                        .then(async (res2) => {
                          TwitchModel.create({
                            id: res2.data.data[0].id,
                            type: res2.data.data[0].id.toString(),
                            broadcaster_user_id: res.data.data[0].id,
                            created_at: res2.data.data[0].created_at,
                            cost: res2.data.data[0].cost,
                            login: res.data.data[0].login,
                            display_name: res.data.data[0].display_name,
                            Interacciones: {
                              Users: [
                                {
                                  id: interaction.member.id.toString(),
                                  message: interaction.options
                                    .getString("message")
                                    .toString(),
                                },
                              ],
                              Guilds: [],
                            },
                          });
                          const message = interaction.options
                            .getString("message")
                            .toString()
                            .replace(
                              "{streamer}",
                              res.data.data[0].display_name
                            )
                            .replace(
                              "{link}",
                              `https://twitch.tv/${res.data.data[0].display_name}`
                            );
                          interaction.member.send({
                            content: message,
                          });
                          interaction.editReply({
                            content:
                              "The notification has been created, we will send you a private message with a test notification so u can see how it looks like",
                            embeds: [],
                          });
                        })
                        .catch((e) => {
                          client.logger.error(e);
                          if (e.response.status.status === 409) {
                          }
                        });
                    }
                  } else {
                    /*
                                    Guilds: [
                                        {
                                            id: '',
                                            textChannel: '',
                                            customMessage: ''
                                        }
                                    ],
                                    Users: [
                                        {
                                            id: '',
                                        }
                                    ]
                                    */
                    if (
                      s.Interacciones.Users.findIndex(
                        (i) => i.id == interaction.member.id
                      ) === -1
                    ) {
                      s.Interacciones.Users.push({
                        id: interaction.member.id.toString(),
                        message: interaction.options
                          .getString("message")
                          .toString(),
                      });
                      s.save();
                      const message = interaction.options
                        .getString("message")
                        .toString()
                        .replace("{streamer}", res.data.data[0].display_name)
                        .replace(
                          "{link}",
                          `https://twitch.tv/${res.data.data[0].display_name}`
                        );
                      interaction.member.send({
                        content: message,
                      });
                      interaction.editReply({
                        content:
                          "The notification has been created, we will send you a private message with a test notification so u can see how it looks like",
                        embeds: [],
                      });
                    } else {
                      interaction.editReply({
                        content:
                          "Usted ya está registrado para recibir notificaciones privadas de este streamer.",
                        embeds: [],
                      });
                    }
                  }
                });
              })
              .catch((e) => {
                client.logger.debug(e);
              });
            break;
          case "remove":
            axios
              .get(
                `https://api.twitch.tv/helix/users?login=${interaction.options
                  .getString("streamer")
                  .toString()}`,
                {
                  headers: headers,
                }
              )
              .then(async (res) => {
                if (!res.data.data[0]) {
                  return interaction.editReply("The streamer does not exist");
                }
                TwitchModel.findOne({
                  broadcaster_user_id:
                    res.data.data[0]
                      .id /*parseInt(req.body.subscription.condition.broadcaster_user_id)*/,
                }).then((s, err) => {
                  if (s) {
                    if (res.data.data[0]) {
                      if (
                        s.Interacciones.Users.findIndex(
                          (i) => i.id === interaction.member.id
                        ) != -1
                      ) {
                        s.Interacciones.Users.splice(
                          s.Interacciones.Guilds.findIndex(
                            (i) => i.id === interaction.member.id
                          ),
                          1
                        );
                        s.save().then((s) => {
                          if (
                            s.Interacciones.Users.length == 0 &&
                            s.Interacciones.Guilds.length == 0
                          ) {
                            axios
                              .delete(
                                `https://api.twitch.tv/helix/eventsub/subscriptions`,
                                {
                                  headers: headers,
                                  data: {
                                    id: s.id,
                                  },
                                }
                              )
                              .then(async (res2) => {
                                interaction.editReply({
                                  content: `Se ha eliminado la subscripción correctamente`,
                                  embeds: [],
                                });
                              });
                          }
                        });
                      } else {
                        interaction.editReply({
                          content:
                            "Usted no está registrado para recibir notificaciones privadas de este streamer.",
                          embeds: [],
                        });
                      }
                    }
                  } else if (!s) return;
                });
              });
            break;
        }
    }
  }
};
