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
// Usamos el nombre del paquete que configuramos, 'sange'
import SangePackage from 'sange'
import { EventEmitter } from 'node:events'
import {
    VoiceConnection,
    VoiceConnectionStatus,
    entersState,
    joinVoiceChannel,
} from '@discordjs/voice'
import Translator, { keys } from '#utils/Translator.js'

// La clase Player es un emisor de eventos, no hereda del reproductor nativo
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

    // Contiene la instancia del reproductor nativo
    private sangePlayer: any

    #textChannelId?: Snowflake

    constructor(options: {
        musicManager: MusicManager
        lang?: LocaleString
        bitrate?: number
        volume?: number
        voiceChannel: VoiceChannel
        textChannelId: Snowflake
        guild?: Guild
        innertube: Innertube
    }) {
        super() // Llama al constructor de EventEmitter
        this.youtubei = options.innertube
        this.manager = options.musicManager
        this.bitrate = options.bitrate
        this.volume = options.volume ?? 100
        this.voiceChannel = options.voiceChannel
        this.guild = options.guild ?? options.voiceChannel.guild

        const SangePlayerConstructor =
            (SangePackage as any).default || SangePackage
        this.sangePlayer = new SangePlayerConstructor()

        // El Player escucha los eventos del addon nativo y los re-emite.
        // El MusicManager escuchará estos eventos.
        this.sangePlayer.on('finish', () => {
            this.playing = false
            this.emit('finish')
        })
        this.sangePlayer.on('error', (error: any) => {
            this.playing = false
            logger.error(error)
            this.emit('error', error)
        })

        this.setTextChannel(options.textChannelId)
    }

    private async setTextChannel(id: Snowflake) {
        try {
            const channel = await this.guild.channels.fetch(id)
            if (!channel?.isTextBased()) return
            if (
                this.guild.members.me
                    ?.permissionsIn(channel)
                    .has([
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.SendMessages,
                    ]) === false
            )
                return
            this.#textChannelId = id
        } catch {
            // Silenciar error si el canal no se encuentra
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
            await entersState(
                this.connection,
                VoiceConnectionStatus.Ready,
                30_000,
            )
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

        this.playing = true
        this.sangePlayer.setURL(urlToPlay)
        this.sangePlayer.setOutput(2, 48000, this.bitrate ?? 128000)
        this.sangePlayer.setVolume(this.volume / 100)
        this.sangePlayer.start()

        clearTimeout(this.leaveTimeout)
        this.leaveTimeout = undefined
    }

    destroy() {
        this.disconnect()
        this.sangePlayer.destroy()
        this.manager.players.delete(this.guild.id)
    }

    // CAMBIO: skip() ahora solo detiene la reproducción.
    // Esto disparará el evento 'finish', que será manejado por el MusicManager.
    skip() {
        this.sangePlayer.stop()
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
        this.playing = !pause
        this.paused = pause
        this.sangePlayer.setPaused(pause)
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
