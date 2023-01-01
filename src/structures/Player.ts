import { Guild, Message, TextChannel, VoiceChannel } from 'discord.js'
// TODO: When the types are resolved, change this to  { TrackPlayer, VoiceConnection } from 'yasha'
import yasha from 'yasha'
import logger from '../utils/logger.js'
import MusicManager from './MusicManager.js'
import Queue from './Queue.js'

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
    // TODO: remove this when the types are resolved
    //yasha
    player: any
    subscription: any
    connection: any
    stayInVc: any
    previouslyPaused: any
    constructor(options: any) {
        super({
            external_packet_send: true,
            external_encrypt: true,
            normalize_volume: false,
        })

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
        this.volume = options.volume ? options.volume : 100

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
        if (this.connection) this.connection.destroy()
    }

    play(track?: any) {
        if (!track) super.play(this.queue.current)
        else super.play(track)
        clearTimeout(this.leaveTimeout)
        this.leaveTimeout = undefined
        this.start()
    }
    stop() {
        logger.debug('stopping player')
        this.manager.trackEnd(this, true)
    }
    async softDestroy(force: boolean) {
        try {
            if (this.stayInVoice && !force) return

            if (this.message) await this.message.edit({ components: [] }).catch(() => null)

            if (this.connection) this.disconnect()
            if (this.player) super.destroy()

            this.manager.players.delete(this.guild.id)
        } catch (e) {
            logger.error(e)
        }
    }

    async destroy(force: boolean) {
        super.destroy()

        await this.softDestroy(force).catch(logger.error)
    }

    skip() {
        this.manager.trackEnd(this, false)
    }

    get(key: any) {
        return this[key]
    }

    set(key: any, value: any) {
        this[key] = value
    }
    setEqualizer(equalizer: any) {
        super.setEqualizer(equalizer)
    }

    setVolume(volume: any) {
        if (volume > 100000) volume = 100000
        super.setVolume(volume / 100)
    }

    setBitrate(bitrate: number) {
        super.setBitrate(bitrate)
    }

    setRate(rate: any) {
        super.setRate(rate)
    }

    getTime() {
        if (!this.player) return null
        return super.getTime()
    }

    getDuration() {
        return super.getDuration()
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

    seek(time: number) {
        if (!this.queue.current) return

        //set timer in the player too
        super.seek(Number(time))
    }
}
