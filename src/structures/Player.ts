import { Guild, GuildMember, Message, TextChannel, User, VoiceChannel } from 'discord.js'
import yasha from 'yasha'
import Innertube2 from 'youtubei.js'
import logger from '../utils/logger.js'
import MusicManager from './MusicManager.js'
import Queue from './Queue.js'
import { spamIntervalDB } from './spamInterval.js'
const { Innertube } = Innertube2 as any
let spamIntervald = new spamIntervalDB()
type UserExtended = GuildMember & {}

export default class Player extends yasha.TrackPlayer {
    trackRepeat: boolean
    queueRepeat: boolean
    stayInVoice: boolean
    position: number
    playing: boolean
    paused: boolean
    volume: number
    queue: Queue
    manager: MusicManager
    textChannel: TextChannel
    language: string
    voiceChannel: VoiceChannel
    message?: Message
    guild: Guild
    leaveTimeout?: NodeJS.Timeout
    bitrate?: number
    subscription: any
    connection: any
    stayInVc = false
    previouslyPaused = false
    pausedUser?: User
    resumedUser?: User
    youtubei = Innertube.create()
    waitingMessage: Message | null = null
    constructor(options: any) {
        super({
            external_packet_send: false,
            external_encrypt: true,
            normalize_volume: true,
        })
        // this.youtubei = Innertube2.create()
        this.manager = options.musicManager
        this.trackRepeat = false

        this.queueRepeat = false
        this.language = options.lang

        this.stayInVoice = false

        this.queue = new Queue()

        this.bitrate = options.bitrate

        this.position = 0
        this.playing = false
        this.paused = false
        this.volume = options.volume

        this.voiceChannel = options.voiceChannel
        this.textChannel = options.textChannel
        this.guild = options.guild

        this.leaveTimeout = undefined
    }
    async connect() {
        this.connection = await yasha.VoiceConnection.connect(this.voiceChannel, {
            selfDeaf: true,
        })
        this.subscription = this.connection.subscribe(this)
        this.connection.on('error', (error: Error) => logger.error(error))
    }

    disconnect() {
        this.connection.disconnect()
        if (this.connection) this.connection.destroy()
    }

    override async play(track?: any) {
        //TODO: Check if this code works
        if (!track) super.play(this.queue.current)
        else super.play(track)
        clearTimeout(this.leaveTimeout)
        this.leaveTimeout = undefined
        // //NORMALIZE VOLUME
        // console.log("stream: ", this.stream)
        // if (this.stream.volume && !this.volume) this.volume = this.stream.volume;
        if (!this.volume) this.volume = 100;
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

    get(key: any): any {
        // @ts-ignore
        return this[key] as any
    }

    set(key: any, value: any) {
        // @ts-ignore
        this[key] = value
    }
    override setEqualizer(equalizer: any) {
        super.setEqualizer(equalizer)
    }

    override setVolume(volume: any) {
        if (volume > 100000) volume = 100000
        super.setVolume(volume / 100)
    }

    override getTime() {
        if (!this.player) return null
        return super.getTime()
    }

    setTrackRepeat(repeat: boolean) {
        if (repeat) {
            this.trackRepeat = true
            this.queueRepeat = false
        } else this.trackRepeat = false

        return this
    }

    setQueueRepeat(repeat: boolean) {
        if (repeat) {
            this.trackRepeat = false
            this.queueRepeat = true
        } else this.queueRepeat = false

        return this
    }

    pause(pause: boolean) {
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
