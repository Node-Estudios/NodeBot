import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    VoiceChannel,
    TextChannel,
    ButtonStyle,
    GuildMember,
    Collection,
    Guild,
} from 'discord.js'
import Translator, { keys } from '../utils/Translator.js'
import { spamIntervalDB } from './spamInterval.js'
import formatTime from '../utils/formatTime.js'
import logger from '../utils/logger.js'
import EventEmitter from 'events'
import Player from './Player.js'
import client from '../bot.js'
import yasha from 'yasha'
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

    async createNewPlayer(vc: VoiceChannel, textChannel: TextChannel, guild: Guild, volume?: number) {
        const player = new Player({
            musicManager: this,
            voiceChannel: vc,
            textChannel,
            volume,
            lang: vc.guild.preferredLocale,
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

        player.on('error', err => {
            logger.error(err)
            // console.log(err)
            player.skip()
            player.play()
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
        const translate = Translator(player.guild)
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel(translate(keys.STOP)).setCustomId('stopMusic'),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel(translate(keys.PAUSE))
                .setCustomId('pauseMusic'),
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel(translate(keys.SKIP)).setCustomId('skipMusic'),
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel(translate(keys.QUEUE)).setCustomId('queueMusic'),
        )

        const embed = new EmbedBuilder().setColor(client.settings.color)
        if (song.platform === 'Youtube') {
            embed
                .setThumbnail(`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`)
                .setDescription(
                    `${translate(keys.PLAYING)} **[${song.title}](https://music.youtube.com/watch?v=${
                        song.id
                    })** [${formatDuration(song.duration)}] • ${song.requester.toString()}`,
                )
        } else if (song.platform === 'Spotify') {
            if (song.thumbnails[0]) {
                embed.setDescription(
                    `**${translate(keys.PLAYING)}\n[${song.title}](https://open.spotify.com/track/${song.id})**`,
                )
                embed.setThumbnail(song.thumbnails[0].url)
            }
        }
        // ^ Si no tenemos un mensaje ya enviado, lo enviamos, y si lo tenemos, borramos el anterior y enviamos uno nuevo <3
        player.message?.delete()
        if (client.settings.debug == 'true')
            logger.debug(
                'Playing | ' +
                    player.queue.current?.title +
                    ' | ' +
                    player.guild.name +
                    ' | ' +
                    player.queue.current?.requester.displayName,
            )
        const msg = await player.textChannel.send({
            embeds: [embed],
            components: [row],
        })
        player.message = msg
        return msg
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
        return this
    }
    async queueEnd(player: Player) {
        const translate = Translator(player.guild)
        const embed = new EmbedBuilder()
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
        player.message?.edit({
            components: [],
            embeds: [embed],
        })
        if (player.stayInVc) {
            const playlist = await (await player.youtubei)!.music.getUpNext(player.queue.current!.id, true)
            const veces = 6
            async function ejecutarAccionesEnParalelo(contents: any[], maxVeces: number): Promise<void> {
                const cantidadEjecuciones = Math.min(maxVeces, contents.length)
                const promesas: Promise<void>[] = []

                for (let i = 0; i < cantidadEjecuciones; i++) {
                    const indiceAleatorio = Math.floor(Math.random() * contents.length)
                    const elementoAleatorio = contents[indiceAleatorio]
                    promesas.push(ejecutarAccion(elementoAleatorio)) // Llamada a tu función de acción
                }

                await Promise.all(promesas)
            }
            async function ejecutarAccion(elemento: any) {
                // Lógica de tu acción
                const track = await client.music.search(elemento.video_id, client.user, 'Youtube')
                player.queue.add(track)
            }
            ejecutarAccionesEnParalelo(playlist.contents, 5).then(() => {
                player.skip()
                player.play()
            })
            const e = new EmbedBuilder()
                .setTitle(translate(keys.automix.generated))
                .setColor('Green')
                .addFields(
                    {
                        name: translate(keys.TITLE),
                        value: 'a',
                        inline: true,
                    },
                    {
                        name: translate(keys.SONGS),
                        value: '5',
                        inline: true,
                    },
                    {
                        name: translate(keys.REQUESTER),
                        value: player.queue.current!.requester.user.toString(),
                        inline: true,
                    },
                )
                .setThumbnail(`https://img.youtube.com/vi/${player.queue.current?.id}/maxresdefault.jpg`)
            await player.textChannel.send({
                embeds: [e],
                content: '',
            })
        } else {
            return await this.destroy(player.guild)
        }
    }

    get(guild: Guild) {
        return this.players.get(guild.id)
    }

    async destroy(guild: Guild) {
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
        if (requester.youtubei) {
            if (requester.youtubei.session.logged_in) {
                let rawData = await (await requester.youtubei.music.search(query, { limit: 1 })).sections[0]
                track = rawData.contents[0].id
            } else {
                track = await (await yasha.Source.Youtube.search(query))[0]
            }
        } else track = await (await yasha.Source.Youtube.search(query))[0]

        track = await yasha.Source.resolve(
            track ? `https://www.youtube.com/watch?v=${track.id ? track.id : track}` : query,
        )
        try {
            if (!track) logger.debug('No track found')
            else {
                // logger.log('track: ', track)
                // if (track instanceof TrackPlaylist) {
                //     track.forEach(t => {
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
        } catch (err) {
            throw err
        }
    }

    getPlayingPlayers() {
        return this.players.filter(p => p.playing)
    }
}
//TODO: REMOVE ANY TYPES
function getMax(arr: any[], prop: string) {
    let max: any
    for (var i = 0; i < arr.length; i++)
        if (arr[i].audio && !arr[i].video && (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))) max = arr[i]

    let best = arr.findIndex(o => o.url === max.url)
    logger.debug('formatting better qualitty for audio: ', best)
    return best
}

export function formatDuration(duration: number) {
    if (isNaN(duration) || typeof duration === 'undefined') return '00:00'
    // if (duration > 3600000000) return language.LIVE
    return formatTime(duration, true)
}
