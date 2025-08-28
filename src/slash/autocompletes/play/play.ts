import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    VoiceChannel,
    Colors,
    User,
} from 'discord.js'
import {
    MusicCarouselShelf,
    MusicResponsiveListItem,
} from 'youtubei.js/dist/src/parser/nodes.js'
import performanceMeters from '#cache/performanceMeters.js'
import Translator, { keys } from '#utils/Translator.js'
import formatTime from '#utils/formatTime.js'
import Command from '#structures/Command.js'
import Client from '#structures/Client.js'
import Player from '#structures/Player.js'
import { randomInt } from 'node:crypto'
import logger from '#utils/logger.js'

export default class play extends Command {
    constructor() {
        super({
            name: 'play',
            description:
                'Play the song that you want with the name or a youtube/spotify link',
            dm_permission: false,
            cooldown: 5,
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'song',
                    description: 'Name of the song that u want to listen.',
                    autocomplete: true,
                    required: false,
                },
            ],
        })
    }

    override async run(interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild()) return true
        const client = interaction.client as Client
        const translate = Translator(interaction)

        try {
            await interaction.deferReply()

            if (!interaction.member.voice.channel) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(Colors.Red).setFooter({
                            text: translate(keys.play.not_voice),
                            iconURL: client.user?.displayAvatarURL(),
                        }),
                    ],
                })
            }

            // CAMBIO: Se permite que 'player' pueda ser 'undefined' al principio.
            let player: Player | undefined = client.music.players.get(
                interaction.guildId,
            )

            if (!player) {
                // CAMBIO: Se asigna directamente el resultado de 'createNewPlayer' a la variable 'player'.
                // Esto asume que 'createNewPlayer' devuelve el reproductor creado.
                player = await client.music.createNewPlayer(
                    interaction.member.voice.channel as VoiceChannel,
                    interaction.channelId,
                )
                // Ahora 'player' está garantizado que existe y podemos conectar.
                await player.connect()
            }

            if (
                player.voiceChannel.id !== interaction.member.voice.channel.id
            ) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(Colors.Red).setFooter({
                            text: translate(keys.play.same),
                            iconURL: client.user?.displayAvatarURL(),
                        }),
                    ],
                })
            }

            player.textChannelId = interaction.channelId

            const songQuery = interaction.options.getString('song', false)

            const searchResult = !songQuery
                ? await this.getRecomended(player, interaction.user)
                : await client.music.search(songQuery, interaction.user)

            if (!searchResult) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(Colors.Red).setFooter({
                            text: translate(keys.play.not_reproducible),
                            iconURL: client.user?.displayAvatarURL(),
                        }),
                    ],
                })
            }

            if ((searchResult as any).streams?.live) {
                return await interaction.editReply({
                    content:
                        'We are currently working on supporting Live Streaming videos. :D',
                })
            }

            player.queue.add(searchResult)
            if (!player.playing || player.paused) {
                await player.play()
            }

            const embed = new EmbedBuilder()
                .setColor(client.settings.color)
                .addFields(
                    {
                        name: translate(keys.AUTHOR),
                        value: searchResult.author ?? 'unknown',
                        inline: true,
                    },
                    {
                        name: translate(keys.REQUESTER),
                        value: `${interaction.user}`,
                        inline: true,
                    },
                )

            const duration = formatTime(
                Math.trunc(searchResult.duration ?? 0),
                false,
            )
            if (duration) {
                embed.addFields({
                    name: translate(keys.DURATION),
                    value: duration,
                    inline: true,
                })
            }

            if (client.settings.mode === 'development') {
                const execution = performanceMeters.get(
                    'interaction_' + interaction.id,
                )
                const executionTime = execution?.stop()
                embed.setFooter({
                    text: `Internal execution time: ${executionTime}ms`,
                })
            }

            embed.setThumbnail(
                `https://img.youtube.com/vi/${searchResult.id}/maxresdefault.jpg`,
            )
            embed.setDescription(
                `**${translate(keys.play.added, {
                    song: `[${searchResult.title}](https://www.youtube.com/watch?v=${searchResult.id})`,
                })}** <:pepeblink:967941236029788160>`,
            )

            await interaction.editReply({ embeds: [embed] })
        } catch (e) {
            logger.error(e, 'Error en el comando Play')

            const errorMessage = translate(keys.GENERICERROR, {
                inviteURL: client.officialServerURL,
            })

            if (interaction.replied || interaction.deferred) {
                await interaction
                    .editReply({ content: errorMessage, embeds: [] })
                    .catch(logger.error)
            } else {
                await interaction
                    .reply({ content: errorMessage, ephemeral: true })
                    .catch(logger.error)
            }
        }
        return true
    }

    async getRecomended(player: Player, user: User) {
        const client = player.guild.client as Client
        try {
            const home = await player.youtubei.music.getHomeFeed()
            const songs = home.sections?.[0] as MusicCarouselShelf
            const song = songs.contents?.[
                randomInt(songs.contents.length)
            ] as MusicResponsiveListItem
            return await client.music.search(song.name ?? 'music', user)
        } catch (error) {
            logger.error(error)
            client.errorHandler.captureException(error as Error)
            return undefined
        }
    }
}
