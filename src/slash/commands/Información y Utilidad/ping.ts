import { CommandInteraction, MessageEmbed } from 'discord.js'
import Command from '../../../structures/Command.js'
import client from '../../../bot.js'
export default class ping extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Muestra la latencia del Bot.',
            cooldown: 5,
        })
    }
    override async run(interaction: CommandInteraction) {
        const ping = Math.abs((interaction.createdTimestamp - Date.now()) / 1000)
        interaction.reply({
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
