import { EmbedBuilder } from 'discord.js'

import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'
import moment from 'moment'
import Translator, { keys } from '../../../utils/Translator.js'
import { MessageHelper } from '../../../handlers/messageHandler.js'
export default class nowPlaying extends Command {
    constructor () {
        super({
            name: 'nowplaying',
            description: 'See the current song playing.',
            name_localizations: {
                'es-ES': 'nowplaying',
            },
            description_localizations: {
                'es-ES': 'Revisa la canción que se está actualmente reproduciendo.',
            },
            cooldown: 5,
        })
    }

    override async run (interaction: ChatInputCommandInteractionExtended<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const message = new MessageHelper(interaction)
        const player = client.music.players.get(interaction.guildId)
        if (!player) {
            return await message.sendMessage(
                {
                    embeds: [
                        new EmbedBuilder().setColor(15548997).setFooter({
                            text: interaction.language.SKIP[1][1],
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                },
                false,
            )
        }
        if (!player.queue.current) {
            return await message.sendEphemeralMessage({
                embeds: [
                    new EmbedBuilder().setColor(client.settings.color).setFooter({
                        text: translate(keys.skip.messages[1]), // me gusta

                    }),
                ],
            }, true)
        }
        const song = player.queue.current
        const parsedCurrentDuration = moment
            .duration(player.position, 'milliseconds')
            .format('mm:ss', {
                trim: false,
            })
        const parsedDuration = moment
            .duration(duration, 'milliseconds')
            .format('mm:ss', {
                trim: false,
            })
        const part = Math.floor((player.position / duration) * 30)
        const uni = player.playing ? '▶' : '⏸️'
        const thumbnail = `https://img.youtube.com/vi/${identifier}/maxresdefault.jpg`
        const user = `<@${requester.userId}>`
    }
}
