import {
    ApplicationCommandOptionType,
    EmbedBuilder,
    ChatInputCommandInteraction,
} from 'discord.js'
// import { MusicCarouselShelf } from 'youtubei.js/dist/src/parser/nodes.js'
import performanceMeters from '../../../cache/performanceMeters.js'
import Translator, { keys } from '../../../utils/Translator.js'
import formatTime from '../../../utils/formatTime.js'
import Command from '../../../structures/Command.js'
import Player from '../../../structures/Player.js'
import Client from '../../../structures/Client.js'
import logger from '../../../utils/logger.js'
import { Track } from 'yasha'

export default class Play extends Command {
    constructor () {
        super({
            name: 'play',
            description: 'Play the song that you want with the name or a youtube/spotify link',
            name_localizations: {
                'es-ES': 'reproducir',
                'en-US': 'play',
            },
            description_localizations: {
                'en-US': 'Play the song that you want with the name or a youtube/spotify link',
                'es-ES': 'Reproduce la canción que desees con su nombre o un link de youtube/spotify',
            },
            dm_permission: false,
            cooldown: 5,
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'song',
                    description: 'Name of the song that u want to listen.',
                    name_localizations: {
                        'es-ES': 'canción',
                        'en-US': 'song',
                    },
                    description_localizations: {
                        'es-ES': 'Nombre de la canción que deseas escuchas.',
                        'en-US': 'Name of the song that u want to listen.',
                    },
                    required: true,
                },
            ],
        })
    }

    override async run (interaction: ChatInputCommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const player = await Player.tryGetPlayer(interaction)
        if (!player) return

        // Si el usuario está en el mismo canal de voz que el bot
        try {
            await interaction.deferReply()
            const source = 'Youtube'
            const song = interaction.options.getString('song', true)
            const search = await client.music.search(song, interaction.member, source).catch((e) => {
                logger.error(e)
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(15548997).setFooter({
                            text: translate(keys.play.not_reproducible),
                            iconURL: client.user?.displayAvatarURL(),
                        }),
                    ],
                })
            })

            // TODO: inject requester
            if (!(search instanceof Track)) return
            player.queue.add(search as Track & { requester: any })
            if (!player.playing && !player.paused) player.play()
            const embed = new EmbedBuilder().setColor(client.settings.color).setFields(
                {
                    name: translate(keys.AUTHOR),
                    value: search.author ?? '',
                    inline: true,
                },
                {
                    name: translate(keys.REQUESTER),
                    value: interaction.user.toString(),
                    inline: true,
                },
                {
                    name: translate(keys.DURATION),
                    value: formatTime(Math.trunc(search.duration ?? 0), false),
                    inline: true,
                },
            )
            if (client.settings.mode === 'development') {
                let executionTime = await performanceMeters.get('interaction_' + interaction.id)
                executionTime = executionTime.stop()
                const finaltext = 'Internal execution time: ' + executionTime + 'ms'
                embed.setFooter({ text: finaltext })
            }
            if (source === 'Youtube') {
                embed.setImage(`https://img.youtube.com/vi/${search.id}/maxresdefault.jpg`)
                embed.setDescription(
                    `**${translate(keys.play.added, {
                        song: `[${search.title}](https://www.youtube.com/watch?v=${search.id})`,
                    })}** <:pepeblink:967941236029788160>`,
                )
            } else if (source === 'Spotify') {
                if (search instanceof Track && search.thumbnails?.[0]) {
                    embed.setDescription(
                        `**${translate(keys.play.added, {
                            song: `[${search.title}](https://open.spotify.com/track/${search.id})`,
                        })}** <:pepeblink:967941236029788160>`,
                    )
                }
                embed.setImage((search).thumbnails?.[0].url ?? null)
            }
            interaction.editReply({ embeds: [embed] })
        } catch (e) {
            logger.error(e)
            interaction.editReply({
                content: translate(keys.GENERICERROR, {
                    inviteURL: client.officialServerURL,
                }),
            })
        }
    }
}
