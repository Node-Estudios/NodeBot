import { ChatInputCommandInteraction, Colors } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import Client from '#structures/Client.js'
import Command from '#structures/Command.js'
import Translator, { keys } from '#utils/Translator.js'

import logger from '#utils/logger.js'

export default class skip extends Command {
    constructor () {
        super({
            name: 'skip',
            description: 'Skips the current song!',
            cooldown: 5,
            dm_permission: false,
        })
    }

    override async run (interaction: ChatInputCommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const player = client.music.players.get(interaction.guild.id)
        if (!player)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.settings.color)
                        .setFooter({
                            text: translate(keys.queue.no_queue),
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
                ephemeral: true,
            })
                .catch(logger.error)

        if (!interaction.member.voice)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setFooter({
                            text: translate(keys.skip.no_same),
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
                ephemeral: true,
            })
                .catch(console.error)

        const vc = player.voiceChannel
        if (interaction.member.voice.channelId !== vc.id)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(Colors.Red).setFooter({
                        text: translate(keys.skip.no_same),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
                .catch(logger.error)

        if (!player.queue.current) return
        if (player.trackRepeat) player.setTrackRepeat(false)
        if (player.queueRepeat) player.setQueueRepeat(false)
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setTitle(translate(keys.SUCCESSEMBED))
                    .setDescription(
                        translate(keys.skip.skiped, {
                            song: player.queue.current.title,
                        }),
                    )
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })],
        }).catch(logger.error)
        return player.skip()
    }
}
