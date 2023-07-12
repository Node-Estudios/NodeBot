import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js'
import { messageHelper } from '../../../handlers/messageHandler.js'
import Translator from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'
import { keys } from '../../../utils/locales.js'
import logger from '../../../utils/logger.js'

export default class skip extends Command {
    constructor() {
        super({
            name: 'skip',
            description: 'Skips the current song!',
            description_localizations: {
                'es-ES': '¡Salta la canción actual!',
                'en-US': 'Skips the current song!',
            },
            name_localizations: {
                'es-ES': 'saltar',
                'en-US': 'skip',
            },
            cooldown: 5,
            dm_permission: false,
            // options: [
            //     {
            //         type: 4,
            //         name: 'amount',
            //         name_localizations: {
            //             'es-ES': 'cantidad',
            //         },
            //         description: 'Amount of songs to skip.',
            //         description_localizations: {
            //             'es-ES': 'Cantidad de canciones para saltar.',
            //         },
            //         required: false,
            //     }
            // ]
        })
    }
    override async run(interaction: ChatInputCommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const message = new messageHelper(interaction)
        const player = client.music.players.get(interaction.guild.id)
        if (!player)
            return message.sendMessage({
                embeds: [
                    new EmbedBuilder().setColor(client.settings.color).setFooter({
                        text: translate(keys.queue.no_queue),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
            })

        if (!interaction.member.voice)
            return message
                .sendMessage({
                    embeds: [
                        new EmbedBuilder().setColor(Colors.Red).setFooter({
                            text: translate(keys.skip.no_same),
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                })
                .catch(e => logger.debug(e))

        let vc = player.voiceChannel
        if (interaction.member.voice.channelId !== vc.id) {
            return message
                .sendMessage({
                    embeds: [
                        new EmbedBuilder().setColor(Colors.Red).setFooter({
                            text: translate(keys.skip.no_same),
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                })
                .catch(e => logger.debug(e))
        }

        if (!player.queue.current) return
        if (player.trackRepeat) player.setTrackRepeat(false)
        if (player.queueRepeat) player.setQueueRepeat(false)

        const embed = new EmbedBuilder()
            .setColor(client.settings.color)
            .setTitle(translate(keys.SUCCESSEMBED))
            .setDescription(
                translate(keys.skip.skiped, {
                    song: player.queue.current.title,
                }),
            )
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        message.sendMessage({ embeds: [embed] }).catch(e => logger.debug(e))
        return player.skip()
    }
}
