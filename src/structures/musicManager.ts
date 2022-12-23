import { lastEventId } from '@sentry/node';
import {
    AnonymousGuild,
    AnyChannel,
    MessageEmbed,
    MessageButton,
    MessageActionRow,
    Channel,
    Guild,
    GuildChannel,
    VoiceChannel,
    TextChannel,
    GuildMember,
    Collection,
} from 'discord.js';
import { TrackPlaylist, Source, VoiceConnection } from 'yasha'
import EventEmitter from 'events';
import Client from './client';
import Player from './player'
import Logger from '../utils/console';
import { GuildTextChannelType } from 'discord-api-types/v10';


export default class musicManager extends EventEmitter {
    players: Collection<unknown, unknown>;
    logger: Logger;
    client: Client;
    constructor(client: Client) {
        super()
        this.players = new Collection();
        this.logger = new Logger(
            {
                displayTimestamp: true,
                displayDate: true,

            },
            client, //testear si funciona el Cluster X
        );
        this.client = client;
    }
    async createNewPlayer(vc: VoiceChannel, textChannel: TextChannel, guild: Guild, volume: number) {
        const player = new Player({
            musicManager: this,
            guild,
            voiceChannel: vc,
            textChannel,
            volume
        })
        this.players.set(guild.id, player);
        player.on('ready', () => {
            // client.logger.log("Evento Ready Ejecutado")
            this.trackStart(player);
        });

        player.on('finish', () => {
            this.trackEnd(player, true)
        });
        // player.on('packet', (buffer: Buffer, frame_size: number) => {
        //     console.log(`Packet: ${frame_size} samples`);
        // });

        player.on(VoiceConnection.Status.Destroyed, () => {
            if (player) player.destroy(true);
        });

        player.on('error', (err: any) => {
            this.logger.error(`${err}`);
            player.skip();
        });

        return player;
    }
    trackStart(player: any) {
        player.playing = true;
        player.paused = false;
        let song = player.queue.current

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle("DANGER")
                .setLabel(this.client.language.PLAYER["stopMusic"])
                .setCustomId("stopMusic"),
            new MessageButton()
                .setStyle("SECONDARY")
                .setLabel(this.client.language.PLAYER["pauseMusic"])
                .setCustomId("pauseMusic"),
            new MessageButton()
                .setStyle("PRIMARY")
                .setLabel(this.client.language.PLAYER["skipMusic"])
                .setCustomId("skipMusic"),
            new MessageButton()
                .setStyle("PRIMARY")
                .setLabel(this.client.language.PLAYER["queueMusic"])
                .setCustomId("queueMusic")
        );

        const embed = new MessageEmbed()
            .setColor("GREEN")
        if (song.source === 'Youtube') {
            embed.setThumbnail(
                `https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`
            )
            embed.setDescription(
                `**${this.client.language.PLAY[3]}\n[${song.title}](https://www.youtube.com/watch?v=${song.id})**`
            )
            // embed.addField(
            //     "Bitrate",
            //     player.track.bitrate,
            //     true
            // )
        } else if (song.source === 'Spotify') {
            if (song.thumbnails[0])
                embed.setDescription(
                    `**${this.client.language.PLAY[3]}\n[${song.title}](https://open.spotify.com/track/${song.id})**`
                )
            embed.setThumbnail(song.thumbnails[0].url)

        }
        return (this.client.channels.cache.get(player.textChannel.id) as TextChannel)?.send({ embeds: [embed], components: [row] })

        // const track = player.queue.current;
        // this.emit('trackStart', player, track);
    }

    trackEnd(player: any, finished: boolean) {
        const track = player.queue.current;
        if (!track.duration) track.duration = player.getDuration();

        if (track && player.trackRepeat) {
            player.play();
            return;
        }

        if (track && player.queueRepeat) {
            player.queue.add(player.queue.current);
            player.queue.current = player.queue.shift();
            player.play();
            return;
        }

        if (player.queue.length > 0) {
            player.queue.current = player.queue.shift();
            player.play();
            return;
        }

        if (!player.queue.length && player.queue.current) {
            player.stop();
            player.queue.current = null;
            player.playing = false;
            return;
        }
        if (!player.queue.length && !player.queue.current) {
            player.destroy();
            return;
        }
    }

    get(guild: any) {
        return this.players.get(guild.id);
    }

    destroy(guild: any) {
        this.players.delete(guild.id);
    }

    async search(query: any, requester: any, source: "Spotify" | "Youtube" | "Soundcloud") {
        let track;
        switch (source) {
            case 'Soundcloud':
                track = (await Source.Soundcloud.search(query))[0];
                break;
            case 'Spotify':
                track = (await Source.Spotify.search(query))[0];
                break;
            case 'Youtube':
                track = (await Source.Youtube.search(query))[0];
                break;
            default:
                track = await Source.resolve(query);
                break;
        }

        try {

            if (!track) console.log("No track found")
            else {
                console.log("track: ", track)
                // if (track instanceof TrackPlaylist) {
                //     track.forEach((t: any) => {
                //         t.requester = requester;
                //         t.icon = null;
                //         t.thumbnail;
                //     });
                // } else {
                if (track.streams) {
                    const stream = getMax(track.streams, "bitrate")
                    track.streams = track.streams.splice(stream, stream)
                }
                track.requester = requester;
                track.icon = null;
                track.thumbnail
            }
            return track;
            // }
        }
        catch (err: any) {
            throw new Error(err);
        }
    }

    getPlayingPlayers() {
        return this.players.filter((p: any) => p.playing);
    }
}

function getMax(arr: any, prop: any) {
    var max: any
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].audio && !arr[i].video) {
            if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
                max = arr[i];
        }
    }
    var arrposition = arr.findIndex((o: any) => o.url === max.url)
    return arrposition;
}