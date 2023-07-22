import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import Translator, { keys } from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'
import logger from '../../../utils/logger.js'
import Player from '../../../structures/Player.js'

export default class Stop extends Command {
    constructor () {
        super({
            name: 'stop',
            description: 'Stop the player!',
            description_localizations: {
                'es-ES': '¡Detiene el reproductor!',
                'en-US': 'Stop the player!',
            },
            name_localizations: {
                'es-ES': 'detener',
                'en-US': 'stop',
            },
            cooldown: 5,
            dm_permission: false,
        })
    }

    override async run (interaction: ChatInputCommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const player = await Player.tryGetPlayer(interaction, false)

        if (!player?.queue.current) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(client.settings.color).setFooter({
                        text: translate(keys.queue.no_queue),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
        }

        if (player.trackRepeat) player.setTrackRepeat(false)
        if (player.queueRepeat) player.setQueueRepeat(false)
        await client.music.queueEnd(player)

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setTitle(translate(keys.SUCCESSEMBED) + ' <a:tick:836295873091862568>')
                    .setDescription(
                        translate(keys.stop.success),
                    )
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() }),
            ],
        }).catch(e => logger.debug(e))
    }
}
