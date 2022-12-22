const client = require("../../bot.ts");
const { MessageEmbed, WebhookClient } = require("discord.js");

const Event = require("../../structures/event");
module.exports = class guildCreate extends Event {
  constructor(...args) {
    super(...args);
  }
  async run(guild) {
    //client.user.displayAvatarURL()
    const embed = new MessageEmbed()
      .setColor(process.env.bot1Embed_Color)
      .setDescription(
        `<a:greenarrow:969929468607090758> **${guild.name}** (+${guild.memberCount})`
      );

    const webhook = new WebhookClient({
      url: process.env.GuildWebhookURL,
    });

    webhook.send({
      embeds: [embed],
    });
    // const promises = [
    //   client.shard.fetchClientValues("guilds.cache.size"),
    //   client.shard.broadcastEval((c) =>
    //     c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
    //   ),
    // ];
    // let promise = Promise.all(promises);
    // await promise
    //   .then(async (results) => {
    //     const guildNum = results[0].reduce(
    //       (acc, guildCount) => acc + guildCount,
    //       0
    //     );
    //     const memberNum = results[1].reduce(
    //       (acc, memberCount) => acc + memberCount,
    //       0
    //     );
    //     embed.setFooter(`${guildNum} servers, ${memberNum} users.`);
    //   })
    //   .catch(console.error);

    // client.shard.broadcastEval(
    //   (c, {
    //     id,
    //     embed
    //   }) => {
    //     let channel = c.channels.cache.get(id);
    //     if (!channel) return;

    //     channel.send({
    //       embeds: [embed]
    //     });
    //   }, {
    //     context: {
    //       id: process.env.newGuildChannelID,
    //       embed,
    //     },
    //   }
    // );
  }
};
