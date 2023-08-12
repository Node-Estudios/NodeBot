import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js'
import Translator, { keys } from '#utils/Translator.js'
import Command from '#structures/Command.js'
import Client from '#structures/Client.js'
import logger from '#utils/logger.js'

export default class Pause extends Command {
    constructor () {
        super({
            name: 'pause',
            description: 'Pause the current song!',
            cooldown: 5,
            dm_permission: false,
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

        client.music.trackPause(player, interaction)

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setTitle(translate(keys.SUCCESSEMBED))
                    .setDescription(
                        translate(keys.paused),
                    )
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() }),
            ],
        })
            .catch(logger.error)
    }
}
