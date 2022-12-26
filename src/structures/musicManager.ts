import { Collection, Guild, MessageActionRow, MessageButton, MessageEmbed, TextChannel, VoiceChannel } from 'discord.js'
import EventEmitter from 'events'
import { Source, VoiceConnection } from 'yasha'
import formatTime from '../utils/formatTime'
import Logger from '../utils/logger'
import Client from './Client'
import Player from './player'

export default class musicManager extends EventEmitter {
    players: Collection<string, Player>
    logger: Logger
    client: Client
    constructor(client: Client) {
        super()
        this.players = new Collection()
        this.logger = new Logger(
            {
                displayTimestamp: true,
                displayDate: true,
            },
            client, //testear si funciona el Cluster X
        )
        this.client = client
    }
    async createNewPlayer(vc: VoiceChannel, textChannel: TextChannel, guild: Guild, volume: number) {
        const player = new Player({
            musicManager: this,
            guild,
            voiceChannel: vc,
            textChannel,
            volume,
        })
        this.players.set(guild.id, player)
        player.on('ready', () => {
            // logger.log("Evento Ready Ejecutado")
            this.trackStart(player)
        })

        player.on('finish', () => {
            this.trackEnd(player, true)
        })
        // player.on('packet', (buffer: Buffer, frame_size: number) => {
        //     console.log(`Packet: ${frame_size} samples`);
        // });

        player.on(VoiceConnection.Status.Destroyed, () => {
            if (player) player.destroy(true)
        })

        player.on('error', (err: any) => {
            this.logger.error(`${err}`)
            player.skip()
        })

        return player
    }
    async trackStart(player: Player) {
        player.playing = true
        player.paused = false
        let song = player.queue.current!

        // ^ Si no tenemos un mensaje ya enviado, lo enviamos, y si lo tenemos, borramos el anterior y enviamos uno nuevo <3
        if (!player.message) {
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setStyle('DANGER')
                    .setLabel(this.client.language.PLAYER['stopMusic'])
                    .setCustomId('stopMusic'),
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setLabel(this.client.language.PLAYER['pauseMusic'])
                    .setCustomId('pauseMusic'),
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel(this.client.language.PLAYER['skipMusic'])
                    .setCustomId('skipMusic'),
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel(this.client.language.PLAYER['queueMusic'])
                    .setCustomId('queueMusic'),
            )

            const embed = new MessageEmbed().setColor('GREEN')
            if (song.platform === 'Youtube') {
                embed
                    .setThumbnail(`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`)
                    .setDescription(
                        `${this.client.language.PLAYING} **[${song.title}](https://music.youtube.com/watch?v=${
                            song.id
                        })** [${formatDuration(this.client, song.duration)}] • <@${song.requester.user.id}>`,
                    )
                // embed.addField(
                //     "Bitrate",
                //     player.track.bitrate,
                //     true
                // )
            } else if (song.platform === 'Spotify') {
                if (song.thumbnails[0])
                    embed.setDescription(
                        `**${this.client.language.PLAY[3]}\n[${song.title}](https://open.spotify.com/track/${song.id})**`,
                    )
                embed.setThumbnail(song.thumbnails[0].url)
            }
            const msg = await (this.client.channels.cache.get(player.textChannel.id) as TextChannel)?.send({
                embeds: [embed],
                components: [row],
            })
            player.message = msg
            return msg
        } else {
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setStyle('DANGER')
                    .setLabel(this.client.language.PLAYER['stopMusic'])
                    .setCustomId('stopMusic'),
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setLabel(this.client.language.PLAYER['pauseMusic'])
                    .setCustomId('pauseMusic'),
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel(this.client.language.PLAYER['skipMusic'])
                    .setCustomId('skipMusic'),
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel(this.client.language.PLAYER['queueMusic'])
                    .setCustomId('queueMusic'),
            )

            const embed = new MessageEmbed().setColor('GREEN')
            if (song.platform === 'Youtube') {
                embed
                    .setThumbnail(`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`)
                    .setDescription(
                        `${this.client.language.PLAYING} **[${song.title}](https://music.youtube.com/watch?v=${
                            song.id
                        })** [${formatDuration(this.client, song.duration)}] • <@${song.requester.user.id}>`,
                    )
                // embed.addField(
                //     "Bitrate",
                //     player.track.bitrate,
                //     true
                // )
            } else if (song.platform === 'Spotify') {
                if (song.thumbnails[0])
                    embed.setDescription(
                        `**${this.client.language.PLAY[3]}\n[${song.title}](https://open.spotify.com/track/${song.id})**`,
                    )
                embed.setThumbnail(song.thumbnails[0].url)
            }
            player.message.delete()
            const msg = await (this.client.channels.cache.get(player.textChannel.id) as TextChannel)?.send({
                embeds: [embed],
                components: [row],
            })
            player.message = msg
            return msg
        }

        // const track = player.queue.current;
        // this.emit('trackStart', player, track);
    }

    trackEnd(player: any, finished: boolean) {
        const track = player.queue.current
        this.logger.log(player.queue.length, player.queue.previous)
        if (!track.duration) track.duration = player.getDuration()

        if (track && player.trackRepeat) {
            player.play()
            return
        }

        if (track && player.queueRepeat) {
            player.queue.add(player.queue.current)
            player.queue.current = player.queue.shift()
            player.play()
            return
        }

        if (player.queue.length > 0) {
            player.queue.current = player.queue.shift()
            player.play()
            return
        }

        if (player.queue.length === 0 && player.queue.current) {
            player.stop()
            player.playing = false
            this.queueEnd(player)
            return
        }
        if (!player.queue.length && !player.queue.current) {
            this.queueEnd(player)
            return
        }
    }
    queueEnd(player: Player) {
        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription(
                `Ha terminado ` +
                    `**[${player.queue.current!.title}](https://music.youtube.com/watch?v=${
                        player.queue.current!.id
                    })** [${formatDuration(this.client, player.queue.current!.duration)}] • <@${
                        player.queue.current!.requester.user.id
                    }>`,
            )
            .setThumbnail(`https://img.youtube.com/vi/${player.queue.current!.id}/maxresdefault.jpg`)
        player.queue.current = null
        player.message?.edit({
            components: [],
            embeds: [embed],
        })
    }

    get(guild: any) {
        return this.players.get(guild.id)
    }

    destroy(guild: any) {
        this.players.delete(guild.id)
    }

    async search(query: any, requester: any, source: 'Spotify' | 'Youtube' | 'Soundcloud') {
        let track
        switch (source) {
            case 'Soundcloud':
                track = (await Source.Soundcloud.search(query))[0]
                break
            case 'Spotify':
                track = (await Source.Spotify.search(query))[0]
                break
            case 'Youtube':
                track = (await Source.Youtube.search(query))[0]
                break
            default:
                track = await Source.resolve(query)
                break
        }

        try {
            if (!track) console.log('No track found')
            else {
                console.log('track: ', track)
                // if (track instanceof TrackPlaylist) {
                //     track.forEach((t: any) => {
                //         t.requester = requester;
                //         t.icon = null;
                //         t.thumbnail;
                //     });
                // } else {
                if (track.streams) {
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

function getMax(arr: any, prop: any) {
    var max: any
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].audio && !arr[i].video) {
            if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop])) max = arr[i]
        }
    }
    var arrposition = arr.findIndex((o: any) => o.url === max.url)
    return arrposition
}
function formatDuration(client: Client, duration: number) {
    if (isNaN(duration) || typeof duration === 'undefined') return '00:00'
    if (duration > 3600000000) return client.language.LIVE
    return formatTime(duration, true)
}
