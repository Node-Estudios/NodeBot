require("dotenv").config();
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require("discord.js")
const Logger = require("../../../utils/console");

module.exports = {
  name: "pauseMusic",
  /**,
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction) => {
    try {
      const botChannelID = interaction.guild.members.cache.get(
        process.env.bot1id
      ).voice.channelId;
      if (interaction.member.voice.channelId != botChannelID) {
        const errorembed = new MessageEmbed().setColor(15548997).setFooter(
          client.language.STOP[3],
          interaction.member.displayAvatarURL({
            dynamic: true,
          })
        );
        return interaction.reply({
          embeds: [errorembed],
          ephemeral: true,
        });
      }

      const player = client.manager.players.get(interaction.guild.id);
      if (!player) return;
      if (!player.queue.current) return;
      const message = await interaction.guild.channels.cache
        .get(interaction.channel.id)
        .messages.fetch(interaction.message.id)
        .then((msg) => msg);
      const embed = new MessageEmbed().setColor(process.env.bot1Embed_Color);
      if (message.embeds[0].thumbnail)
        embed.setThumbnail(message.embeds[0].thumbnail.url);

      prevDesc = message.embeds[0].description.split("\n")[0];
      let buttonName;
      if (player.paused) {
        player.pause(false);
        player.resumedUser = interaction.user.id;
        buttonName = client.language.PLAYER["resumeMusic"];

        let desc =
          client.language.STOP[5] +
          player.resumedUser +
          client.language.STOP[6];
        embed.setDescription(prevDesc + "\n\n" + desc);
      } else {
        player.pause(true);
        player.pausedUser = interaction.user.id;
        let desc =
          client.language.STOP[4] + player.pausedUser + client.language.STOP[6];
        embed.setDescription(prevDesc + "\n\n" + desc);

        buttonName = client.language.PLAYER["pauseMusic"];
      }
      const row = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setStyle("DANGER")
          .setLabel(client.language.PLAYER["stopMusic"])
          .setCustomId("stopMusic"),
        new Discord.MessageButton()
          .setStyle("SECONDARY")
          .setLabel(buttonName)
          .setCustomId("pauseMusic"),
        new Discord.MessageButton()
          .setStyle("PRIMARY")
          .setLabel(client.language.PLAYER["skipMusic"])
          .setCustomId("skipMusic"),
        new Discord.MessageButton()
          .setStyle("PRIMARY")
          .setLabel(client.language.PLAYER["queueMusic"])
          .setCustomId("queueMusic")
      );

      await interaction.update({
        embeds: [embed],
        components: [row]
      });
    } catch (e) {
      Logger.error(e);
    }
  },
};
