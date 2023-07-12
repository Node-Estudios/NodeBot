import performanceMeters from '../../../cache/performanceMeters.js'
import Translator from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'
import { Colors, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js'
import { keys } from '../../../utils/locales.js'
import logger from '../../../utils/logger.js'
export default class ping extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Shows the bot latency.',
            name_localizations: {
                'es-ES': 'ping',
                'en-US': 'ping',
            },
            description_localizations: {
                'es-ES': 'Muestra la latencia del Bot.',
                'en-US': 'Shows the bot latency.',
            },
            cooldown: 5,
        })
    }
    override async run(interaction: ChatInputCommandInteraction) {
        const translate = Translator(interaction)
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
                            new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setFields(
                                    { name: translate(keys.API), value: `${results[0].ping}ms`, inline: true },
                                    { name: translate(keys.ping.internal), value: performance + 'ms' },
                                    { name: translate(keys.ping.global), value: `${ping}ms`, inline: true },
                                )
                                .setTitle(translate(keys.PING))
                                .setTimestamp(),
                        ],
                    })
                    .then(() => {
                        logger.debug('ping execution finished')
                    })
            })
    }
}
