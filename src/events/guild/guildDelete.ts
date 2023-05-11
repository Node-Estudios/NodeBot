import { ColorResolvable, Guild, EmbedBuilder, WebhookClient } from 'discord.js'

export default async function (guild: Guild) {
    if (!process.env.GuildWebhookURL) return
    new WebhookClient({ url: process.env.GuildWebhookURL }).send({
        embeds: [
            new EmbedBuilder()
                .setColor(process.env.bot1Embed_Color as ColorResolvable)
                .setDescription(`<a:redarrow:969932619229855754> **${guild.name}** (-${guild.memberCount})`),
        ],
    })
}
