import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js'
import Translator, { keys } from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'
import logger from '../../../utils/logger.js'
import Player from '../../../structures/Player.js'

export default class Resume extends Command {
    constructor () {
        super({
            name: 'resume',
            description: 'Resume the current song!',
            description_localizations: {
                'es-ES': '¡Resume la canción actual!',
                'en-US': 'Resume the current song!',
            },
            name_localizations: {
                'es-ES': 'resumir',
                'en-US': 'resume',
            },
            cooldown: 5,
            dm_permission: false,
        })
    }

    override async run (interaction: ChatInputCommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const player = await Player.tryGetPlayer(interaction, false)
        if (!player) return

        if (!player.queue.current) {
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
        player.resumedUser = interaction.user
        player.pause(false)

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setTitle(translate(keys.SUCCESSEMBED) + ' <a:tick:836295873091862568>')
                    .setDescription(
                        translate(keys.resumed),
                    )
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() }),
            ],
        }).catch(e => logger.debug(e))
    }
}
