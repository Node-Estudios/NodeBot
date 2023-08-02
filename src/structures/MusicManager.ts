import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    VoiceChannel,
    TextChannel,
    ButtonStyle,
    GuildMember,
    Collection,
    Guild,
    Message,
    ComponentType,
    APIMessageComponentEmoji,
    ChatInputCommandInteraction,
    APIEmbed,
    ButtonInteraction,
} from 'discord.js'
import { Innertube } from 'youtubei.js'
import Translator, { keys } from '../utils/Translator.js'
import { SpamIntervalDB } from './spamInterval.js'
import formatTime from '../utils/formatTime.js'
import logger from '../utils/logger.js'
import EventEmitter from 'events'
import Player from './Player.js'
import client from '../bot.js'
import yasha from 'yasha'
const spamIntervald = new SpamIntervalDB()
type UserExtended = GuildMember & {}

export default class MusicManager extends EventEmitter {
    players = new Collection<string, Player>()
    spamInterval = spamIntervald
    youtubei = Innertube.create()
    youtubeCodes = new Collection<string, UserExtended>()

    private async sendSpamMSG (user: UserExtended, player: Player) {
        await (await player.youtubei).session.signIn(undefined)
        // if (!this.spamInterval.checkUser(user.id)) {

        //     this.spamInterval.addUser(user.id, 30 * 60 * 1000);
        // } else return
    }

    async createNewPlayer (vc: VoiceChannel, textChannel: TextChannel, volume?: number) {
        const player = new Player({
            musicManager: this,
            voiceChannel: vc,
            textChannel,
            volume,
        })
        // Imprime un mensaje de depuración
        // logger.debug('Sign in successful: ', credentials);
        // Crea un objeto "EmbedBuilder" y establece la descripción del mensaje
        this.players.set(vc.guild.id, player)
        // console.log(player.youtubei)
        player.on('ready', async () => await this.trackStart(player))

        player.on('finish', () => this.trackEnd(player, true))
        player.on('debug', (debug: any) => logger.log(debug))
        // player.on('packet', (buffer: Buffer, frame_size: number) => {
        //     console.log(`Packet: ${frame_size} samples`);
        // });

        player.on(yasha.VoiceConnection.Status.Destroyed, async () => await player.destroy())

        player.on('error', err => {
            logger.error(err)
            // console.log(err)
            player.skip()
            player.play()
        })

        return player
    }

    async trackPause (player: Player, interaction: ChatInputCommandInteraction<'cached'> | ButtonInteraction): Promise<false | Message<boolean>> {
        // Return false in case the player is not playing || paused || there is no message
        const translate = Translator(interaction)
        if (!player.queue.current) return false
        if (!player.playing || player.paused) {
            player.playing = true
            player.paused = false
            player.pause()
        } else {
            player.playing = false
            player.paused = true
            player.pause()
        }
        type Writeable<T extends { [x: string]: any }, K extends string> = {
            [P in K]: T[P];
        }
        const prevDesc = player.message?.embeds[0].description?.split('\n')[0]
        const newDesc = `${prevDesc}\n\n${translate(keys.stop[player.paused ? 'paused' : 'resumed'], { user: interaction.user.toString() })}`
        const updatedEmbed: APIEmbed = {
            ...player.message?.embeds[0], // Spread the existing embed properties
            description: newDesc, // Update the description
        }
        if (player.message?.components) {
            const actionRowComponents = player.message.components[0]?.components
            if (actionRowComponents) {
                const pauseButton = actionRowComponents.find((c) => c.customId === 'pauseMusic' && c.type === ComponentType.Button)
                if (pauseButton && pauseButton.type === 2) { // Make sure it's a button component
                    if (player.playing) {
                        (pauseButton.data.emoji as Writeable<APIMessageComponentEmoji, keyof APIMessageComponentEmoji>) = {
                            name: client.settings.emojis.white.pause.name.toString(),
                            id: client.settings.emojis.white.pause.id.toString(),
                            animated: pauseButton.data.emoji?.animated,
                        }
                    } else {
                        (pauseButton.data.emoji as Writeable<APIMessageComponentEmoji, keyof APIMessageComponentEmoji>) = {
                            name: client.settings.emojis.white.play.name.toString(),
                            id: client.settings.emojis.white.play.id.toString(),
                            animated: pauseButton.data.emoji?.animated,
                        }
                    }
                }
            }
        }
        if (player.message) { return await player.message.edit({ components: player.message.components, embeds: [updatedEmbed] }) } else return false
    }

    async trackStart (player: Player) {
        // todo: Check if the song limit is the saçme as stablished for the admins
        // if(player.queue.current?.duration > player.guild.)
        player.playing = true
        player.paused = false
        const song = player.queue.current
        if (!song) return
        const translate = Translator(player.guild)
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            /* new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('likeMusic').setEmoji('<:grey_heart:1133326993694392401>'), */ // TODO: Change to blue if user already liked music
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('shuffleMusic').setEmoji(`${client.settings.emojis.white.shuffle.full}`),
            /* new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('previousMusic').setEmoji('<:grey_previous:1133320744089178132>'), */
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('pauseMusic')
                .setEmoji(`${client.settings.emojis.white.pause.full}`),
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('nextMusic').setEmoji(`${client.settings.emojis.white.next.full}`),
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('repeatMusic').setEmoji(`${client.settings.emojis.white.repeat_off.full}`),
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId('queueMusic').setEmoji(`${client.settings.emojis.white.library.full}`),
        )

        const embed = new EmbedBuilder().setColor(client.settings.color)
        if (song.platform === 'Youtube') {
            embed
                .setImage(`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`)
                .setDescription(
                    `${translate(keys.PLAYING)} **[${song.title}](https://music.youtube.com/watch?v=${
                        song.id
                    })** [${formatDuration(song.duration)}] • ${song.requester.toString()}`,
                )
        } else if (song.platform === 'Spotify') {
            if (song.thumbnails[0]) {
                embed.setDescription(
                    `**${translate(keys.PLAYING)}\n[${song.title}](https://open.spotify.com/track/${song.id})**`,
                )
                embed.setImage(song.thumbnails[0].url)
            }
        }
        // ^ Si no tenemos un mensaje ya enviado, lo enviamos, y si lo tenemos, borramos el anterior y enviamos uno nuevo <3
        player.message?.delete()
        if (client.settings.debug === 'true') {
            logger.debug(
                'Playing | ' +
                player.queue.current?.title +
                    ' | ' +
                    player.guild.name +
                    ' | ' +
                    player.queue.current?.requester.displayName,
            )
        }
        const msg = await player.textChannel.send({
            embeds: [embed],
            components: [row],
        })
        player.message = msg
        return msg
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            player.queue.add(player.queue.current!)
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
        const embed = new EmbedBuilder()
            .setColor(client.settings.color)
            .setDescription(
                'Ha terminado ' +
                    `**[${player.queue.current?.title}](https://music.youtube.com/watch?v=${
                        player.queue.current?.id
                    })** [${formatDuration(player.queue.current?.duration ?? 0)}] • <@${
                        player.queue.current?.requester.id
                    }>`,
            )
            .setThumbnail(`https://img.youtube.com/vi/${player.queue.current?.id}/maxresdefault.jpg`)
        player.message?.edit({
            components: [],
            embeds: [embed],
        })
        if (player.stayInVc) {
            const playlist = await (await player.youtubei)?.music.getUpNext(player.queue.current?.id ?? '', true)
            // const veces = 6
            async function ejecutarAccionesEnParalelo (contents: any[], maxVeces: number): Promise<void> {
                const cantidadEjecuciones = Math.min(maxVeces, contents.length)
                const promesas: Array<Promise<void>> = []

                for (let i = 0; i < cantidadEjecuciones; i++) {
                    const indiceAleatorio = Math.floor(Math.random() * contents.length)
                    const elementoAleatorio = contents[indiceAleatorio]
                    promesas.push(ejecutarAccion(elementoAleatorio)) // Llamada a tu función de acción
                }

                await Promise.all(promesas)
            }
            async function ejecutarAccion (elemento: any) {
                // Lógica de tu acción
                const track = await client.music.search(elemento.video_id, client.user, 'Youtube')
                player.queue.add(track)
            }
            ejecutarAccionesEnParalelo(playlist.contents, 5).then(() => {
                player.skip()
                player.play()
            })
            const e = new EmbedBuilder()
                .setTitle(translate(keys.automix.generated))
                .setColor('Green')
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
                        value: `${player.queue.current?.requester.user}`,
                        inline: true,
                    },
                )
                .setThumbnail(`https://img.youtube.com/vi/${player.queue.current?.id}/maxresdefault.jpg`)
            await player.textChannel.send({
                embeds: [e],
                content: '',
            })
        } else {
            return await this.destroy(player.guild)
        }
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

    async search (query: any, requester: any, source: 'Spotify' | 'Youtube' | 'Soundcloud') {
        let track
        if (requester.youtubei) {
            if (requester.youtubei.session.logged_in) {
                const rawData = await (await requester.youtubei.music.search(query, { limit: 1 })).sections[0]
                track = rawData.contents[0].id
            } else {
                (await requester.youtubei)
                track = await (await yasha.Source.Youtube.search(query))[0]
            }
        } else track = await (await yasha.Source.Youtube.search(query))[0]

        track = await yasha.Source.resolve(
            track ? `https://www.youtube.com/watch?v=${track.id ? track.id : track}` : query,
        )
        if (!track) logger.debug('No track found')
        else {
            // logger.log('track: ', track)
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
            track.requester = requester
            track.icon = null
        }
        return track
        // }
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
