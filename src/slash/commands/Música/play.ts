import { EmbedBuilder as MessageEmbed, TextChannel, VoiceChannel } from 'discord.js'
import performanceMeters from '../../../cache/performanceMeters.js'
import { interactionCommandExtend } from '../../../events/client/interactionCreate.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'
import formatTime from '../../../utils/formatTime.js'
import logger from '../../../utils/logger.js'

export default class play extends Command {
    constructor() {
        super({
            name: 'play',
            description: 'Reproduce música en el canal de voz que te encuentres',
            name_localizations: {
                'es-ES': 'reproducir',
            },
            description_localizations: {
                'es-ES': 'Reproduce la canción que desees con su nombre o un link de youtube/spotify',
            },
            cooldown: 5,
            requierements: {
                inVoiceChannel: true,
                sameVoiceChannel: false,
            },
            options: [
                {
                    type: 3,
                    name: 'song',
                    description: 'Name of the song that u want to listen.',
                    name_localizations: {
                        'es-ES': 'canción',
                    },
                    description_localizations: {
                        'es-ES': 'Nombre de la canción que deseas escuchas.',
                    },
                    required: false,
                },
            ],
        })
    }
    async run(client: Client, interaction: interactionCommandExtend) {
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
                    new MessageEmbed().setColor(15548997).setFooter({
                        text: interaction.language.PLAY[2],
                        iconURL: client.user?.displayAvatarURL(),
                    }),
                ],
            })
        //Si el usuario está en el mismo canal de voz que el bot
        try {
            let search
            const source = 'Youtube'
            let song = interaction.options.getString('song', false)
            if (!song) {
                const songs = (await (await player.youtubei).music.getHomeFeed()).sections![0].contents;
                const songs2 = songs.filter((song: any) => song.item_type === 'song');
                const randomIndex = Math.floor(Math.random() * songs2.length);
                const song3 = songs2[randomIndex];
                // console.log(await song3)
                //@ts-ignore
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
                    interaction.reply({
                        embeds: [
                            new MessageEmbed().setColor(15548997).setFooter({
                                text: interaction.language.PLAY[9],
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

            // console.log(search)
            player.queue.add(search)
            if (!player.playing && !player.paused) player.play()
            const embed = new MessageEmbed().setColor(client.settings.color).setFields(
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
            if (!(await player.youtubei).session.logged_in) embed.addFields([{ name: 'Warning', value: 'Youtube Music no ha conseguido iniciar sesión, por lo que es posible que no se adapte a ti la canción', inline: true }])
            if (client.settings.mode == 'development') {
                let executionTime = await performanceMeters.get('interaction_' + interaction.id)
                executionTime = executionTime.stop()
                let finaltext = 'Internal execution time: ' + executionTime + 'ms'
                console.log(search)
                embed.setFooter({ text: finaltext })
            }
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
            // console.log(await (await client.music.youtubei).music.getHomeFeed())
            interaction.reply({ embeds: [embed] })
        } catch (e) {
            logger.error(e)
            interaction.reply({
                content: `Ups! Parece que hubo un error. \nPuede contactar con el desarrollador para avisarle en [El Discord Oficial](${client.officialServerURL})`,
                embeds: [],
            })
        }
        //CÓDIGO NORMAL DEL PLAY
    }
}
