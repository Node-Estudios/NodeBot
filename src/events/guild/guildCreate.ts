import { ColorResolvable, Guild, MessageEmbed, WebhookClient } from 'discord.js'

export default async function (guild: Guild) {
    if (!process.env.GuildWebhookURL) return
    new WebhookClient({ url: process.env.GuildWebhookURL }).send({
        embeds: [
            new MessageEmbed()
                .setColor(process.env.bot1Embed_Color as ColorResolvable)
                .setDescription(`<a:greenarrow:969929468607090758> **${guild.name}** (+${guild.memberCount})`),
        ],
    })
}