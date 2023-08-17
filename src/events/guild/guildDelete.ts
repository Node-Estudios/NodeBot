import {  ColorResolvable, Guild, WebhookClient  } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import Client from '#structures/Client.js'
import { BaseEvent } from '../../structures/Events.js'

export default class guildCreate extends BaseEvent {
    async run (client: Client, guild: Guild): Promise<void> {
        if (!process.env.GUILDWEBHOOKURL) return
        new WebhookClient({ url: process.env.GUILDWEBHOOKURL }).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setDescription(`<a:redarrow:969932619229855754> **${guild.name}** (-${guild.memberCount})`),
            ],
        })
    }
}
