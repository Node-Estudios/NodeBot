// @ts-nocheck
import 'dotenv/config'
import SpotifyWebApi from 'spotify-web-api-node'
import Translator, { keys } from '#utils/Translator.js'
import formatTime from '#utils/formatTime.js'
import logger from '#utils/logger.js'
import {
    APIEmbed,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    Collection,
    ComponentType,
    Guild,
    Message,
    User,
    VoiceChannel,
} from 'discord.js'
import EventEmitter from 'events'
import { Innertube, Credentials, YTNodes } from 'youtubei.js' // <--- CAMBIO: Importar YTNodes
import client from '../bot.js'
import Player from './Player.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import { promises as fs } from 'fs'
import path from 'path'

const CREDENTIALS_PATH = path.join(process.cwd(), 'youtube_credentials.json')

export default class MusicManager extends EventEmitter {
    players = new Collection<string, Player>()
    youtubei: Innertube
    spotifyApi: SpotifyWebApi

    constructor() {
        super()
        this.init()
    }

    async init() {
        try {
            // --- CAMBIO CLAVE AQUÍ ---
            // Se ha añadido un manejador de errores para el parser.
            // Esto evita que el bot crashee cuando YouTube añade nuevos elementos
            // que la librería aún no reconoce, como 'TicketShelf'.
            this.youtubei = await Innertube.create({
                parser_error_handler: (err, node) => {
                    logger.warn(
                        `[YouTubei Parser] Se ignoró un nodo desconocido: ${
                            node.constructor.name
                        }. Error: ${err.message}`,
                    )
                    // Devolvemos el nodo problemático para que el resto del parseo continúe
                    return node
                },
            })
            logger.info('[YouTube Auth] Cliente de YouTubei inicializado.')
            this.youtubei.session.on(
                'update-credentials',
                async credentials => {
                    await this.saveCredentials(credentials)
                },
            )
            this.youtubei.session.on('auth', async credentials => {
                logger.info(
                    '[YouTube Auth] ¡Inicio de sesión en YouTube exitoso!',
                )
                await this.saveCredentials(credentials)
            })
            await this.loadCredentials()

            this.spotifyApi = new SpotifyWebApi({
                clientId: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            })
            await this.refreshSpotifyToken()
            logger.info('[Spotify Auth] Cliente de Spotify inicializado.')
        } catch (error) {
            logger.error(
                '[Auth] Error fatal al inicializar los clientes:',
                error,
            )
        }
    }

    async refreshSpotifyToken() {
        try {
            const data = await this.spotifyApi.clientCredentialsGrant()
            this.spotifyApi.setAccessToken(data.body['access_token'])
            const expiresIn = data.body['expires_in']
            setTimeout(
                () => this.refreshSpotifyToken(),
                (expiresIn - 60) * 1000,
            )
        } catch (error) {
            logger.error('[Spotify Auth] No se pudo refrescar el token:', error)
        }
    }

    async saveCredentials(credentials: Credentials) {
        try {
            await fs.writeFile(
                CREDENTIALS_PATH,
                JSON.stringify(credentials, null, 2),
                'utf-8',
            )
        } catch (error) {
            logger.error(
                '[YouTube Auth] Error al guardar las credenciales:',
                error,
            )
        }
    }

    async loadCredentials() {
        try {
            const credentialsJson = await fs.readFile(CREDENTIALS_PATH, 'utf-8')
            const credentials = JSON.parse(credentialsJson)
            if (credentials?.refresh_token) {
                await this.youtubei.session.signIn(credentials)
            }
        } catch (error) {
            if (error.code !== 'ENOENT') {
                logger.error(
                    '[YouTube Auth] Error al cargar las credenciales:',
                    error,
                )
            }
        }
    }

    async search(
        query: string,
        requester: User,
    ): Promise<RequesterInjecter<any> | null> {
        try {
            let spotifyTrack = null
            const spotifyTrackRegex =
                /^(https?:\/\/)?open\.spotify\.com\/track\/([a-zA-Z0-9]+)/
            const spotifyMatch = query.match(spotifyTrackRegex)

            if (spotifyMatch) {
                const trackId = spotifyMatch[2]
                const trackData = await this.spotifyApi.getTrack(trackId)
                spotifyTrack = trackData.body
            } else {
                const searchData = await this.spotifyApi.searchTracks(query, {
                    limit: 1,
                })
                spotifyTrack = searchData.body.tracks?.items[0]
            }

            let ytVideo
            let ytQuery = query

            if (spotifyTrack) {
                ytQuery = `${spotifyTrack.name} - ${spotifyTrack.artists[0].name}`
            }

            const searchResult = await this.youtubei.search(ytQuery, {
                scope: 'videos',
            })
            ytVideo = searchResult.videos.get({ type: YTNodes.Video })

            if (!ytVideo) {
                logger.debug(
                    `No se encontraron resultados en YouTube para: ${ytQuery}`,
                )
                return null
            }

            // Obtenemos la información completa para metadatos más precisos
            const videoInfo = await this.youtubei.getInfo(ytVideo.id)

            // Si `getInfo` falla por un error de parser, usamos los datos de la búsqueda como respaldo
            if (!videoInfo.basic_info) {
                logger.warn(
                    `No se pudo obtener basic_info para ${ytVideo.id}, usando datos de la búsqueda.`,
                )
                const durationInSeconds = ytVideo.duration.seconds || 0
                return {
                    id: ytVideo.id,
                    title: ytVideo.title.text,
                    author: ytVideo.author.name,
                    duration: durationInSeconds,
                    thumbnails: ytVideo.thumbnails[0]?.url,
                    url: `https://www.youtube.com/watch?v=${ytVideo.id}`,
                    requester: requester,
                    duration_string: new Date(durationInSeconds * 1000)
                        .toISOString()
                        .slice(11, 19),
                }
            }

            const durationInSeconds = videoInfo.basic_info.duration

            // Obtenemos una URL de miniatura de forma segura
            const thumbnailUrl =
                spotifyTrack?.album.images?.[0]?.url ||
                videoInfo.basic_info.thumbnail?.[0]?.url

            return {
                id: ytVideo.id,
                title: videoInfo.basic_info.title,
                author: videoInfo.basic_info.author,
                duration: durationInSeconds, // Devolvemos la duración en SEGUNDOS
                thumbnails: thumbnailUrl, // Devolvemos una única URL de la miniatura
                // --- CAMBIO CRÍTICO PARA LA REPRODUCCIÓN ---
                // Pasamos la URL estándar del vídeo, que es más estable
                url: `https://www.youtube.com/watch?v=${ytVideo.id}`,
                requester: requester,
                duration_string: new Date(durationInSeconds * 1000)
                    .toISOString()
                    .slice(11, 19),
            }
        } catch (error) {
            logger.error('Error en la función de búsqueda:', error)
            client.errorHandler.captureException(error as Error)
            return null
        }
    }

    async createNewPlayer(
        vc: VoiceChannel,
        textChannelId: string,
        volume?: number,
    ): Promise<Player> {
        const player = new Player({
            musicManager: this,
            guild: vc.guild,
            voiceChannel: vc,
            textChannelId: textChannelId,
            innertube: this.youtubei,
            volume: volume,
        })
        this.players.set(vc.guild.id, player)
        return player
    }
}

export function formatDuration(duration: number) {
    if (isNaN(duration) || typeof duration === 'undefined') return '00:00'
    return formatTime(duration, true)
}
