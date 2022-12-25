import { Guild, Message, TextChannel, VoiceChannel } from 'discord.js'
import { TrackPlayer, VoiceConnection } from 'yasha'
import Queue from '../utils/music/queue'
import musicManager from './musicManager'

export default class Player extends TrackPlayer {
    trackRepeat: boolean
    queueRepeat: boolean
    stayInVoice: boolean
    position: number
    playing: boolean
    paused: boolean
    volume: number
    queue: Queue
    manager: musicManager
    textChannel: TextChannel
    voiceChannel: VoiceChannel
    message: Message | null
    guild: Guild
    leaveTimeout: any
    connection: any
    bitrate: number | null
    subscription: any
    player: any
    constructor(options: any) {
        super({ external_packet_send: true, external_encrypt: true })

        this.manager = options.musicManager
        this.trackRepeat = false
        this.queueRepeat = false

        this.stayInVoice = false

        this.queue = new Queue()
        this.message = null

        this.bitrate = options.bitrate

        this.position = 0
        this.playing = false
        this.paused = false
        this.volume = options.volume ? options.volume : 100

        /*        if (this.music.players.has(options.guild.id)) {
                    return this.music.players.get(options.guild.id);
                }*/

        this.voiceChannel = options.voiceChannel
        this.textChannel = options.textChannel
        this.guild = options.guild

        this.leaveTimeout = null
    }
    async connect() {
        this.connection = await VoiceConnection.connect(this.voiceChannel, {
            selfDeaf: true,
        })
        this.subscription = this.connection.subscribe(this)
        this.connection.on('error', (error: any) => {
            this.musicManager.logger.error(error)
        })
    }

    disconnect() {
        if (this.connection) this.connection.destroy()
    }

    play(track: any) {
        if (!track) {
            super.play(this.queue.current)
        } else {
            super.play(track)
        }
        clearTimeout(this.leaveTimeout)
        this.leaveTimeout = null
        this.start()
    }
    stop() {
        this.manager.logger.debug('stopping player')
        this.manager.trackEnd(this, true)
    }
    async softDestroy(force: boolean) {
        try {
            if (this.stayInVoice && !force) return

            if (this.message) {
                // if (this.nowPlayingMessageInterval) clearInterval(this.nowPlayingMessageInterval);
                // eslint-disable-next-line no-empty-function
                await this.message.edit({ components: [] }).catch(() => {})
            }
            if (this.connection) this.disconnect()
            if (this.player) super.destroy()

            this.manager.players.delete(this.guild.id)
        } catch (e) {
            this.manager.logger.error(e)
        }
    }

    async destroy(force: boolean) {
        super.destroy()

        await this.softDestroy(force).catch((e: any) => this.manager.logger.error(e))
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
        } else {
            this.trackRepeat = false
        }

        return this
    }

    setQueueRepeat(repeat: boolean) {
        if (repeat) {
            this.trackRepeat = false
            this.queueRepeat = true
        } else {
            this.queueRepeat = false
        }

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
        if (!this.queue.current) return undefined
        time = Number(time)

        //set timer in the player too
        super.seek(time)
    }
}
