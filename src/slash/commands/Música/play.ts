import { GuildMember, EmbedBuilder as MessageEmbed, TextChannel, VoiceChannel } from 'discord.js'
import performanceMeters from '../../../cache/performanceMeters.js'
import { interactionCommandExtend } from '../../../events/client/interactionCreate.js'
import { messageHelper } from '../../../handlers/messageHandler.js'
import UserModel from '../../../models/user.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'
import Youtubei from '../../../structures/Youtubei.js'
import formatTime from '../../../utils/formatTime.js'
import logger from '../../../utils/logger.js'

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

type UserExtended = GuildMember & {
    youtubei: Youtubei
}
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
                {
                    type: 10,
                    name: 'amount',
                    description: 'Amount of songs to load. Only works if you dont put a song string',
                    name_localizations: {
                        'es-ES': 'cantidad'
                    },
                    description_localizations: {
                        'es-ES': 'Cantidad de canciones a reproducir. Solo funciona si nos dejas elegir.'
                    },
                    requiered: false
                }
            ],
        })
    }
    async run(client: Client, interaction: interactionCommandExtend) {
        let player = client.music.players.get(interaction.guildId);

        if (!player) {
            player = await client.music.createNewPlayer(
                interaction.member.voice.channel as VoiceChannel,
                interaction.channel as TextChannel,
                interaction.guild,
                100,
                interaction.user
            );
            await player.connect();
        }

        if (player.voiceChannel.id !== interaction.member.voice.channel?.id) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(15548997)
                        .setFooter({
                            text: interaction.language.PLAY[2],
                            iconURL: client.user?.displayAvatarURL(),
                        }),
                ],
            });
        }

        const source = "Youtube";
        let search;

        const song = interaction.options.getString("song", false);
        if (!song) {
            interaction.user = interaction.user as UserExtended;
            if (!interaction.user.youtubei) {
                interaction.user.youtubei = await new Youtubei(interaction.user).createSession();
                await UserModel.findOne({ id: interaction.user.id }).then(async (user) => {
                    if (user) {
                        if (user.credentials) {
                            await interaction.user.youtubei.session.signIn(user.credentials);
                        } else {
                            interaction.user.youtubei.session.signIn();
                        }
                    } else {
                        interaction.user.youtubei.session.signIn();
                    }
                });
            }

            let songs: any[] = [];
            try {
                const songsData = await interaction.user.youtubei.music.getHomeFeed();
                for (const section of songsData.sections) {
                    songs = shuffleArray(songs.concat(section.contents.filter((song: { item_type: string }) => song.item_type === "song")))
                    if (songs.length > 10) break;
                }
            } catch (e) {
                logger.debug("error while searching");
                UserModel.findOneAndUpdate({ id: interaction.user.id }, { credentials: null });
                await interaction.user.youtubei.session.signOut();
                const songsData = await interaction.user.youtubei.music.getHomeFeed();
                for (const section of songsData.sections) {
                    songs = songs.concat(section.contents.filter((song: { item_type: string }) => song.item_type === "song"));
                    if (songs.length > 10) break;
                }
            }

            const number = interaction.options.getNumber("amount", false);
            // console.log('songs: ', songs)
            if (number) {
                const amount = number > 10 ? 10 : number;
                search = (await Promise.all(
                    Array.from({ length: amount }, async (_, i) => {
                        const song = songs[i % songs.length];
                        return await client.music.search(song.id, interaction.member, source);
                    })
                ));
            } else {
                const randomIndex = Math.floor(Math.random() * songs.length);
                const randomSong = songs[randomIndex];
                search = await client.music.search(randomSong.id, interaction.member, source);
            }


            // search = await client.music.search(song3.id, interaction.member, source)
            // const playlist = await (await player.youtubei).getPlaylist()
            // if(playlist) {
            //     search = playlist
            // }
            // logger.debug(interaction.user.youtubei)
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
        // console.log('search: ', search)

        if (Array.isArray(search)) {
            for (const item of search) {
                if (!player.queue.some((song) => song.id === item.id)) player.queue.add(item);
            }
        } else {
            player.queue.add(search);
        }
        player.queue.shuffle()
        if (!player.playing && !player.paused) player.play()
        const embed = new MessageEmbed().setColor(client.settings.color).setFields(
            {
                name: interaction.language.PLAY[4],
                value: player.queue.current!.author,
                inline: true,
            },
            {
                name: interaction.language.PLAY[5],
                value: '<@' + interaction.user.id + '>',
                inline: true,
            },
            {
                name: interaction.language.PLAY[6],
                value: formatTime(Math.trunc(player.queue.current!.duration), false),
                inline: true,
            },
        )
        if (!(await interaction.user.youtubei).session.logged_in) embed.addFields([{ name: 'Warning', value: 'Youtube Music no ha conseguido iniciar sesión, por lo que es posible que no se adapte a ti la canción', inline: true }])
        if (client.settings.mode == 'development') {
            let executionTime = await performanceMeters.get('interaction_' + interaction.id)
            executionTime = executionTime.stop()
            let finaltext = 'Internal execution time: ' + executionTime + 'ms'
            // console.log(search)
            embed.setFooter({ text: finaltext })
        }
        console.log('current: ', player.queue.current)
        if (source === 'Youtube') {
            // logger.info(search)
            // if (player.queue.current!.bitrate!) embed.addFields({ name: 'bitrate', value: search.streams[0].bitrate, inline: true })
            embed.setThumbnail(`https://img.youtube.com/vi/${player.queue.current!.id}/maxresdefault.jpg`)
            embed.setDescription(
                `**${interaction.language.PLAY[3]}\n[${search.title}](https://www.youtube.com/watch?v=${player.queue.current!.id})**`,
            )
            // embed.addField(
            //     "Bitrate",
            //     player.track.bitrate,
            //     true
            // )
        } else if (source === 'Spotify') {
            if (search.thumbnails[0])
                embed.setDescription(
                    `**${interaction.language.PLAY[3]}\n[${search.title}](https://open.spotify.com/track/${player.queue.current!.id})**`,
                )
            embed.setThumbnail(search.thumbnails[0].url)
        }
        // console.log(embed)
        // console.log(await (await client.music.youtubei).music.getHomeFeed())
        let msg = new messageHelper(interaction);
        msg.sendMessage({ embeds: [embed] }, false).catch((e: any) => { logger.debug(e) })
        //CÓDIGO NORMAL DEL PLAY
    }
}
