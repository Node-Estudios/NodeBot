import { ButtonBuilder, ButtonStyle, Collection, Guild as DiscordGuild, Guild, ActionRowBuilder as MessageActionRow, ButtonBuilder as MessageButton, EmbedBuilder as MessageEmbed, TextChannel, VoiceChannel } from 'discord.js';
import EventEmitter from 'events';
// TODO: When types are finished, change the yasha import to { Source, VoiceConnection } from 'yasha'
import yasha from 'yasha';
import formatTime from '../utils/formatTime.js';
import logger from '../utils/logger.js';
import Player from './Player.js';
// ? use client for lang
import client from '../bot.js';
import languageCache from '../cache/idioms.js';
import retrieveUserLang from '../utils/db/retrieveUserLang.js';

export default class MusicManager extends EventEmitter {
    players = new Collection<string, Player>()

    constructor() {
        super()
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
        this.players.set(guild.id, player)
        player.on('ready', () => this.trackStart(player))

        player.on('finish', () => this.trackEnd(player, true))
        // player.on('packet', (buffer: Buffer, frame_size: number) => {
        //     console.log(`Packet: ${frame_size} samples`);
        // });

        player.on(yasha.VoiceConnection.Status.Destroyed, () => player.destroy(true))

        player.on('error', (err: any) => {
            logger.error(err)
            player.skip()
        })

        return player
    }
    async trackStart(player: Player) {
        player.playing = true
        player.paused = false
        let song = player.queue.current!
        player.language = await retrieveUserLang(player.queue.current!.requester.user.id) // es_ES // en_US
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
            if (song.platform === 'Youtube') {
                embed
                    .setThumbnail(`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`)
                    .setDescription(
                        `${language.PLAYING} **[${song.title}](https://music.youtube.com/watch?v=${song.id
                        })** [${formatDuration(song.duration)}] • <@${song.requester.user.id}>`,
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
                        `${language.PLAYING} **[${song.title}](https://music.youtube.com/watch?v=${song.id
                        })** [${formatDuration(song.duration)}] • <@${song.requester.user.id}>`,
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
        let language = await languageCache.get(player.language)
        const embed = new MessageEmbed()
            .setColor(client.settings.color)
            .setDescription(
                `Ha terminado ` +
                `**[${player.queue.current?.title}](https://music.youtube.com/watch?v=${player.queue.current?.id
                })** [${formatDuration(player.queue.current?.duration ?? 0)}] • <@${player.queue.current?.requester.user.id
                }>`,
            )
            .setThumbnail(`https://img.youtube.com/vi/${player.queue.current!.id}/maxresdefault.jpg`)
        player.queue.current = null
        player.message?.edit({
            components: [],
            embeds: [embed],
        })
        return this.destroy(player.guild)
    }

    get(guild: any) {
        return this.players.get(guild.id)
    }

    destroy(guild: DiscordGuild) {
        this.players.delete(guild.id)
        return this
    }

    async search(query: any, requester: any, source: 'Spotify' | 'Youtube' | 'Soundcloud') {
        // logger.debug('debugging search', await yasha.Source.resolve(await yasha.Source.Youtube.search(query)[0]))
        let track =
            source === 'Spotify'
                ? (await yasha.Source.Spotify.search(query))[0]
                : source === 'Youtube'
                    ? (await yasha.Source.Youtube.search(query))[0]
                    : source === 'Soundcloud'
                        ? (await yasha.Source.Soundcloud.search(query))[0]
                        : await yasha.Source.resolve(query);

        // console.log('resolved: ', await yasha.Source.resolve('https://www.youtube.com/watch?v=' + await yasha.Source.Youtube.search(query)[0].id))
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

    return arr.findIndex((o: any) => o.url === max.url)
}
export function formatDuration(duration: number) {
    if (isNaN(duration) || typeof duration === 'undefined') return '00:00'
    // if (duration > 3600000000) return language.LIVE
    return formatTime(duration, true)
}