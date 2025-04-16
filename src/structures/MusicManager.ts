// @ts-nocheck
import Translator, { keys } from '#utils/Translator.js'
import formatTime from '#utils/formatTime.js'
import logger from '#utils/logger.js'
import {
    APIEmbed,
    APIMessageComponentEmoji,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    Collection,
    Colors,
    ComponentType,
    Guild,
    GuildMember,
    Message,
    User,
    VoiceChannel,
} from 'discord.js'
import EventEmitter from 'events'
import yasha from 'yasha'
import { Innertube } from 'youtubei.js'
import client from '../bot.js'
import Player from './Player.js'
import { SpamIntervalDB } from './spamInterval.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
const spamIntervald = new SpamIntervalDB()
type UserExtended = GuildMember & {}
type YoutubeInjecter<T> = T & { youtubei?: Innertube }
type RequesterInjecter<T> = T & { requester: User }

export default class MusicManager extends EventEmitter {
    players = new Collection<string, Player>()
    spamInterval = spamIntervald
    youtubei = Innertube.create()
    youtubeCodes = new Collection<string, UserExtended>()

    private async sendSpamMSG (user: UserExtended, player: Player) {
        await player.youtubei.session.signIn(undefined)
        // if (!this.spamInterval.checkUser(user.id)) {

        //     this.spamInterval.addUser(user.id, 30 * 60 * 1000);
        // } else return
    }

    async createNewPlayer (vc: VoiceChannel, textChannelId: string, volume?: number) {
        const player = new Player({
            musicManager: this,
            voiceChannel: vc,
            textChannelId,
            volume,
            innertube: await Innertube.create(),
        })
        this.players.set(vc.guild.id, player)
        player.on('ready', async () => await this.trackStart(player))
        player.on('finish', () => this.trackEnd(player, true))
        // TODO: FIX
        // player.on(yasha.VoiceConnection.Status.Destroyed, async () => await player.destroy())
        player.on('error', err => {
            client.errorHandler.captureException(err)
            logger.error(err)
            player.skip()
            player.play()
        })

        return player
    }

    async trackPause (player: Player, interaction: ChatInputCommandInteraction<'cached'> | ButtonInteraction): Promise<false | Message<boolean>> {
        // Return false in case the player is not playing || paused || there is no message
        const translate = Translator(interaction)
        if (!player.queue.current) return false
        player.playing ? player.pause() : player.pause(false)
        type Writeable<T extends { [x: string]: any }, K extends string> = {
            [P in K]: T[P];
        }
        const prevDesc = player.message?.embeds[0].description?.split('\n')[0]
        const newDesc = `${prevDesc}\n\n${translate(keys.stop[player.paused ? 'paused' : 'resumed'], { user: interaction.user.toString() })}`
        const updatedEmbed: APIEmbed = {
            ...player.message?.embeds[0], // Spread the existing embed properties
            description: newDesc,
        }
        const updatedEmbed2 = new EmbedBuilder(updatedEmbed)
            .setImage(player.message?.embeds[0].data.image?.url ?? null)
            .setColor(player.message?.embeds[0].data.color ?? null)
        if (player.message?.components) {
            const actionRowComponents = player.message.components[0]?.components
            if (actionRowComponents) {
                const pauseButton = actionRowComponents.find((c) => c.customId === 'pauseMusic' && c.type === ComponentType.Button)
                if (pauseButton && pauseButton.type === 2) // Make sure it's a button component
                    if (player.playing)
                         // @ts-expect-error
                        (pauseButton.data.emoji as Writeable<APIMessageComponentEmoji, keyof APIMessageComponentEmoji>) = {
                            name: client.settings.emojis.white.pause.name.toString(),
                            id: client.settings.emojis.white.pause.id.toString(),
                             // @ts-expect-error
                            animated: pauseButton.data.emoji?.animated,
                        }
                    else
                     // @ts-expect-error
                        (pauseButton.data.emoji as Writeable<APIMessageComponentEmoji, keyof APIMessageComponentEmoji>) = {
                            name: client.settings.emojis.white.play.name.toString(),
                            id: client.settings.emojis.white.play.id.toString(),
                             // @ts-expect-error
                            animated: pauseButton.data.emoji?.animated,
                        }
            }
        }
        if (player.message) return await player.message.edit({ components: player.message.components, embeds: [updatedEmbed2] })
        else return false
    }

    async trackStart (player: Player): Promise<void> {
        // TODO: Check if the song limit is the saçme as stablished for the admins
        // if(player.queue.current?.duration > player.guild.)

        const equalizerSettings = [
            { band: 32, gain: 0 }, // Baja frecuencia
            { band: 64, gain: 1 }, // Frecuencia baja-mid
            { band: 125, gain: 2 }, // Frecuencia mid
            { band: 250, gain: 3 }, // Frecuencia mid-high
            { band: 500, gain: 1 }, // Frecuencia mid-high
            { band: 1000, gain: 0 }, // Frecuencia media central
            { band: 2000, gain: -1 }, // Frecuencia mid-high
            { band: 4000, gain: -2 }, // Frecuencia mid-high
            { band: 8000, gain: -3 }, // Frecuencia high
            { band: 16000, gain: -4 }, // Frecuencia muy alta
        ]
        player.setEqualizer(equalizerSettings)
        player.playing = true
        player.paused = false
        const song = player.queue.current
        if (!song) return
        const translate = Translator(player.guild)
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            /* new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('likeMusic').setEmoji('<:grey_heart:1133326993694392401>'), */ // TODO: Change to blue if user already liked music
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('shuffleMusic')
                .setEmoji(`${client.settings.emojis.white.shuffle.full}`),
            /* new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('previousMusic').setEmoji('<:grey_previous:1133320744089178132>'), */
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('pauseMusic')
                .setEmoji(`${client.settings.emojis.white.pause.full}`),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('nextMusic')
                .setEmoji(`${client.settings.emojis.white.next.full}`),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('repeatMusic')
                .setEmoji(`${client.settings.emojis.white.repeat_off.full}`),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('queueMusic')
                .setEmoji(`${client.settings.emojis.white.library.full}`),
        )

        const embed = new EmbedBuilder()
            .setColor(client.settings.color)
        if (song.platform === 'Youtube')
            embed
                .setImage(song.thumbnails?.[0].url ?? null)
                .setDescription(
                    `${translate(keys.PLAYING)} **[${song.title}](https://music.youtube.com/watch?v=${
                        song.id
                    })** [${formatDuration(song.duration ?? 0)}] • ${song.requester.toString()}`,
                )
        else if (song.platform === 'Spotify')
            if (song.thumbnails?.[0]) {
                embed.setDescription(
                    `**${translate(keys.PLAYING)}\n[${song.title}](https://open.spotify.com/track/${song.id})**`,
                )
                embed.setImage(song.thumbnails[0].url)
            }

        // ^ Si no tenemos un mensaje ya enviado, lo enviamos, y si lo tenemos, borramos el anterior y enviamos uno nuevo <3
        player.message?.delete()
        if (client.settings.debug === 'true')
            logger.music(
                'Playing | ' +
                player.queue.current?.title +
                    ' | ' +
                    player.guild.name +
                    ' | ' +
                    player.queue.current?.requester.displayName,
            )

        try {
            (player.message = await (await player.getTextChannel())?.send({
                embeds: [embed],
                components: [row],
            }))
        } catch (error) {
            client.errorHandler.captureException(error as Error)
            logger.error(error)
        }
    }

    trackEnd (player: Player, finished: boolean) {
        const track = player.queue.current
        // logger.log(player.queue.length, player.queue.previous)
        if (!track) return
        if (!track?.duration) track.duration = player.getDuration()

        if (player.trackRepeat) {
            player.play()
            return this
        }

        if (player.queueRepeat) {
            player.queue.add(track)
            player.queue.current = player.queue.shift() ?? null
            player.play()
            return this
        }

        if (player.queue.length) {
            player.queue.current = player.queue.shift() ?? null
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

    async queueEnd (player: Player) {
        const translate = Translator(player.guild)
        if (player.queue.current) {
            const embed = new EmbedBuilder()
                .setColor(client.settings.color)
                .setDescription(
                    'Ha terminado ' +
                    `**[${player.queue.current.title}](https://music.youtube.com/watch?v=${
                        player.queue.current.id
                    })** [${formatDuration(player.queue.current.duration ?? 0)}] • <@${
                        player.queue.current?.requester.id
                    }>`,
                )
                .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.id}/maxresdefault.jpg`)
            player.message?.edit({
                components: [],
                embeds: [embed],
            })
        }
        try {
            if (!player.stayInVc) return await this.destroy(player.guild)
        } catch (error) {
            client.errorHandler.captureException(error as Error)
        }
        const playlist = await player.youtubei.music.getUpNext(player.queue.current?.id ?? '', true)
        this.ejecutarAccionesEnParalelo(playlist.contents, 5, player).then(() => {
            player.skip()
            player.play()
        }).catch((err) => client.errorHandler.captureException(err))
        const e = new EmbedBuilder()
            .setTitle(translate(keys.automix.generated))
            .setColor(Colors.Green)
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
                    value: `${player.queue.current?.requester}`,
                    inline: true,
                },
            )
            .setThumbnail(`https://img.youtube.com/vi/${player.queue.current?.id}/maxresdefault.jpg`)
        try {
            await (await player.getTextChannel())?.send({
                embeds: [e],
                content: '',
            })
        } catch (error) {
            client.errorHandler.captureException(error as Error)
            this.destroy(player.guild)
        }
    }

    async ejecutarAccionesEnParalelo (contents: any[], maxVeces: number, player: Player): Promise<void> {
        const cantidadEjecuciones = Math.min(maxVeces, contents.length)
        const promesas: Array<Promise<void>> = []

        for (let i = 0; i < cantidadEjecuciones; i++) {
            const indiceAleatorio = Math.floor(Math.random() * contents.length)
            const elementoAleatorio = contents[indiceAleatorio]
            promesas.push(this.ejecutarAccion(elementoAleatorio, player)) // Llamada a tu función de acción
        }

        await Promise.all(promesas)
    }

    async ejecutarAccion (elemento: any, player: Player) {
        // Lógica de tu acción
        const track = await client.music.search(elemento.video_id, client.user, 'Youtube')
        if (!track) return
        player.queue.add(track)
    }

    get (guild: Guild) {
        return this.players.get(guild.id)
    }

    async destroy (guild: Guild) {
        return await this.players.get(guild.id)?.destroy()
    }

    shuffleArray (array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    async search (query: any, requester: YoutubeInjecter<User>, source: 'Spotify' | 'Youtube' | 'Soundcloud'): Promise<RequesterInjecter<any> | undefined> {
        // let track
        // if (requester.youtubei)
        //     if (requester.youtubei.session.logged_in) {
        //         const rawData = (await requester.youtubei.music.search(query)).contents?.[0]
        //         track = rawData?.contents?.[0]?.id
        //     } else {
        //         (await requester.youtubei)
        //         track = await (await yasha.Source.Youtube.search(query))[0]
        //     }
        // else track = await (await yasha.Source.Youtube.search(query))[0]

        try {
            let track = await yasha.Source.resolve(query)
            if (!track) {
                 // @ts-expect-error
                const search = await yasha.Source.Youtube.search(query)
                if (!search.length) {
                    logger.debug(query, 'No se encontró nada')
                    return undefined
                }
                const tracks = search.filter(t => t.platform === 'Youtube')
                if (!tracks.length) return undefined
                // @ts-expect-error
                track = tracks[0]
            }
            if (track?.platform !== 'Youtube') return undefined
            // if (track instanceof TrackPlaylist) {
            //     track.forEach(t => {
            //         t.requester = requester;
            //         t.icon = null;
            //         t.thumbnail;
            //     });
            // } else {
            /* if (track.streams) {
                    // console.log(track.streams)
                    const stream = getMax(track.streams, 'bitrate')
                    track.streams = [stream.object]
                } */
            // todo: fix
            // track.requester = requester
            return track
            // }
        } catch (error) {
            if ([
                'Video is age restricted',
                'Playlist not found',
                'This video is not available',
            ].includes((error as Error).message))
                throw new Error((error as Error).message)
            client.errorHandler.captureException(error as Error)
        }
        return undefined
    }

    getPlayingPlayers () {
        return this.players.filter(p => p.playing)
    }
}

export function formatDuration (duration: number) {
    if (isNaN(duration) || typeof duration === 'undefined') return '00:00'
    // if (duration > 3600000000) return language.LIVE
    return formatTime(duration, true)
}
