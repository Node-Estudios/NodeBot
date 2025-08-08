import Translator, { keys } from '#utils/Translator.js'
import {
    APIMessageComponentEmoji,
    ButtonInteraction,
    ComponentType,
    ButtonComponent,
    ActionRowComponent,
} from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import Client from '#structures/Client.js'
import Button from '#structures/Button.js'
import logger from '#utils/logger.js'
type Writeable<T extends { [x: string]: any }, K extends string> = {
    [P in K]: T[P]
}
function getBlueRepeatEmoji(repeatMode: string, client: Client) {
    if (repeatMode === 'queue') return client.settings.emojis.blue.repeat_all
    else if (repeatMode === 'track')
        return client.settings.emojis.blue.repeat_one
    else return client.settings.emojis.white.repeat_off
}

export default class Repeat extends Button {
    constructor() {
        super('repeatMusic')
    }

    override async run(interaction: ButtonInteraction) {
        try {
            if (!interaction.inCachedGuild())
                return await interaction.deferUpdate()
            const translate = Translator(interaction)
            const client = interaction.client as Client
            const player = client.music.players.get(interaction.guild.id)
            if (!player?.queue.current)
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.settings.color)
                            .setFooter({
                                text: translate(keys.queue.no_queue),
                                iconURL: interaction.user.displayAvatarURL(),
                            }),
                    ],
                })

            if (
                interaction.member.voice.channelId !==
                (player.voiceChannel.id ?? '')
            )
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.settings.color)
                            .setFooter({
                                text: translate(keys.skip.no_same),
                                iconURL: interaction.user.displayAvatarURL(),
                            }),
                    ],
                })

            // Determine the queueRepeatMode based on currentTrackRepeat and currentQueueRepeat
            let queueRepeatMode
            if (player.trackRepeat && !player.queueRepeat) {
                queueRepeatMode = 'off'
                player.setQueueRepeat(false)
                player.setTrackRepeat(false)
            } else if (!player.trackRepeat && player.queueRepeat) {
                queueRepeatMode = 'track'
                player.setQueueRepeat(false)
                player.setTrackRepeat(true)
            } else {
                queueRepeatMode = 'queue'
                player.setQueueRepeat(true)
                player.setTrackRepeat(false)
            }

            const blueRepeatEmoji = getBlueRepeatEmoji(queueRepeatMode, client)

            // Safely find the repeat button in the message components
            if (
                !player.message ||
                !('components' in player.message) ||
                !Array.isArray(player.message.components)
            ) {
                logger.warn('No valid message components found in player')
                return await interaction.deferUpdate()
            }

            const actionRow = player.message.components[0]
            if (
                !actionRow ||
                !('components' in actionRow) ||
                !Array.isArray(actionRow.components)
            ) {
                logger.warn('No valid components found in action row')
                return await interaction.deferUpdate()
            }

            // Find the repeat button in the components
            const repeatButton = actionRow.components.find(
                (c): c is ButtonComponent =>
                    c.type === ComponentType.Button &&
                    'customId' in c &&
                    c.customId === 'repeatMusic' &&
                    'emoji' in c,
            )

            if (repeatButton && repeatButton.emoji) {
                const emojiData = repeatButton.emoji as Writeable<
                    APIMessageComponentEmoji,
                    keyof APIMessageComponentEmoji
                >

                if (blueRepeatEmoji.name)
                    emojiData.name = blueRepeatEmoji.name.toString()
                if (blueRepeatEmoji.id)
                    emojiData.id = blueRepeatEmoji.id.toString()
                if ('animated' in blueRepeatEmoji)
                    emojiData.animated = Boolean(blueRepeatEmoji.animated)
            }

            if (player.message)
                await player.message.edit({
                    components: player.message.components,
                    embeds: player.message.embeds,
                })

            await interaction.deferUpdate()
        } catch (e) {
            logger.error(e)
        }
        return true
    }
}
