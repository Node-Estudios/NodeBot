import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import Translator, { keys } from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'

import logger from '../../../utils/logger.js'
import Player from '../../../structures/Player.js'

export default class Pause extends Command {
    constructor () {
        super({
            name: 'pause',
            description: 'Pause the current song!',
            description_localizations: {
                'es-ES': '¡Pausa la canción actual!',
                'en-US': 'Pause the current song!',
            },
            name_localizations: {
                'es-ES': 'pausar',
                'en-US': 'pause',
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
        player.pausedUser = interaction.user
        player.pause(true)

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setTitle(translate(keys.SUCCESSEMBED) + ' <a:tick:836295873091862568>')
                    .setDescription(
                        translate(keys.paused),
                    )
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() }),
            ],
        }).catch(e => logger.debug(e))
    }
}
