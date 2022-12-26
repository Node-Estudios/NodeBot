require('dotenv').config()
import { CommandInteraction, Guild, GuildMember, MessageEmbed, TextChannel, VoiceChannel } from 'discord.js'
import Client from '../../../structures/Client'

import Command from '../../../structures/Command'

export default class play extends Command {
    constructor(client: Client) {
        super(client, {
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
                    required: true,
                },
            ],
        })
    }
    async run(client: Client, interaction: CommandInteraction, args: any) {
        // if (!(interaction.member as GuildMember).voice.channel)
        //     return interaction.editReply({ content: 'No estás en un canal de voz', embeds: [] });
        /*        client.cluster.request({ content: { system: 'music', command: 'play', data } }).then(res => {
                    console.log(res);
                });*/
        let player: any = client.music.players.get(interaction.guildId!)
        if (!player) {
            player = await client.music.createNewPlayer(
                (interaction.member as GuildMember).voice.channel as VoiceChannel,
                interaction.channel as TextChannel,
                interaction.guild as Guild,
                100,
            )
            player.connect()
        }
        if (player.voiceChannel.id === (interaction.member as GuildMember).voice.channel!.id) {
            //Si el usuario está en el mismo canal de voz que el bot
            try {
                let search
                let source = args[1]
                if (!source) source = 'Youtube'
                try {
                    search = await client.music.search(args[0], interaction.member, source)
                } catch (e) {
                    logger.error(e)
                    const errorembed = new MessageEmbed().setColor(15548997).setFooter({
                        text: client.language.PLAY[9],
                        iconURL: client.user?.displayAvatarURL(),
                    })
                    interaction.editReply({ embeds: [errorembed] })
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
                //         .setTitle(client.language.PLAY[11])
                //         .setColor("GREEN")
                //         .addField(client.language.PLAY[12], `${search.title}`, true)
                //         .addField(
                //             client.language.PLAY[13],
                //             `\`${list.length}\``,
                //             true
                //         )
                //         .addField(
                //             client.language.PLAY[5],
                //             interaction.user.tag,
                //             true
                //         )
                //         .addField(client.language.PLAY[6], `${totalDuration}`, true)
                //     if (search.platform === 'Youtube') {
                //         e.setThumbnail(
                //             `https://img.youtube.com/vi/${search.id}/maxresdefault.jpg`
                //         )
                //     } else if (search.platform === 'Spotify') {
                //         if (search.thumbnails[0])
                //             e.setThumbnail(search.thumbnails[0])
                //     }
                //     interaction.editReply({ embeds: [e], content: '' })
                // }

                player.queue.add(search)
                if (!player.playing && !player.paused) player.play()
                const embed = new MessageEmbed()
                    .setColor('GREEN')
                    .addField(client.language.PLAY[4], search.author, true)
                    .addField(client.language.PLAY[5], '<@' + interaction.user.id + '>', true)
                    .addField(client.language.PLAY[6], client.formatTime(Math.trunc(search.duration), false), true)
                if (source === 'Youtube') {
                    logger.info(search)
                    if (search.streams) embed.addField('bitrate', search.streams[0].bitrate, true)
                    embed.setThumbnail(`https://img.youtube.com/vi/${search.id}/maxresdefault.jpg`)
                    embed.setDescription(
                        `**${client.language.PLAY[3]}\n[${search.title}](https://www.youtube.com/watch?v=${search.id})**`,
                    )
                    // embed.addField(
                    //     "Bitrate",
                    //     player.track.bitrate,
                    //     true
                    // )
                } else if (source === 'Spotify') {
                    if (search.thumbnails[0])
                        embed.setDescription(
                            `**${client.language.PLAY[3]}\n[${search.title}](https://open.spotify.com/track/${search.id})**`,
                        )
                    embed.setThumbnail(search.thumbnails[0].url)
                }
                // console.log(embed)
                interaction.editReply({ embeds: [embed] })
            } catch (e) {
                logger.error(e)
                interaction.editReply({
                    content: `Ups! Parece que hubo un error. \nPuede contactar con el desarrollador para avisarle en [El Discord Oficial](${client.officialServerURL})`,
                    embeds: [],
                })
            }
            //CÓDIGO NORMAL DEL PLAY
        } else {
            const errorembed = new MessageEmbed().setColor(15548997).setFooter({
                text: client.language.PLAY[2],
                iconURL: client.user?.displayAvatarURL(),
            })
            return interaction.editReply({ embeds: [errorembed] })
            //Si el usuario no está en el mismo canal de voz
            //Return msg
        }
    }
}
