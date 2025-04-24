import { ChatInputCommandInteraction } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import Client from '#structures/Client.js'
import Command from '#structures/Command.js'
import Translator, { keys } from '#utils/Translator.js'
import logger from '#utils/logger.js'

export default class Stop extends Command {
    constructor() {
        super({
            name: 'stop',
            description: 'Stop the player!',
            cooldown: 5,
            dm_permission: false,
        })
    }

    override async run(interaction: ChatInputCommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const player = client.music.players.get(interaction.guild.id)
        if (!player)
            return await interaction
                .reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.settings.color)
                            .setFooter({
                                text: translate(keys.queue.no_queue),
                                iconURL: interaction.user.displayAvatarURL(),
                            }),
                    ],
                })
                .catch(logger.error)

        if (!player?.queue.current)
            return await interaction
                .reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.settings.color)
                            .setFooter({
                                text: translate(keys.queue.no_queue),
                                iconURL: interaction.user.displayAvatarURL(),
                            }),
                    ],
                })
                .catch(logger.error)

        if (player.trackRepeat) player.setTrackRepeat(false)
        if (player.queueRepeat) player.setQueueRepeat(false)
        try {
            await client.music.queueEnd(player)
        } catch (error) {
            client.errorHandler.captureException(error as Error)
        }

        return await interaction
            .reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.settings.color)
                        .setTitle(
                            translate(keys.SUCCESSEMBED) +
                                ' <a:tick:836295873091862568>',
                        )
                        .setDescription(translate(keys.stop.success))
                        .setFooter({
                            text: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
            })
            .catch(logger.error)
    }
}
