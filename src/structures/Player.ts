import {
    Guild,
    LocaleString,
    Message,
    VoiceChannel,
    User,
    Snowflake,
    TextChannel,
    PermissionFlagsBits,
} from 'discord.js'
import MusicManager from './MusicManager.js'
import logger from '#utils/logger.js'
import { Innertube } from 'youtubei.js'
import Queue from './Queue.js'
import * as SangePackage from 'sange'
import { EventEmitter } from 'node:events'
import {
    VoiceConnection,
    VoiceConnectionStatus,
    entersState,
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayer,
    AudioPlayerStatus,
    StreamType,
} from '@discordjs/voice'
import { PassThrough } from 'stream'

export default class Player extends EventEmitter {
    public trackRepeat = false
    public queueRepeat = false
    public stayInVoice = false
    public position = 0
    public playing = false
    public paused = false
    public volume = 100
    public queue = new Queue()
    public manager: MusicManager
    public voiceChannel: VoiceChannel
    public message?: Message
    public guild: Guild
    public leaveTimeout?: NodeJS.Timeout
    public bitrate?: number
    public connection?: VoiceConnection
    public stayInVc = false
    public previouslyPaused = false
    public pausedUser?: User
    public resumedUser?: User
    public youtubei: Innertube
    public waitingMessage?: Message

    private sangePlayer: any
    private audioPlayer: AudioPlayer
    private audioStream: PassThrough | null = null

    #textChannelId?: Snowflake

    constructor(options: {
        musicManager: MusicManager
        lang?: LocaleString
        bitrate?: number
        volume?: number
        voiceChannel: VoiceChannel
        textChannelId: Snowflake
        guild: Guild
        innertube: Innertube
    }) {
        super()
        this.youtubei = options.innertube
        this.manager = options.musicManager
        this.bitrate = options.bitrate
        this.volume = options.volume ?? 100
        this.voiceChannel = options.voiceChannel
        this.guild = options.guild

        let SangePlayerConstructor: any
        if (typeof (SangePackage as any).default === 'function') {
            SangePlayerConstructor = (SangePackage as any).default
        } else if (typeof SangePackage === 'function') {
            SangePlayerConstructor = SangePackage
        } else {
            throw new Error(
                'Could not find a valid SangePlayer constructor in the "sange" package.',
            )
        }

        this.sangePlayer = new SangePlayerConstructor()
        this.audioPlayer = createAudioPlayer()

        this.sangePlayer.on('packet', (packet: { buffer: Buffer }) => {
            this.audioStream?.write(packet.buffer)
        })

        this.sangePlayer.on('finish', () => {
            this.audioStream?.end()
        })

        this.sangePlayer.on('error', (error: any) => {
            this.playing = false
            logger.error(error, 'Error en SangePlayer')
            this.emit('error', error)
        })

        this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            this.playing = false
            this.emit('finish')
        })

        this.audioPlayer.on('error', error => {
            this.playing = false
            logger.error(error, 'Error en AudioPlayer')
            this.emit('error', error)
        })

        this.setTextChannel(options.textChannelId)
    }

    private async setTextChannel(id: Snowflake) {
        try {
            const channel = await this.guild.channels.fetch(id)
            if (!channel?.isTextBased()) return
            if (
                !this.guild.members.me
                    ?.permissionsIn(channel)
                    .has([
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.SendMessages,
                    ])
            )
                return
            this.#textChannelId = id
        } catch {
            // Silenciar
        }
    }

    async connect() {
        if (this.connection) return

        this.connection = joinVoiceChannel({
            channelId: this.voiceChannel.id,
            guildId: this.guild.id,
            adapterCreator: this.guild.voiceAdapterCreator,
            selfDeaf: true,
        })

        try {
            // --- CORRECCIÓN AQUÍ ---
            // Se ha corregido el valor de 30_0G00 a 30_000
            await entersState(
                this.connection,
                VoiceConnectionStatus.Ready,
                30_000,
            )
            this.connection.subscribe(this.audioPlayer)
        } catch (error) {
            this.connection.destroy()
            this.connection = undefined
            throw new Error('Could not connect to voice channel')
        }
    }

    disconnect() {
        this.connection?.destroy()
        this.connection = undefined
    }

    async play(trackUrl?: string) {
        const urlToPlay = trackUrl || this.queue.current?.url
        if (!urlToPlay) {
            this.playing = false
            return
        }

        try {
            this.playing = true
            this.paused = false

            this.audioStream = new PassThrough()

            const resource = createAudioResource(this.audioStream, {
                inputType: StreamType.Opus,
            })

            this.audioPlayer.play(resource)

            this.sangePlayer.setURL(urlToPlay)
            this.sangePlayer.setOutput(2, 48000, this.bitrate ?? 128000)
            this.sangePlayer.setVolume(this.volume / 100)
            this.sangePlayer.start()

            clearTimeout(this.leaveTimeout)
            this.leaveTimeout = undefined
        } catch (e) {
            logger.error(e, 'Error during play')
            this.emit('error', e)
        }
    }

    destroy() {
        this.disconnect()
        this.audioPlayer.stop(true)
        this.sangePlayer.destroy()
        this.manager.players.delete(this.guild.id)
    }

    skip() {
        this.audioPlayer.stop()
    }

    setEqualizer(equalizer: any) {
        this.sangePlayer.setEqualizer(equalizer)
    }

    setVolume(volume: number) {
        if (volume > 1000) volume = 1000
        this.volume = volume
        this.sangePlayer.setVolume(volume / 100)
    }

    setTrackRepeat(repeat = true) {
        this.trackRepeat = repeat
        if (repeat) this.queueRepeat = false
        return this
    }

    setQueueRepeat(repeat = true) {
        this.queueRepeat = repeat
        if (repeat) this.trackRepeat = false
        return this
    }

    pause(pause = true) {
        if (this.paused === pause) return this

        this.paused = pause
        if (pause) {
            this.audioPlayer.pause()
        } else {
            this.audioPlayer.unpause()
        }
        this.playing = !pause

        return this
    }

    seek(time: number) {
        if (!this.queue.current) return
        this.sangePlayer.seek(time)
    }

    async getTextChannel(): Promise<TextChannel | null> {
        if (!this.#textChannelId) return null
        const channel = await this.guild.channels.fetch(this.#textChannelId)
        if (!channel?.isTextBased()) return null
        return channel as TextChannel
    }

    set textChannelId(id: Snowflake) {
        this.setTextChannel(id)
    }

    get textChannelId(): string | undefined {
        return this.#textChannelId
    }
}
