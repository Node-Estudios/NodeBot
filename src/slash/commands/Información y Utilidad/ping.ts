import { EmbedBuilder as MessageEmbed } from 'discord.js'
import performanceMeters from '../../../cache/performanceMeters.js'
import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'
import logger from '../../../utils/logger.js'
export default class ping extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Muestra la latencia del Bot.',
            cooldown: 5,
        })
    }
    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        const client = interaction.client as Client
        const ping = Math.abs((interaction.createdAt.getTime() - Date.now()) / 1000)
        return client.cluster
            .broadcastEval(
                (c: any) => ({
                    ping: c.ws.ping,
                }),
                { cluster: client.cluster.id },
            )
            .then(async (results: any) => {
                let performance = await performanceMeters.get('interaction_' + interaction.id)
                if (performance) {
                    performance = await performance.stop()
                    performanceMeters.delete('interaction_' + interaction.id)
                }
                //Todo: process.env.mode === 'development'
                return interaction
                    .reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor('Green')
                                .setFields(
                                    { name: `API`, value: `${results[0].ping}ms`, inline: true },
                                    { name: 'Internal Processing (database + processing)', value: performance + 'ms' },
                                    { name: 'Global Ping', value: `${ping}ms`, inline: true },
                                )
                                .setTitle('Ping')
                                .setTimestamp(),
                        ],
                    })
                    .then(() => {
                        logger.debug('ping execution finished')
                    })
            })
    }
}
