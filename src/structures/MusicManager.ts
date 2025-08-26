// @ts-nocheck
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
import { Innertube, Credentials } from 'youtubei.js' // Removed UniversalCache as it's default
import client from '../bot.js'
import Player from './Player.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import { promises as fs } from 'fs'
import path from 'path'

const CREDENTIALS_PATH = path.join(process.cwd(), 'youtube_credentials.json')

export default class MusicManager extends EventEmitter {
    players = new Collection<string, Player>()
    youtubei: Innertube
    spotifyToken: string | null = null
    spotifyTokenExpiration = 0

    constructor() {
        super()
        this.init()
    }

    // CAMBIO: La inicialización ha sido reescrita para ser más robusta y moderna.
    async init() {
        try {
            // Se crea la instancia de Innertube de la forma recomendada y estable.
            this.youtubei = await Innertube.create()
            logger.info('[YouTube Auth] Cliente de YouTubei inicializado.')

            // Listener para cuando las credenciales se actualizan (ej. token refrescado)
            this.youtubei.session.on(
                'update-credentials',
                async credentials => {
                    await this.saveCredentials(credentials)
                },
            )

            // Listener para cuando se inicia sesión correctamente
            this.youtubei.session.on('auth', async credentials => {
                logger.info(
                    '[YouTube Auth] ¡Inicio de sesión en YouTube exitoso!',
                )
                await this.saveCredentials(credentials)
            })

            // Se intenta cargar las credenciales desde el archivo.
            await this.loadCredentials()
        } catch (error) {
            logger.error(
                '[YouTube Auth] Error fatal al inicializar Innertube:',
                error,
            )
        }
    }

    async saveCredentials(credentials: Credentials) {
        try {
            await fs.writeFile(
                CREDENTIALS_PATH,
                JSON.stringify(credentials, null, 2),
                'utf-8',
            )
            logger.info(
                `[YouTube Auth] Credenciales guardadas/actualizadas en ${CREDENTIALS_PATH}`,
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

            // Se verifica que existan las credenciales y un refresh_token, que es vital.
            if (credentials?.refresh_token) {
                logger.info(
                    '[YouTube Auth] Credenciales encontradas, intentando restaurar sesión...',
                )
                await this.youtubei.session.signIn(credentials)
                logger.info(
                    '[YouTube Auth] Sesión de YouTube restaurada exitosamente.',
                )
            } else {
                // Si el archivo existe pero es inválido.
                logger.warn(
                    '[YouTube Auth] Las credenciales no son válidas. Operando como invitado.',
                )
            }
        } catch (error) {
            // Si el archivo no existe, no es un error, simplemente se opera como invitado.
            if (error.code === 'ENOENT') {
                logger.warn(
                    `[YouTube Auth] No se encontró 'youtube_credentials.json'. Operando como invitado.`,
                )
            } else {
                logger.error(
                    '[YouTube Auth] Error al cargar las credenciales:',
                    error,
                )
            }
        }
    }

    async getSpotifyToken() {
        // ... (Tu código existente aquí, parece correcto)
    }

    // CAMBIO: Se usa youtubei.music.search para mayor consistencia y estabilidad.
    async search(
        query: string,
        requester: User,
    ): Promise<RequesterInjecter<any> | null> {
        try {
            const spotifyTrackRegex =
                /^(https?:\/\/)?(open\.spotify\.com\/track\/)([a-zA-Z0-9]+)/
            const spotifyMatch = query.match(spotifyTrackRegex)

            if (spotifyMatch) {
                // ... (Tu lógica de Spotify parece correcta)
            }

            // Usar la búsqueda de YouTube Music es generalmente más fiable para música.
            const searchResult = await this.youtubei.music.search(query, {
                type: 'video',
            })

            if (!searchResult.results || searchResult.results.length === 0) {
                logger.debug(`No se encontraron videos para: ${query}`)
                return null
            }

            const video = searchResult.results[0]

            return {
                id: video.id,
                title: video.title,
                author:
                    video.artists?.map(a => a.name).join(', ') ??
                    'Unknown Artist',
                duration: video.duration.seconds * 1000, // a ms
                thumbnails: video.thumbnails,
                url: `https://www.youtube.com/watch?v=${video.id}`,
                requester: requester,
                duration_string: new Date(video.duration.seconds * 1000)
                    .toISOString()
                    .slice(11, 19),
            }
        } catch (error) {
            // Este catch ahora manejará el "signature decipher" error si vuelve a ocurrir.
            logger.error('Error en la función de búsqueda:', error)
            client.errorHandler.captureException(error as Error)
            return null
        }
    }

    async createNewPlayer(
        vc: VoiceChannel,
        textChannelId: string,
        volume?: number,
    ) {
        // ... (Tu código existente aquí, parece correcto)
    }

    // ... (El resto de tus funciones como trackPause, trackStart, etc., van aquí sin cambios)
}

export function formatDuration(duration: number) {
    if (isNaN(duration) || typeof duration === 'undefined') return '00:00'
    return formatTime(duration, true)
}
