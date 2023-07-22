import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { MessageHelper } from '../../../handlers/messageHandler.js'
import Translator, { keys } from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'
import Player from '../../../structures/Player.js'
import logger from '../../../utils/logger.js'

export default class skip extends Command {
    constructor () {
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

    override async run (interaction: ChatInputCommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const message = new MessageHelper(interaction)
        const player = await Player.tryGetPlayer(interaction, false)

        if (!player?.queue.current) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(client.settings.color).setFooter({
                        text: translate(keys.queue.no_queue),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
            })
        }
        if (player.trackRepeat) player.setTrackRepeat(false)
        if (player.queueRepeat) player.setQueueRepeat(false)

        const embed = new EmbedBuilder()
            .setColor(client.settings.color)
            .setTitle(translate(keys.SUCCESSEMBED) + ' <a:tick:836295873091862568>')
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
