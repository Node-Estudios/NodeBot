import {
    ButtonBuilder,
    ButtonStyle,
    Collection,
    Guild as DiscordGuild,
    Guild,
    GuildMember,
    ActionRowBuilder as MessageActionRow,
    ButtonBuilder as MessageButton,
    EmbedBuilder as MessageEmbed,
    TextChannel,
    VoiceChannel,
} from 'discord.js'
import EventEmitter from 'events'
import yasha from 'yasha'
import client from '../bot.js'
import languageCache from '../cache/idioms.js'
import retrieveUserLang from '../utils/db/retrieveUserLang.js'
import formatTime from '../utils/formatTime.js'
import logger from '../utils/logger.js'
import Player from './Player.js'
// ? use client for lang
import { spamIntervalDB } from './spamInterval.js'
let spamIntervald = new spamIntervalDB()
type UserExtended = GuildMember & {}

export default class MusicManager extends EventEmitter {
    players = new Collection<string, Player>()
    spamInterval = spamIntervald
    youtubeCodes = new Collection<string, UserExtended>()
    constructor() {
        super()
    }
    private async sendSpamMSG(user: UserExtended, player: Player) {
        await (await player.youtubei).session.signIn(undefined)
        // if (!this.spamInterval.checkUser(user.id)) {

        //     this.spamInterval.addUser(user.id, 30 * 60 * 1000);
        // } else return
    }

    async createNewPlayer(vc: VoiceChannel, textChannel: TextChannel, guild: Guild, volume: number) {
        const player = new Player({
            musicManager: this,
            guild,
            voiceChannel: vc,
            textChannel,
            volume,
            language: await retrieveUserLang(guild),
        })
        // Imprime un mensaje de depuración
        // logger.debug('Sign in successful: ', credentials);
        // Crea un objeto "EmbedBuilder" y establece la descripción del mensaje
        this.players.set(guild.id, player)
        // console.log(player.youtubei)
        player.on('ready', () => this.trackStart(player))

        player.on('finish', () => this.trackEnd(player, true))
        // player.on('packet', (buffer: Buffer, frame_size: number) => {
        //     console.log(`Packet: ${frame_size} samples`);
        // });

        player.on(yasha.VoiceConnection.Status.Destroyed, () => player.destroy())

        player.on('error', (err: any) => {
            logger.error(err)
            player.skip()
        })

        return player
    }
    async trackStart(player: Player) {
        // todo: Check if the song limit is the saçme as stablished for the admins
        // if(player.queue.current?.duration > player.guild.)
        player.playing = true
        player.paused = false
        let song = player.queue.current!
        if (!song) return
        // console.log(song.requester)
        player.language = await retrieveUserLang(player.queue.current!.requester.id) // es_ES // en_US
        let language = await languageCache.get(player.language).default

        // ^ Si no tenemos un mensaje ya enviado, lo enviamos, y si lo tenemos, borramos el anterior y enviamos uno nuevo <3
        if (!player.message) {
            const row = new MessageActionRow<ButtonBuilder>().addComponents(
                new MessageButton()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(language.PLAYER['stopMusic'])
                    .setCustomId('stopMusic'),
                new MessageButton()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(language.PLAYER['pauseMusic'])
                    .setCustomId('pauseMusic'),
                new MessageButton()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(language.PLAYER['skipMusic'])
                    .setCustomId('skipMusic'),
                new MessageButton()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(language.PLAYER['queueMusic'])
                    .setCustomId('queueMusic'),
            )

            const embed = new MessageEmbed().setColor(client.settings.color)
            // console.log(song)
            if (song.platform === 'Youtube') {
                embed
                    .setThumbnail(`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`)
                    .setDescription(
                        `${language.PLAYING} **[${song.title}](https://music.youtube.com/watch?v=${
                            song.id
                        })** [${formatDuration(song.duration)}] • <@${song.requester.id}>`,
                    )
                // embed.addField(
                //     "Bitrate",
                //     player.track.bitrate,
                //     true
                // )
            } else if (song.platform === 'Spotify') {
                if (song.thumbnails[0]) {
                    embed.setDescription(
                        `**${language.PLAY[3]}\n[${song.title}](https://open.spotify.com/track/${song.id})**`,
                    )
                    embed.setThumbnail(song.thumbnails[0].url)
                }
            }
            const msg = await (client.channels.cache.get(player.textChannel.id) as TextChannel)?.send({
                embeds: [embed],
                components: [row],
            })
            player.message = msg
            return msg
        } else {
            const row = new MessageActionRow<ButtonBuilder>().addComponents(
                new MessageButton()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(language.PLAYER['stopMusic'])
                    .setCustomId('stopMusic'),
                new MessageButton()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(language.PLAYER['pauseMusic'])
                    .setCustomId('pauseMusic'),
                new MessageButton()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(language.PLAYER['skipMusic'])
                    .setCustomId('skipMusic'),
                new MessageButton()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(language.PLAYER['queueMusic'])
                    .setCustomId('queueMusic'),
            )
            const embed = new MessageEmbed().setColor(client.settings.color)
            if (song.platform === 'Youtube') {
                embed
                    .setThumbnail(`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`)
                    .setDescription(
                        `${language.PLAYING} **[${song.title}](https://music.youtube.com/watch?v=${
                            song.id
                        })** [${formatDuration(song.duration)}] • <@${song.requester.id}>`,
                    )
                // embed.addField(
                //     "Bitrate",
                //     player.track.bitrate,
                //     true
                // )
            } else if (song.platform === 'Spotify') {
                if (song.thumbnails[0]) {
                    embed.setDescription(
                        `**${language.PLAY[3]}\n[${song.title}](https://open.spotify.com/track/${song.id})**`,
                    )
                    embed.setThumbnail(song.thumbnails[0].url)
                }
            }
            player.message.delete()
            const msg = await player.textChannel.send({
                embeds: [embed],
                components: [row],
            })
            player.message = msg
            return msg
        }

        // const track = player.queue.current;
        // this.emit('trackStart', player, track);
    }

    trackEnd(player: Player, finished: boolean) {
        const track = player.queue.current
        // logger.log(player.queue.length, player.queue.previous)
        if (!track?.duration) track!.duration = player.getDuration()

        if (player.trackRepeat) {
            player.play()
            return this
        }

        if (player.queueRepeat) {
            player.queue.add(player.queue.current)
            player.queue.current = player.queue.shift()
            player.play()
            return this
        }

        if (player.queue.length) {
            player.queue.current = player.queue.shift()
            player.play()
            return this
        }

        if (player.queue.current) {
            player.stop()
            player.playing = false
            this.queueEnd(player)
            return this
        }
        // this.queueEnd(player)
        return this
    }
    async queueEnd(player: Player) {
        // let language = await languageCache.get(player.language)
        const embed = new MessageEmbed()
            .setColor(client.settings.color)
            .setDescription(
                `Ha terminado ` +
                    `**[${player.queue.current?.title}](https://music.youtube.com/watch?v=${
                        player.queue.current?.id
                    })** [${formatDuration(player.queue.current?.duration ?? 0)}] • <@${
                        player.queue.current?.requester.id
                    }>`,
            )
            .setThumbnail(`https://img.youtube.com/vi/${player.queue.current!.id}/maxresdefault.jpg`)
        player.queue.current = null
        player.message?.edit({
            components: [],
            embeds: [embed],
        })
        return await this.destroy(player.guild)
    }

    get(guild: any) {
        return this.players.get(guild.id)
    }

    async destroy(guild: DiscordGuild) {
        return await this.players.get(guild.id)?.destroy()
    }
    shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    async search(query: any, requester: any, source: 'Spotify' | 'Youtube' | 'Soundcloud') {
        let track
        // console.log('requester: ', requester.youtubei)
        if (requester.youtubei) {
            if (requester.youtubei.session.logged_in) {
                let rawData = await (await requester.youtubei.music.search(query, { limit: 1 })).sections[0]
                // console.log('logged in ', rawData)
                track = rawData.contents[0].id
            } else {
                track = await (await yasha.Source.Youtube.search(query))[0]
                console.log('not logged in')
            }
        } else track = await (await yasha.Source.Youtube.search(query))[0]
        console.log('track: ', await track)
        track = await yasha.Source.resolve(`https://www.youtube.com/watch?v=${track.id ? track.id : track}`)

        // console.log('track: ', track)
        try {
            if (!track) logger.debug('No track found')
            else {
                // logger.log('track: ', track)
                // if (track instanceof TrackPlaylist) {
                //     track.forEach((t: any) => {
                //         t.requester = requester;
                //         t.icon = null;
                //         t.thumbnail;
                //     });
                // } else {
                if (track.streams) {
                    // console.log(track.streams)
                    const stream = getMax(track.streams, 'bitrate')
                    track.streams = track.streams.splice(stream, stream)
                }
                track.requester = requester
                track.icon = null
                track.thumbnail
            }
            return track
            // }
        } catch (err: any) {
            throw new Error(err)
        }
    }

    getPlayingPlayers() {
        return this.players.filter((p: any) => p.playing)
    }
}
//TODO: REMOVE ANY TYPES
function getMax(arr: any, prop: any) {
    var max: any
    for (var i = 0; i < arr.length; i++)
        if (arr[i].audio && !arr[i].video && (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))) max = arr[i]

    let best = arr.findIndex((o: any) => o.url === max.url)
    logger.debug('formatting better qualitty for audio: ', best)
    return best
}
export function formatDuration(duration: number) {
    if (isNaN(duration) || typeof duration === 'undefined') return '00:00'
    // if (duration > 3600000000) return language.LIVE
    return formatTime(duration, true)
}
