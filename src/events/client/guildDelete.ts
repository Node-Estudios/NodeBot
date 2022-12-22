const { MessageEmbed, WebhookClient } = require("discord.js");
import Client from "../../structures/client";

const Event = require("../../structures/event");
export class guildDelete extends Event {
  constructor(client: Client) {
    super(client);
  }
  async run(guild: { name: any; memberCount: any }) {
    console.log("test");
    const embed = new MessageEmbed()
      .setColor(15548997)
      .setDescription(
        `<a:redarrow:969932619229855754> **${guild.name}** (-${guild.memberCount})`
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
}
