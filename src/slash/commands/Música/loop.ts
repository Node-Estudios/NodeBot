import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js'
import Client from '#structures/Client.js'
import Command from '#structures/Command.js'
import Translator, { keys } from '#utils/Translator.js'
import logger from '#utils/logger.js'

export default class Loop extends Command {
    constructor () {
        super({
            name: 'loop',
            description: 'Loops the current queue',
            cooldown: 5,
        })
    }

    override async run (interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild()) return
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const player = client.music.players.get(interaction.guild.id)
        if (!player)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(client.settings.color).setFooter({
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
                    new EmbedBuilder().setColor(Colors.Red).setFooter({
                        text: translate(keys.skip.no_same),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
                .catch(logger.error)

        if (interaction.member.voice.channelId !== player.voiceChannel.id)
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

        if (!player.queue.current)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(client.settings.color).setFooter({
                        text: translate(keys.queue.no_queue),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
                .catch(logger.error)

        if (!player.trackRepeat) {
            player.setQueueRepeat(true)
            player.setTrackRepeat(false)
        }
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setFooter({
                        text: translate(keys.loop.song),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
            ],
        })
            .catch(logger.error)
    }
}
