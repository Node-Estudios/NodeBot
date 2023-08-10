import { ColorResolvable, EmbedBuilder, Guild, WebhookClient } from 'discord.js'
import Client from '#structures/Client.js'
import { BaseEvent } from '../../structures/Events.js'

export default class guildCreate extends BaseEvent {
    async run (client: Client, guild: Guild): Promise<void> {
        if (!process.env.GuildWebhookURL) return
        new WebhookClient({ url: process.env.GuildWebhookURL }).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.bot1Embed_Color as ColorResolvable)
                    .setDescription(`<a:greenarrow:969929468607090758> **${guild.name}** (+${guild.memberCount})`),
            ],
        })
    }
}
