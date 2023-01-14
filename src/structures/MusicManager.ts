import { ButtonBuilder, ButtonStyle, Collection, Guild as DiscordGuild, EmbedBuilder, Guild, GuildMember, ActionRowBuilder as MessageActionRow, ButtonBuilder as MessageButton, EmbedBuilder as MessageEmbed, TextChannel, VoiceChannel } from 'discord.js';
import EventEmitter from 'events';
// TODO: When types are finished, change the yasha import to { Source, VoiceConnection } from 'yasha'
import yasha from 'yasha';
import client from '../bot.js';
import languageCache from '../cache/idioms.js';
import retrieveUserLang from '../utils/db/retrieveUserLang.js';
import formatTime from '../utils/formatTime.js';
import logger from '../utils/logger.js';
import Player from './Player.js';
// ? use client for lang
import Innertube2 from 'youtubei.js';
import UserModel from '../models/user.js';
import { spamIntervalDB } from './spamInterval.js';
const { Innertube } = Innertube2
let spamIntervald = new spamIntervalDB()
type UserExtended = GuildMember & {

}

export default class MusicManager extends EventEmitter {
    players = new Collection<string, Player>()
    spamInterval = spamIntervald
    youtubeCodes = new Collection<string, UserExtended>()
    constructor() {
        super()
    }
    private async sendSpamMSG(user: UserExtended, player: Player) {
        if (!this.spamInterval.checkUser(user.id)) {
            await (await player.youtubei).session.signIn(undefined)
            this.spamInterval.addUser(user.id, 30 * 60 * 1000);
        } else return
    }

    async createNewPlayer(vc: VoiceChannel, textChannel: TextChannel, guild: Guild, volume: number, user: GuildMember) {
        const player = new Player({
            musicManager: this,
            guild,
            voiceChannel: vc,
            textChannel,
            volume,
            language: await retrieveUserLang(guild),
        });
        // * Execute Youtubei.js events to keep a track of every user that has signed in
        // Espera a que el objeto "player" esté disponible y luego accede a la propiedad "youtubei"
        (await player.youtubei).session.on('auth-pending', (data: { user_code: any; verification_url: any; }) => {
            // Imprime un mensaje de depuración
            logger.debug('auth pending')
            // Verifica si el usuario ha superado el límite de tiempo para enviar mensajes
            if (!this.spamInterval.checkUser(user.id)) {
                this.youtubeCodes.set(data.user_code, user)
                // Crea un objeto "EmbedBuilder" y establece la descripción y los campos del mensaje
                const embed = new EmbedBuilder().setDescription(`It seems like you dont sign in using Youtube, would you like to?`).addFields([{ name: `Sign in with youtube in the next link; Use code: ${data.user_code}`, value: data.verification_url }])
                // Añade el usuario al registro de spamInterval y establece el intervalo de tiempo en 30 minutos
                this.spamInterval.addUser(user.id, 30 * 60 * 1000);
                // Envía el mensaje al usuario a través de un mensaje privado
                user.send({ embeds: [embed] }).catch((e) => {
                    // Si hay un problema al enviar el mensaje privado, envía un mensaje en el canal de texto especificado
                    textChannel.send('Hey! Hay un problema, parece que no puedo enviarte un mensaje privado, por lo que si deseas disfrutas de las funciones exclusivas deberás permitirme los mensajes privados.')
                })
            }
        });

        // Espera a que el objeto "player" esté disponible y luego accede a la propiedad "youtubei"
        // Define un manejador de evento para el evento "update-credentials" en la sesión de YouTubeI
        (await player.youtubei).session.on('update-credentials', ({ credentials }: any) => {
            // Busca un documento en la base de datos que coincida con el ID del usuario
            UserModel.findOne({ id: user.id }).then(async (user2: any) => {
                // Establece la propiedad "youtubei_user" del objeto "player" como el solicitante actual de la cola
                player.youtubei_user = player.queue.current?.requester
                // Si se encuentra un documento, actualiza las credenciales y lo guarda
                if (user2) {
                    user2.credentials = credentials
                    return await user2.save()
                    // Si no se encuentra un documento, crea uno nuevo con el ID del usuario, las credenciales y algunas propiedades predeterminadas
                } else {
                    return await UserModel.create({ id: user.id, executedCommands: 0, roles: { Developer: { enabled: false }, Tester: { enabled: false }, credentials: credentials } })
                }
            })
        });
        // Define un manejador de evento para el evento "auth" en la sesión de YouTubeI
        (await player.youtubei).session.on('auth', ({ credentials }: any) => {
            // Busca un documento en la base de datos que coincida con el ID del usuario
            UserModel.findOne({ id: user.id }).then(async (user2: any) => {
                credentials.expires_at = Date.now() + credentials.expires_in * 1000
                // Establece la propiedad "youtubei_user" del objeto "player" como el solicitante actual de la cola
                player.youtubei_user = player.queue.current?.requester
                // Si se encuentra un documento, actualiza las credenciales y lo guarda
                if (user2) {
                    user2.credentials = credentials
                    return await user2.save()
                    // Si no se encuentra un documento, crea uno nuevo con el ID del usuario, las credenciales y algunas propiedades predeterminadas
                } else {
                    return await UserModel.create({ id: user.id, executedCommands: 0, roles: { Developer: { enabled: false }, Tester: { enabled: false }, credentials: credentials } })
                }
            })
            // Imprime un mensaje de depuración
            logger.debug('Sign in successful: ', credentials);
            // Crea un objeto "EmbedBuilder" y establece la descripción del mensaje
            const embed = new EmbedBuilder().setDescription('Has iniciado sesión correctamente. Node ya tiene acceso para ver tus canciones favoritas! Si deseas revocar este acceso, puedes hacerlo desde [este link de google](https://myaccount.google.com/permissions)')
            return user.send({ embeds: [embed] }).catch((e) => {
                textChannel.send('Hey! Hay un problema, parece que no puedo enviarte un mensaje privado, por lo que si deseas disfrutas de las funciones exclusivas deberás permitirme los mensajes privados.')
            })
        });
        // Todo: add auth-error event
        (await player.youtubei).session.on('auth-error', ({ credentials }: any) => {
            console.log('auth failed: ', credentials)
        });
        UserModel.findOne({ id: user.id }).then(async (user2: any) => {
            // console.log('user2: ', user2)
            if (user2) {
                // console.log('user finded: ', user2)
                if (user2.credentials) {
                    // console.log(user2.credentials);
                    (await player.youtubei).session.signIn(user2.credentials).then(() => player.youtubei_user = player.queue.current?.requester).catch((e) => {
                        logger.debug(e)
                    })
                } else return await this.sendSpamMSG(user, player)
            } else return await this.sendSpamMSG(user, player)
        });
        this.players.set(guild.id, player)
        // console.log(player.youtubei)
        player.on('ready', () => this.trackStart(player))

        player.on('finish', () => this.trackEnd(player, true))
        // player.on('packet', (buffer: Buffer, frame_size: number) => {
        //     console.log(`Packet: ${frame_size} samples`);
        // });

        player.on(yasha.VoiceConnection.Status.Destroyed, () => player.destroy())

        player.on('error', (err: any) => {
            logger.error(err)
            player.skip()
        })

        return player
    }
    async trackStart(player: Player) {

        // todo: Check if the song limit is the saçme as stablished for the admins
        // if(player.queue.current?.duration > player.guild.)
        player.playing = true
        player.paused = false
        let song = player.queue.current!
        if (!song) return
        if (song.requester.id !== player.youtubei_user?.id && (await player.youtubei).session.logged_in) await (await player.youtubei).session.signOut() && player.youtubei_user === undefined
        player.language = await retrieveUserLang(player.queue.current!.requester.user.id) // es_ES // en_US
        let language = await languageCache.get(player.language).default

        // ^ Si no tenemos un mensaje ya enviado, lo enviamos, y si lo tenemos, borramos el anterior y enviamos uno nuevo <3
        if (!player.message) {
            const row = new MessageActionRow<ButtonBuilder>().addComponents(
                new MessageButton()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(language.PLAYER['stopMusic'])
                    .setCustomId('stopMusic'),
                new MessageButton()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(language.PLAYER['pauseMusic'])
                    .setCustomId('pauseMusic'),
                new MessageButton()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(language.PLAYER['skipMusic'])
                    .setCustomId('skipMusic'),
                new MessageButton()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(language.PLAYER['queueMusic'])
                    .setCustomId('queueMusic'),
            )

            const embed = new MessageEmbed().setColor(client.settings.color)
            if (song.platform === 'Youtube') {
                embed
                    .setThumbnail(`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`)
                    .setDescription(
                        `${language.PLAYING} **[${song.title}](https://music.youtube.com/watch?v=${song.id
                        })** [${formatDuration(song.duration)}] • <@${song.requester.user.id}>`,
                    )
                // embed.addField(
                //     "Bitrate",
                //     player.track.bitrate,
                //     true
                // )
            } else if (song.platform === 'Spotify') {
                if (song.thumbnails[0]) {
                    embed.setDescription(
                        `**${language.PLAY[3]}\n[${song.title}](https://open.spotify.com/track/${song.id})**`,
                    )
                    embed.setThumbnail(song.thumbnails[0].url)
                }
            }
            const msg = await (client.channels.cache.get(player.textChannel.id) as TextChannel)?.send({
                embeds: [embed],
                components: [row],
            })
            player.message = msg
            return msg
        } else {
            const row = new MessageActionRow<ButtonBuilder>().addComponents(
                new MessageButton()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(language.PLAYER['stopMusic'])
                    .setCustomId('stopMusic'),
                new MessageButton()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(language.PLAYER['pauseMusic'])
                    .setCustomId('pauseMusic'),
                new MessageButton()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(language.PLAYER['skipMusic'])
                    .setCustomId('skipMusic'),
                new MessageButton()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(language.PLAYER['queueMusic'])
                    .setCustomId('queueMusic'),
            )
            const embed = new MessageEmbed().setColor(client.settings.color)
            if (song.platform === 'Youtube') {
                embed
                    .setThumbnail(`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`)
                    .setDescription(
                        `${language.PLAYING} **[${song.title}](https://music.youtube.com/watch?v=${song.id
                        })** [${formatDuration(song.duration)}] • <@${song.requester.user.id}>`,
                    )
                // embed.addField(
                //     "Bitrate",
                //     player.track.bitrate,
                //     true
                // )
            } else if (song.platform === 'Spotify') {
                if (song.thumbnails[0]) {
                    embed.setDescription(
                        `**${language.PLAY[3]}\n[${song.title}](https://open.spotify.com/track/${song.id})**`,
                    )
                    embed.setThumbnail(song.thumbnails[0].url)
                }
            }
            player.message.delete()
            const msg = await player.textChannel.send({
                embeds: [embed],
                components: [row],
            })
            player.message = msg
            return msg
        }

        // const track = player.queue.current;
        // this.emit('trackStart', player, track);
    }

    trackEnd(player: Player, finished: boolean) {
        const track = player.queue.current
        // logger.log(player.queue.length, player.queue.previous)
        if (!track?.duration) track!.duration = player.getDuration()

        if (player.trackRepeat) {
            player.play()
            return this
        }

        if (player.queueRepeat) {
            player.queue.add(player.queue.current)
            player.queue.current = player.queue.shift()
            player.play()
            return this
        }

        if (player.queue.length) {
            player.queue.current = player.queue.shift()
            player.play()
            return this
        }

        if (player.queue.current) {
            player.stop()
            player.playing = false
            this.queueEnd(player)
            return this
        }
        // this.queueEnd(player)
        return this
    }
    async queueEnd(player: Player) {
        let language = await languageCache.get(player.language)
        const embed = new MessageEmbed()
            .setColor(client.settings.color)
            .setDescription(
                `Ha terminado ` +
                `**[${player.queue.current?.title}](https://music.youtube.com/watch?v=${player.queue.current?.id
                })** [${formatDuration(player.queue.current?.duration ?? 0)}] • <@${player.queue.current?.requester.user.id
                }>`,
            )
            .setThumbnail(`https://img.youtube.com/vi/${player.queue.current!.id}/maxresdefault.jpg`)
        player.queue.current = null
        player.message?.edit({
            components: [],
            embeds: [embed],
        })
        return (await player.youtubei).session.logged_in ? await (await player.youtubei).session.signOut() && await this.destroy(player.guild) : await this.destroy(player.guild)
    }

    get(guild: any) {
        return this.players.get(guild.id)
    }

    async destroy(guild: DiscordGuild) {
        return await this.players.get(guild.id)?.destroy()
    }

    async search(query: any, requester: any, source: 'Spotify' | 'Youtube' | 'Soundcloud') {
        // logger.debug('debugging search', await yasha.Source.resolve(await yasha.Source.Youtube.search(query)[0]))
        let track =
            source === 'Spotify'
                ? (await yasha.Source.Spotify.search(query))[0]
                : source === 'Youtube'
                    ? (await yasha.Source.Youtube.search(query))[0]
                    : source === 'Soundcloud'
                        ? (await yasha.Source.Soundcloud.search(query))[0]
                        : await yasha.Source.resolve(query);

        // console.log('resolved: ', await yasha.Source.resolve('https://www.youtube.com/watch?v=' + await yasha.Source.Youtube.search(query)[0].id))
        try {
            if (!track) logger.debug('No track found')
            else {
                // logger.log('track: ', track)
                // if (track instanceof TrackPlaylist) {
                //     track.forEach((t: any) => {
                //         t.requester = requester;
                //         t.icon = null;
                //         t.thumbnail;
                //     });
                // } else {
                if (track.streams) {
                    // console.log(track.streams)
                    const stream = getMax(track.streams, 'bitrate')
                    track.streams = track.streams.splice(stream, stream)
                }
                track.requester = requester
                track.icon = null
                track.thumbnail
            }
            return track
            // }
        } catch (err: any) {
            throw new Error(err)
        }
    }

    getPlayingPlayers() {
        return this.players.filter((p: any) => p.playing)
    }
}
//TODO: REMOVE ANY TYPES
function getMax(arr: any, prop: any) {
    var max: any
    for (var i = 0; i < arr.length; i++)
        if (arr[i].audio && !arr[i].video && (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))) max = arr[i]

    return arr.findIndex((o: any) => o.url === max.url)
}
export function formatDuration(duration: number) {
    if (isNaN(duration) || typeof duration === 'undefined') return '00:00'
    // if (duration > 3600000000) return language.LIVE
    return formatTime(duration, true)
}
