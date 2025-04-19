import { PermissionFlagsBits } from 'discord.js';
import logger from '#utils/logger.js';
import Queue from './Queue.js';
import yasha from 'yasha';
import Translator, { keys } from '#utils/Translator.js';
export default class Player extends yasha.TrackPlayer {
    trackRepeat = false;
    queueRepeat = false;
    stayInVoice = false;
    position = 0;
    playing = false;
    paused = false;
    volume = 100;
    queue = new Queue();
    manager;
    #textChannelId;
    voiceChannel;
    message;
    guild;
    leaveTimeout;
    bitrate;
    connection;
    subscription;
    stayInVc = false;
    previouslyPaused = false;
    pausedUser;
    resumedUser;
    youtubei;
    waitingMessage;
    constructor(options) {
        super({
            external_packet_send: false,
            external_encrypt: false,
            normalize_volume: true,
        });
        this.youtubei = options.innertube;
        this.manager = options.musicManager;
        this.bitrate = options.bitrate;
        this.volume = options.volume ?? 100;
        this.voiceChannel = options.voiceChannel;
        this.guild = options.guild ?? options.voiceChannel.guild;
        this.guild.channels.fetch(options.textChannelId).then(channel => {
            if (!channel?.isTextBased())
                return;
            if (this.guild.members.me?.permissionsIn(channel).has([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.SendMessages]) === false)
                return;
            this.#textChannelId = options.textChannelId;
        }).catch(() => null);
        this.on('finish', () => (this.playing = false));
        this.on('error', (error) => (this.playing = false && logger.error(error)));
    }
    async connect() {
        this.connection = await yasha.VoiceConnection.connect(this.voiceChannel, {
            selfDeaf: true,
        });
        this.subscription = this.connection?.subscribe(this);
        this.connection?.on('error', (error) => logger.error(error));
    }
    disconnect() {
        this.connection?.disconnect();
        if (this.connection)
            this.connection.destroy();
    }
    async play(track) {
        this.playing = true;
        if (!track && this.queue.current)
            super.play(this.queue.current);
        else
            super.play(track);
        clearTimeout(this.leaveTimeout);
        this.leaveTimeout = undefined;
        try {
            this.start();
        }
        catch (error) {
            if (`${error}`.includes('Video is age restricted'))
                this.getTextChannel().then(c => {
                    const translate = Translator(this.guild);
                    c?.send({
                        content: translate(keys.play.age_restricted),
                    });
                }).catch(e => undefined);
        }
    }
    async destroy() {
        try {
            if (this.connection)
                this.disconnect();
            return this.manager.players.delete(this.guild.id);
        }
        catch (e) {
            return logger.error(e);
        }
    }
    skip() {
        this.manager.trackEnd(this, false);
    }
    setEqualizer(equalizer) {
        super.setEqualizer(equalizer);
    }
    setVolume(volume) {
        if (volume > 100000)
            volume = 100000;
        super.setVolume(volume / 100);
    }
    setTrackRepeat(repeat = true) {
        if (repeat) {
            this.trackRepeat = true;
            this.queueRepeat = false;
        }
        else
            this.trackRepeat = false;
        return this;
    }
    setQueueRepeat(repeat = true) {
        if (repeat) {
            this.trackRepeat = false;
            this.queueRepeat = true;
        }
        else
            this.queueRepeat = false;
        return this;
    }
    pause(pause = true) {
        if (this.paused === pause || !this.queue.totalSize)
            return this;
        this.playing = !pause;
        this.paused = pause;
        this.setPaused(pause);
        return this;
    }
    seek(time) {
        if (!this.queue.current)
            return;
        super.seek(Number(time));
    }
    async getTextChannel() {
        const channel = await this.guild.channels.fetch(this.#textChannelId ?? '');
        if (!channel?.isTextBased())
            return null;
        return channel;
    }
    set textChannelId(id) {
        this.guild.channels.fetch(id).then(channel => {
            if (!channel?.isTextBased())
                return;
            if (this.guild.members.me?.permissionsIn(channel).has([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.SendMessages]) === false)
                return;
            this.#textChannelId = id;
        }).catch(() => null);
    }
    get textChannelId() {
        return this.#textChannelId;
    }
}
//# sourceMappingURL=Player.js.map