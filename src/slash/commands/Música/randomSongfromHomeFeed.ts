import { EmbedBuilder, TextChannel, VoiceChannel } from 'discord.js'
import performanceMeters from '../../../cache/performanceMeters.js'
import { interactionCommandExtend } from '../../../events/client/interactionCreate.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'
import formatTime from '../../../utils/formatTime.js'
import logger from '../../../utils/logger.js'

export default class randomSong extends Command {
    constructor() {
        super({
            name: 'randomsong',
            description: 'Reproduce una o varias canciones aleatoria de tu feed',
            name_localizations: {
                'es-ES': 'randomsong',
            },
            description_localizations: {
                'es-ES': 'Reproduce la canción que desees con su nombre o un link de youtube/spotify',
            },
            cooldown: 5,
            requierements: {
                inVoiceChannel: true,
                sameVoiceChannel: false,
            },
            // options: [
            //     {
            //         type: 5,
            //         name: 'home',
            //         description: 'How many random song you want to load from your home feed',
            //         name_localizations: {
            //             'es-ES': 'canción',
            //         },
            //         description_localizations: {
            //             'es-ES': 'Nombre de la canción que deseas escuchas.',
            //         },
            //         required: true,
            //     },
            // ],
        })
    }

    async run(client: Client, interaction: interactionCommandExtend) {
        // interaction.member.voice.channel = client.channels.cache.get('967569503347163236')
        let player = client.music.players.get(interaction.guildId)
        // console.log(interaction.language)
        if (!player) {
            player = await client.music.createNewPlayer(
                interaction.member.voice.channel as VoiceChannel,
                interaction.channel as TextChannel,
                interaction.guild,
                100,
                interaction.user
            )
            player.connect()
        }
        if (player.voiceChannel.id !== interaction.member.voice.channel?.id)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(15548997).setFooter({
                        text: interaction.language.PLAY[2],
                        iconURL: client.user?.displayAvatarURL(),
                    }),
                ],
            })
        //Si el usuario está en el mismo canal de voz que el bot
        try {
            let search
            const source = 'Youtube'

            function getBestSongsByArtist(songs: any[], numSongs: number): any[] {
                // Creamos un diccionario para almacenar el número de veces que aparece cada artista en la lista
                const artistCounts: { [key: string]: number } = {};

                // Iteramos sobre cada canción de la lista y aumentamos el contador para cada artista
                songs.forEach((song) => {
                    song.artists.forEach((artist: { id: string | number }) => {
                        if (artistCounts[artist.id]) {
                            artistCounts[artist.id]++;
                        } else {
                            artistCounts[artist.id] = 1;
                        }
                    });
                });

                // Ordenamos las canciones utilizando el número de veces que aparece cada artista en la lista como métrica
                songs.sort((a, b) => {
                    // Si el artista de la canción A aparece más veces en la lista que el artista de la canción B, A es mejor
                    if (artistCounts[a.artists[0].id] > artistCounts[b.artists[0].id]) {
                        return -1;
                    }
                    // Si el artista de la canción B aparece más veces en la lista que el artista de la canción A, B es mejor
                    if (artistCounts[a.artists[0].id] < artistCounts[b.artists[0].id]) {
                        return 1;
                    }
                    // Si el artista de la canción A y B aparece el mismo número de veces en la lista, consideramos que son iguales
                    return 0;
                });

                // Devolvemos las numSongs mejores canciones
                return songs.slice(0, numSongs);
            }

            // @ts-ignore
            const songs = (await (await player.youtubei).music.getHomeFeed()).sections[0].contents;


            const songs2 = songs.filter((song: any) => song.item_type === 'song');
            const randomIndex = Math.floor(Math.random() * songs2.length);
            const song = songs2[randomIndex];
            // @ts-ignore
            // const info = await (await (await player.youtubei).music.getInfo(song.id));

            // logger.debug('info: ', info.streaming_data?.adaptive_formats[0].audio_quality);
            // const recap = await (await player.youtubei).music.getRecap()
            // const song = getBestSongsByArtist(filteredSongs, filteredSongs.length)[randomIndex].id
            try {
                // @ts-ignore
                search = await client.music.search(song.id, interaction.member, source)
            } catch (e) {
                logger.error(e)
                interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor(15548997).setFooter({
                            text: interaction.language.PLAY[9],
                            iconURL: client.user?.displayAvatarURL(),
                        }),
                    ],
                })

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

            player.queue.add(search)
            if (!player.playing && !player.paused) player.play()
            const embed = new EmbedBuilder().setColor(client.settings.color).setFields(
                {
                    name: interaction.language.PLAY[4],
                    value: search.author,
                    inline: true,
                },
                {
                    name: interaction.language.PLAY[5],
                    value: '<@' + interaction.user.id + '>',
                    inline: true,
                },
                {
                    name: interaction.language.PLAY[6],
                    value: formatTime(Math.trunc(search.duration), false),
                    inline: true,
                },
            )
            if (client.settings.mode == 'development') {
                let executionTime = await performanceMeters.get('interaction_' + interaction.id)
                executionTime = executionTime.stop()
                let finaltext = 'Internal execution time: ' + executionTime + 'ms'
                // console.log(search)
                embed.setFooter({ text: finaltext })
            }
            if (!(await player.youtubei).session.logged_in) embed.addFields([{ name: 'Warning', value: 'Youtube Music no ha conseguido iniciar sesión, por lo que es posible que no se adapte a ti la canción', inline: true }])
            if (source === 'Youtube') {
                logger.info(search)
                if (search.streams) embed.addFields({ name: 'bitrate', value: search.streams[0].bitrate, inline: true })
                embed.setThumbnail(`https://img.youtube.com/vi/${search.id}/maxresdefault.jpg`)
                embed.setDescription(
                    `**${interaction.language.PLAY[3]}\n[${search.title}](https://www.youtube.com/watch?v=${search.id})**`,
                )
                // embed.addField(
                //     "Bitrate",
                //     player.track.bitrate,
                //     true
                // )
            } else if (source === 'Spotify') {
                if (search.thumbnails[0])
                    embed.setDescription(
                        `**${interaction.language.PLAY[3]}\n[${search.title}](https://open.spotify.com/track/${search.id})**`,
                    )
                embed.setThumbnail(search.thumbnails[0].url)
            }
            // console.log(embed)
            // console.log(await (await player.youtubei).music.getHomeFeed())
            interaction.reply({ embeds: [embed] })
            return true
        } catch (e) {
            logger.error(e)
            interaction.reply({
                content: `Ups! Parece que hubo un error. \nPuede contactar con el desarrollador para avisarle en [El Discord Oficial](${client.officialServerURL})`,
                embeds: [],
            })
        }
        // CÓDIGO NORMAL DEL PLAY
    }
}
