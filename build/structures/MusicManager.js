import Translator, { keys } from '#utils/Translator.js';
import formatTime from '#utils/formatTime.js';
import logger from '#utils/logger.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, Colors, ComponentType, } from 'discord.js';
import EventEmitter from 'events';
import yasha from 'yasha';
import { Innertube } from 'youtubei.js';
import client from '../bot.js';
import Player from './Player.js';
import { SpamIntervalDB } from './spamInterval.js';
import EmbedBuilder from '#structures/EmbedBuilder.js';
const spamIntervald = new SpamIntervalDB();
export default class MusicManager extends EventEmitter {
    players = new Collection();
    spamInterval = spamIntervald;
    youtubei = Innertube.create();
    youtubeCodes = new Collection();
    async sendSpamMSG(user, player) {
        await player.youtubei.session.signIn(undefined);
    }
    async createNewPlayer(vc, textChannelId, volume) {
        const player = new Player({
            musicManager: this,
            voiceChannel: vc,
            textChannelId,
            volume,
            innertube: await Innertube.create(),
        });
        this.players.set(vc.guild.id, player);
        player.on('ready', async () => await this.trackStart(player));
        player.on('finish', () => this.trackEnd(player, true));
        player.on('error', err => {
            client.errorHandler.captureException(err);
            logger.error(err);
            player.skip();
            player.play();
        });
        return player;
    }
    async trackPause(player, interaction) {
        const translate = Translator(interaction);
        if (!player.queue.current)
            return false;
        player.playing ? player.pause() : player.pause(false);
        const prevDesc = player.message?.embeds[0].description?.split('\n')[0];
        const newDesc = `${prevDesc}\n\n${translate(keys.stop[player.paused ? 'paused' : 'resumed'], { user: interaction.user.toString() })}`;
        const updatedEmbed = {
            ...player.message?.embeds[0],
            description: newDesc,
        };
        const updatedEmbed2 = new EmbedBuilder(updatedEmbed)
            .setImage(player.message?.embeds[0].data.image?.url ?? null)
            .setColor(player.message?.embeds[0].data.color ?? null);
        if (player.message?.components) {
            const actionRowComponents = player.message.components[0]?.components;
            if (actionRowComponents) {
                const pauseButton = actionRowComponents.find((c) => c.customId === 'pauseMusic' && c.type === ComponentType.Button);
                if (pauseButton && pauseButton.type === 2)
                    if (player.playing)
                        pauseButton.data.emoji = {
                            name: client.settings.emojis.white.pause.name.toString(),
                            id: client.settings.emojis.white.pause.id.toString(),
                            animated: pauseButton.data.emoji?.animated,
                        };
                    else
                        pauseButton.data.emoji = {
                            name: client.settings.emojis.white.play.name.toString(),
                            id: client.settings.emojis.white.play.id.toString(),
                            animated: pauseButton.data.emoji?.animated,
                        };
            }
        }
        if (player.message)
            return await player.message.edit({ components: player.message.components, embeds: [updatedEmbed2] });
        else
            return false;
    }
    async trackStart(player) {
        const equalizerSettings = [
            { band: 32, gain: 0 },
            { band: 64, gain: 1 },
            { band: 125, gain: 2 },
            { band: 250, gain: 3 },
            { band: 500, gain: 1 },
            { band: 1000, gain: 0 },
            { band: 2000, gain: -1 },
            { band: 4000, gain: -2 },
            { band: 8000, gain: -3 },
            { band: 16000, gain: -4 },
        ];
        player.setEqualizer(equalizerSettings);
        player.playing = true;
        player.paused = false;
        const song = player.queue.current;
        if (!song)
            return;
        const translate = Translator(player.guild);
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('shuffleMusic')
            .setEmoji(`${client.settings.emojis.white.shuffle.full}`), new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('pauseMusic')
            .setEmoji(`${client.settings.emojis.white.pause.full}`), new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('nextMusic')
            .setEmoji(`${client.settings.emojis.white.next.full}`), new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('repeatMusic')
            .setEmoji(`${client.settings.emojis.white.repeat_off.full}`), new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('queueMusic')
            .setEmoji(`${client.settings.emojis.white.library.full}`));
        const embed = new EmbedBuilder()
            .setColor(client.settings.color);
        if (song.platform === 'Youtube')
            embed
                .setImage(song.thumbnails?.[0].url ?? null)
                .setDescription(`${translate(keys.PLAYING)} **[${song.title}](https://music.youtube.com/watch?v=${song.id})** [${formatDuration(song.duration ?? 0)}] • ${song.requester.toString()}`);
        else if (song.platform === 'Spotify')
            if (song.thumbnails?.[0]) {
                embed.setDescription(`**${translate(keys.PLAYING)}\n[${song.title}](https://open.spotify.com/track/${song.id})**`);
                embed.setImage(song.thumbnails[0].url);
            }
        player.message?.delete();
        if (client.settings.debug === 'true')
            logger.music('Playing | ' +
                player.queue.current?.title +
                ' | ' +
                player.guild.name +
                ' | ' +
                player.queue.current?.requester.displayName);
        try {
            (player.message = await (await player.getTextChannel())?.send({
                embeds: [embed],
                components: [row],
            }));
        }
        catch (error) {
            client.errorHandler.captureException(error);
            logger.error(error);
        }
    }
    trackEnd(player, finished) {
        const track = player.queue.current;
        if (!track)
            return;
        if (!track?.duration)
            track.duration = player.getDuration();
        if (player.trackRepeat) {
            player.play();
            return this;
        }
        if (player.queueRepeat) {
            player.queue.add(track);
            player.queue.current = player.queue.shift() ?? null;
            player.play();
            return this;
        }
        if (player.queue.length) {
            player.queue.current = player.queue.shift() ?? null;
            player.play();
            return this;
        }
        if (player.queue.current) {
            player.stop();
            player.playing = false;
            this.queueEnd(player);
            return this;
        }
        return this;
    }
    async queueEnd(player) {
        const translate = Translator(player.guild);
        if (player.queue.current) {
            const embed = new EmbedBuilder()
                .setColor(client.settings.color)
                .setDescription('Ha terminado ' +
                `**[${player.queue.current.title}](https://music.youtube.com/watch?v=${player.queue.current.id})** [${formatDuration(player.queue.current.duration ?? 0)}] • <@${player.queue.current?.requester.id}>`)
                .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.id}/maxresdefault.jpg`);
            player.message?.edit({
                components: [],
                embeds: [embed],
            });
        }
        try {
            if (!player.stayInVc)
                return await this.destroy(player.guild);
        }
        catch (error) {
            client.errorHandler.captureException(error);
        }
        const playlist = await player.youtubei.music.getUpNext(player.queue.current?.id ?? '', true);
        this.ejecutarAccionesEnParalelo(playlist.contents, 5, player).then(() => {
            player.skip();
            player.play();
        }).catch((err) => client.errorHandler.captureException(err));
        const e = new EmbedBuilder()
            .setTitle(translate(keys.automix.generated))
            .setColor(Colors.Green)
            .addFields({
            name: translate(keys.TITLE),
            value: 'a',
            inline: true,
        }, {
            name: translate(keys.SONGS),
            value: '5',
            inline: true,
        }, {
            name: translate(keys.REQUESTER),
            value: `${player.queue.current?.requester}`,
            inline: true,
        })
            .setThumbnail(`https://img.youtube.com/vi/${player.queue.current?.id}/maxresdefault.jpg`);
        try {
            await (await player.getTextChannel())?.send({
                embeds: [e],
                content: '',
            });
        }
        catch (error) {
            client.errorHandler.captureException(error);
            this.destroy(player.guild);
        }
    }
    async ejecutarAccionesEnParalelo(contents, maxVeces, player) {
        const cantidadEjecuciones = Math.min(maxVeces, contents.length);
        const promesas = [];
        for (let i = 0; i < cantidadEjecuciones; i++) {
            const indiceAleatorio = Math.floor(Math.random() * contents.length);
            const elementoAleatorio = contents[indiceAleatorio];
            promesas.push(this.ejecutarAccion(elementoAleatorio, player));
        }
        await Promise.all(promesas);
    }
    async ejecutarAccion(elemento, player) {
        const track = await client.music.search(elemento.video_id, client.user, 'Youtube');
        if (!track)
            return;
        player.queue.add(track);
    }
    get(guild) {
        return this.players.get(guild.id);
    }
    async destroy(guild) {
        return await this.players.get(guild.id)?.destroy();
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    async search(query, requester, source) {
        try {
            let track = await yasha.Source.resolve(query);
            if (!track) {
                const search = await yasha.Source.Youtube.search(query);
                if (!search.length) {
                    logger.debug(query, 'No se encontró nada');
                    return undefined;
                }
                const tracks = search.filter(t => t.platform === 'Youtube');
                if (!tracks.length)
                    return undefined;
                track = tracks[0];
            }
            if (track?.platform !== 'Youtube')
                return undefined;
            return track;
        }
        catch (error) {
            if ([
                'Video is age restricted',
                'Playlist not found',
                'This video is not available',
            ].includes(error.message))
                throw new Error(error.message);
            client.errorHandler.captureException(error);
        }
        return undefined;
    }
    getPlayingPlayers() {
        return this.players.filter(p => p.playing);
    }
}
export function formatDuration(duration) {
    if (isNaN(duration) || typeof duration === 'undefined')
        return '00:00';
    return formatTime(duration, true);
}
//# sourceMappingURL=MusicManager.js.map