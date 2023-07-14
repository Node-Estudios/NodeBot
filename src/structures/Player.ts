import { Guild, LocaleString, Message, VoiceChannel, User, TextChannel } from 'discord.js'
import VoiceConnection from 'yasha/types/src/VoiceConnection.js'
import { spamIntervalDB } from './spamInterval.js'
import MusicManager from './MusicManager.js'
import logger from '../utils/logger.js'
import { Innertube } from 'youtubei.js'
import Queue from './Queue.js'
import yasha from 'yasha'

let spamIntervald = new spamIntervalDB()

export default class Player extends yasha.TrackPlayer {
    trackRepeat = false
    queueRepeat = false
    stayInVoice = false
    position = 0
    playing = false
    paused = false
    volume = 100
    queue = new Queue()
    manager: MusicManager
    textChannel: TextChannel
    voiceChannel: VoiceChannel
    message?: Message
    guild: Guild
    leaveTimeout?: NodeJS.Timeout
    bitrate?: number
    connection?: VoiceConnection
    subscription?: any
    stayInVc = false
    previouslyPaused = false
    pausedUser?: User
    resumedUser?: User
    youtubei = Innertube.create()
    waitingMessage: Message | null = null
    constructor(options: {
        musicManager: MusicManager
        lang?: LocaleString
        bitrate?: number
        volume?: number
        voiceChannel: VoiceChannel
        textChannel: TextChannel
        guild?: Guild
    }) {
        super({
            external_packet_send: false,
            external_encrypt: true,
            normalize_volume: true,
        })
        this.manager = options.musicManager
        this.bitrate = options.bitrate
        this.volume = options.volume ?? 100

        this.voiceChannel = options.voiceChannel
        this.textChannel = options.textChannel
        this.guild = options.guild ?? options.voiceChannel.guild
    }
    async connect() {
        this.connection = await yasha.VoiceConnection.connect(this.voiceChannel, {
            selfDeaf: true,
        })
        // TODO: Remove ts-ignore when yasha is updated
        // @ts-ignore
        this.subscription = this.connection?.subscribe(this)
        this.connection?.on('error', (error: Error) => logger.error(error))
    }

    disconnect() {
        this.connection?.disconnect()
        if (this.connection) this.connection.destroy()
    }

    override async play(track?: any) {
        //TODO: Check if this code works
        if (!track) super.play(this.queue.current!)
        else super.play(track)
        clearTimeout(this.leaveTimeout)
        this.leaveTimeout = undefined
        // //NORMALIZE VOLUME
        // console.log("stream: ", this.stream)
        // if (this.stream.volume && !this.volume) this.volume = this.stream.volume;
        // console.log("volume: ", this.volume);
        this.start()
    }

    override async destroy() {
        try {
            if (this.connection) this.disconnect()
            if (this.player) super.destroy()

            return this.manager.players.delete(this.guild.id)
        } catch (e) {
            return logger.error(e)
        }
    }

    skip() {
        this.manager.trackEnd(this, false)
    }

    get(key: string): any {
        // @ts-ignore
        return this[key] as any
    }

    set(key: string, value: any) {
        // @ts-ignore
        this[key] = value
    }

    override setEqualizer(equalizer: any) {
        super.setEqualizer(equalizer)
    }

    override setVolume(volume: number) {
        if (volume > 100000) volume = 100000
        super.setVolume(volume / 100)
    }

    override getTime() {
        if (!this.player) return null
        return super.getTime()
    }

    setTrackRepeat(repeat = true) {
        if (repeat) {
            this.trackRepeat = true
            this.queueRepeat = false
        } else this.trackRepeat = false

        return this
    }

    setQueueRepeat(repeat = true) {
        if (repeat) {
            this.trackRepeat = false
            this.queueRepeat = true
        } else this.queueRepeat = false

        return this
    }

    pause(pause = true) {
        if (this.paused === pause || !this.queue.totalSize) return this

        this.playing = !pause
        this.paused = pause

        if (this.player) this.setPaused(pause)

        return this
    }

    override seek(time: number) {
        if (!this.queue.current) return

        //set timer in the player too
        super.seek(Number(time))
    }
}
