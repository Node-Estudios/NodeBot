import { MessageEmbed } from 'discord.js'
import { interactionCommandExtend } from '../../../events/client/interactionCreate.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'
export default class ping extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Muestra la latencia del Bot.',
            cooldown: 5,
        })
    }
    async run(interaction: interactionCommandExtend, args: any[]) {
        const client = interaction.client as Client
        const ping = Math.abs((interaction.createdTimestamp - Date.now()) / 1000)
        interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor('GREEN')
                    .setFields(
                        { name: `API`, value: `${client.ws.ping}ms`, inline: true },
                        { name: 'PING', value: `${ping}ms`, inline: true },
                    )
                    .setTitle('Ping')
                    .setTimestamp(),
            ],
        })
    }
}
