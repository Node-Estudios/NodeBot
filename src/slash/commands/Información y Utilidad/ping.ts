import { ColorResolvable, CommandInteraction, GuildMember, MessageEmbed } from 'discord.js'
import Command from '../../../structures/Command'
import Client from '../../../structures/Client'
export default class ping extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'ping',
            description: 'Muestra la latencia del Bot.',
            cooldown: 5,
        })
    }
    async run(client: Client, interaction: CommandInteraction, args: any) {
        console.log(client.shard)
        let ping = Math.abs((interaction.createdTimestamp - Date.now()) / 1000)
        interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor('GREEN')
                    .addField(`API`, `${interaction.client.ws.ping}ms`, true)
                    .addField(`Ping`, `${ping}ms`, true)
                    .setTitle('Ping')
                    .setTimestamp(),
            ],
        })
    }
}
