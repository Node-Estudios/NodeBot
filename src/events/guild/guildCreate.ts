import { ColorResolvable, Guild, WebhookClient } from 'discord.js'
import Client from '#structures/Client.js'
import { BaseEvent } from '#structures/Events.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'

export default class guildCreate extends BaseEvent {
    async run (client: Client, guild: Guild): Promise<void> {
        if (!process.env.GUILDWEBHOOKURL) return
        new WebhookClient({ url: process.env.GUILDWEBHOOKURL }).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setDescription(`<a:greenarrow:969929468607090758> **${guild.name}** (+${guild.memberCount})`),
            ],
        })
    }
}
