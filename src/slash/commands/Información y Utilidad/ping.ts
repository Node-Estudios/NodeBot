import { ChatInputCommandInteraction, Colors } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import performanceMeters from '#cache/performanceMeters.js'
import Client from '#structures/Client.js'
import Command from '#structures/Command.js'
import Translator, { keys } from '#utils/Translator.js'

import logger from '#utils/logger.js'
export default class ping extends Command {
    constructor () {
        super({
            name: 'ping',
            description: 'Shows the bot latency.',
            cooldown: 5,
        })
    }

    override async run (interaction: ChatInputCommandInteraction) {
        const translate = Translator(interaction)
        const client = interaction.client as Client
        const ping = Math.abs((interaction.createdAt.getTime() - Date.now()) / 1000)
        return await client.cluster
            .broadcastEval(
                (c: any) => ({
                    ping: c.ws.ping,
                }),
                { cluster: client.cluster.id },
            )
            .then(async (results: any) => {
                const performance = performanceMeters.get('interaction_' + interaction.id)
                const time = performance?.stop() ?? 0
                if (performance)
                    performanceMeters.delete('interaction_' + interaction.id)

                // Todo: process.env.mode === 'development'
                return await interaction
                    .reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setFields(
                                    { name: translate(keys.API), value: `${results[0].ping}ms`, inline: true },
                                    { name: translate(keys.ping.internal), value: time + 'ms' },
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
