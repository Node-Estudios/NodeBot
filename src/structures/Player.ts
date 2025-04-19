//  @ts-nocheck
import { Guild, LocaleString, Message, VoiceChannel, User, Snowflake, TextChannel, PermissionFlagsBits } from 'discord.js'
import MusicManager from './MusicManager.js'
import logger from '#utils/logger.js'
import { Innertube } from 'youtubei.js'
import Queue from './Queue.js'
import yasha from 'yasha'
import Translator, { keys } from '#utils/Translator.js'

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
    #textChannelId?: Snowflake
    voiceChannel: VoiceChannel
    message?: Message
    guild: Guild
    leaveTimeout?: NodeJS.Timeout
    bitrate?: number
    connection?: any
    subscription?: any
    stayInVc = false
    previouslyPaused = false
    pausedUser?: User
    resumedUser?: User
    youtubei: Innertube
    waitingMessage?: Message
    constructor (options: {
        musicManager: MusicManager
        lang?: LocaleString
        bitrate?: number
        volume?: number
        voiceChannel: VoiceChannel
        textChannelId: Snowflake
        guild?: Guild
        innertube: Innertube
    }) {
        super({
            external_packet_send: false,
            external_encrypt: false,
            normalize_volume: true,
        })
        this.youtubei = options.innertube
        this.manager = options.musicManager
        this.bitrate = options.bitrate
        this.volume = options.volume ?? 100

        this.voiceChannel = options.voiceChannel
        this.guild = options.guild ?? options.voiceChannel.guild
        this.guild.channels.fetch(options.textChannelId).then(channel => {
            if (!channel?.isTextBased()) return
            if (this.guild.members.me?.permissionsIn(channel).has([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.SendMessages]) === false) return
            this.#textChannelId = options.textChannelId
        }).catch(() => null)
        this.on('finish', () => (this.playing = false))
        this.on('error', (error: any) => (this.playing = false && logger.error(error)))
    }

    async connect () {
        this.connection = await yasha.VoiceConnection.connect(this.voiceChannel, {
            selfDeaf: true,
        })
        // TODO: Remove ts-ignore when yasha is updated
        this.subscription = this.connection?.subscribe(this)
        this.connection?.on('error', (error: any) => logger.error(error))
    }

    disconnect () {
        this.connection?.disconnect()
        if (this.connection) this.connection.destroy()
    }

    async play (track?: any) {
        this.playing = true
        // TODO: Check if this code works
        if (!track && this.queue.current) super.play(this.queue.current)
        else super.play(track)
        clearTimeout(this.leaveTimeout)
        this.leaveTimeout = undefined
        try {
            this.start()
        } catch (error) {
            if (`${error}`.includes('Video is age restricted'))
                this.getTextChannel().then(c => {
                    const translate = Translator(this.guild)
                    c?.send({
                        content: translate(keys.play.age_restricted),
                    })
                }).catch(e => undefined)
        }
    }

    override async destroy () {
        try {
            if (this.connection) this.disconnect()
            // TODO: FIX
            //if (this.player) super.destroy()

            return this.manager.players.delete(this.guild.id)
        } catch (e) {
            return logger.error(e)
        }
    }

    skip () {
        this.manager.trackEnd(this, false)
    }

    override setEqualizer (equalizer: any) {
        super.setEqualizer(equalizer)
    }

    override setVolume (volume: number) {
        if (volume > 100000) volume = 100000
        super.setVolume(volume / 100)
    }

    setTrackRepeat (repeat = true) {
        if (repeat) {
            this.trackRepeat = true
            this.queueRepeat = false
        } else this.trackRepeat = false

        return this
    }

    setQueueRepeat (repeat = true) {
        if (repeat) {
            this.trackRepeat = false
            this.queueRepeat = true
        } else this.queueRepeat = false

        return this
    }

    pause (pause = true) {
        if (this.paused === pause || !this.queue.totalSize) return this

        this.playing = !pause
        this.paused = pause
        this.setPaused(pause)

        return this
    }

    override seek (time: number) {
        if (!this.queue.current) return

        // set timer in the player too
        super.seek(Number(time))
    }

    async getTextChannel () {
        const channel = await this.guild.channels.fetch(this.#textChannelId ?? '')
        if (!channel?.isTextBased()) return null
        return channel as TextChannel
    }

    // eslint-disable-next-line accessor-pairs
    set textChannelId (id: Snowflake) {
        this.guild.channels.fetch(id).then(channel => {
            if (!channel?.isTextBased()) return
            if (this.guild.members.me?.permissionsIn(channel).has([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.SendMessages]) === false) return
            this.#textChannelId = id
        }).catch(() => null)
    }

    get textChannelId (): string | undefined {
        return this.#textChannelId
    }
}
