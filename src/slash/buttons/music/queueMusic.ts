require("dotenv").config();
const { Client, MessageEmbed, CommandInteraction } = require("discord.js");
const Logger = require("../../../utils/console");
const fetch = require("node-fetch");

module.exports = {
  name: "queueMusic",
  /**,
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction) => {
    try {
      await interaction.deferReply({
        ephemeral: true,
      });

      const player = client.manager.players.get(interaction.guild.id);
      if (!player) return;

      const data = [];

      data.push(interaction.member.user.username);
      data.push(interaction.member.user.discriminator);
      data.push(interaction.member.displayAvatarURL());
      data.push(interaction.guild.id);
      data.push(interaction.guild.name);
      data.push(interaction.options);
      data.push(client.user.displayAvatarURL());
      data.push(interaction.member.voice);
      data.push(interaction.guild.shardId);
      await interaction.guild.members
        .fetch(process.env.bot1id)
        .then((member) => {
          data.push(member.voice);
        });

      fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/get_queue`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.jwt,
        },
      })
        .then((response) => response.json())
        .then((embed) => {
          interaction.editReply({
            embeds: [embed],
          });
        });
    } catch (e) {
      Logger.error(e);
    }
  },
};
