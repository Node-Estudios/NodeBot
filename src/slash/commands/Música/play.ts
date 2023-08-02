import {
    ApplicationCommandOptionType,
    EmbedBuilder,
    TextChannel,
    VoiceChannel,
    ChatInputCommandInteraction,
    Colors,
} from 'discord.js'
import { MusicCarouselShelf } from 'youtubei.js/dist/src/parser/nodes.js'
import performanceMeters from '../../../cache/performanceMeters.js'
import Translator, { keys } from '../../../utils/Translator.js'
import formatTime from '../../../utils/formatTime.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'
import logger from '../../../utils/logger.js'

export default class play extends Command {
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
                    autocomplete: true,
                    required: false,
                },
            ],
        })
    }

    override async run (interaction: ChatInputCommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        let player = client.music.players.get(interaction.guildId)
        if (!interaction.member.voice.channelId) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(Colors.Red).setFooter({
                        text: translate(keys.play.not_voice),
                        iconURL: client.user?.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
        }
        if (!player) {
            player = await client.music.createNewPlayer(
                interaction.member.voice.channel as VoiceChannel,
                interaction.channel as TextChannel,
            )
            await player.connect()
        }
        if (player.voiceChannel.id !== interaction.member.voice.channelId) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(Colors.Red).setFooter({
                        text: translate(keys.play.same),
                        iconURL: client.user?.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
        }

        // Si el usuario está en el mismo canal de voz que el bot
        try {
            await interaction.deferReply()
            let search
            const source = 'Youtube'
            const song = interaction.options.getString('song', false)
            if (!song) {
                const songs = ((await (await player.youtubei).music.getHomeFeed()).sections?.[0] as MusicCarouselShelf)
                    .contents
                const songs2 = songs.filter((song: any) => song.item_type === 'song')
                const randomIndex = Math.floor(Math.random() * songs2.length)
                const song3 = songs2[randomIndex]
                // @ts-expect-error
                search = await client.music.search(song3.id, interaction.member, source)
                // search = await client.music.search(song3.id, interaction.member, source)
                // const playlist = await (await player.youtubei).getPlaylist()
                // if(playlist) {
                //     search = playlist
                // }
            } else {
                try {
                    search = await client.music.search(song, interaction.member, source)
                } catch (e) {
                    logger.error(e)
                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder().setColor(15548997).setFooter({
                                text: translate(keys.play.not_reproducible),
                                iconURL: client.user?.displayAvatarURL(),
                            }),
                        ],
                    })
                }
            }
            // console.log(typeof search)

            // if (search instanceof TrackPlaylist) {
            //     const firstTrack = search.first_track;
            //     let list = [];

            //     if (firstTrack) list.push(firstTrack);

            //     while (search && search.length) {
            //         if (firstTrack) {
            //             for (let i = 0; i < search.length; i++) {
            //                 if (search[i].equals(firstTrack)) {
            //                     search.splice(i, 1);
            //                     break;
            //                 }
            //             }
            //         }
            //         list = list.concat(search);
            //         try {
            //             search = await search.next();
            //         }
            //         catch (e) {
            //             logger.error(e);
            //             throw e;
            //         }
            //     }

            //     if (list.length) {
            //         for (const track of list) {
            //             if (!track.requester) track.requester = interaction.member;
            //             player.queue.add(track);
            //         }
            //     }

            //     const totalDuration = list.reduce((acc, cur) => acc + cur.duration, 0);

            //     if (!player.playing && !player.paused) player.play();

            //     const e = new MessageEmbed()
            //         .setTitle(interaction.language.PLAY[11])
            //         .setColor("GREEN")
            //         .addField(interaction.language.PLAY[12], `${search.title}`, true)
            //         .addField(
            //             interaction.language.PLAY[13],
            //             `\`${list.length}\``,
            //             true
            //         )
            //         .addField(
            //             interaction.language.PLAY[5],
            //             interaction.user.tag,
            //             true
            //         )
            //         .addField(interaction.language.PLAY[6], `${totalDuration}`, true)
            //     if (search.platform === 'Youtube') {
            //         e.setThumbnail(
            //             `https://img.youtube.com/vi/${search.id}/maxresdefault.jpg`
            //         )
            //     } else if (search.platform === 'Spotify') {
            //         if (search.thumbnails[0])
            //             e.setThumbnail(search.thumbnails[0])
            //     }
            //     interaction.reply({ embeds: [e], content: '' })
            // }
            // TODO: Add streaming support
            if (search.streams.live) {
                return await interaction.editReply({
                    content: 'We are currently working on supporting Live Streaming videos. :D',
                })
            }
            player.queue.add(search)
            if (!player.playing && !player.paused) player.play()
            const embed = new EmbedBuilder().setColor(client.settings.color).setFields(
                {
                    name: translate(keys.AUTHOR),
                    value: search.author,
                    inline: true,
                },
                {
                    name: translate(keys.REQUESTER),
                    value: interaction.user.toString(),
                    inline: true,
                },
                {
                    name: translate(keys.DURATION),
                    value: formatTime(Math.trunc(search.duration), false),
                    inline: true,
                },
            )
            if (client.settings.mode === 'development') {
                let executionTime = await performanceMeters.get('interaction_' + interaction.id)
                executionTime = executionTime?.stop()
                const finaltext = 'Internal execution time: ' + executionTime + 'ms'
                embed.setFooter({ text: finaltext })
            }
            if (source === 'Youtube') {
                embed.setThumbnail(`https://img.youtube.com/vi/${search.id}/maxresdefault.jpg`)
                embed.setDescription(
                    `**${translate(keys.play.added, {
                        song: `[${search.title}](https://www.youtube.com/watch?v=${search.id})`,
                    })}** <:pepeblink:967941236029788160>`,
                )
            } else if (source === 'Spotify') {
                if (search.thumbnails[0]) {
                    embed.setDescription(
                        `**${translate(keys.play.added, {
                            song: `[${search.title}](https://open.spotify.com/track/${search.id})`,
                        })}** <:pepeblink:967941236029788160>`,
                    )
                }
                embed.setThumbnail(search.thumbnails[0].url)
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
        return true
    }
}
