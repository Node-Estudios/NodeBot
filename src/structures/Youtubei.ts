import { Collection, GuildMember, Message } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import Music from 'youtubei.js/dist/src/core/clients/Music.js'
import { SpamIntervalDB } from './spamInterval.js'
import { Session, Innertube, Credentials } from 'youtubei.js'
import logger from '#utils/logger.js'
import { db } from 'src/prisma/db.js'
import { encrypt } from '#utils/encrypt.js'

const spamInterval = new SpamIntervalDB()
type UserExtended = GuildMember & {
    youtubei: Youtubei
}

export default class Youtubei {
    youtubeCodes = new Collection<string, UserExtended>()
    spamInterval = spamInterval
    user: UserExtended
    music!: Music
    session!: Session

    constructor(user: UserExtended) {
        this.user = user
    }

    async createSession() {
        const innertube = await Innertube.create({
            // cache: new UniversalCache()
        })
        this.music = innertube.music
        this.session = innertube.session
        await this.start()
        return this
    }

    get() {
        return this
    }

    async start() {
        this.startListeners()
    }

    private async sendSpamMSG(user: UserExtended, msg: Message) {}

    private async checkUserSpamInterval(user: UserExtended) {
        if (!this.spamInterval.checkUser(user.id)) {
            const embed = new EmbedBuilder().setDescription(
                'Has iniciado sesión correctamente. Node ya tiene acceso para ver tus canciones favoritas! Si deseas revocar este acceso, puedes hacerlo desde [este link de google](https://myaccount.google.com/permissions)',
            )
            this.spamInterval.addUser(user.id, 7 * 24 * 60 * 60 * 1000)
            return await user.send({ embeds: [embed] }).catch(e => {
                logger.error(e)
            })
        }
    }

    async upsertCredentials({ credentials }: { credentials: Credentials }) {
        const user = await db.user.findFirst({
            where: { id: this.user.id },
            // Only get users.credentials.id for check if exist
            select: { user_credentials: { select: { id: true } } },
        })

        if (!user) await db.user.create({ data: { id: this.user.id } })
        if (!user?.user_credentials)
            return await db.userCredentials.create({
                data: {
                    access_token: await encrypt(credentials.access_token),
                    expires: credentials.expires,
                    refresh_token: await encrypt(credentials.refresh_token),
                    user_id: this.user.id,
                },
            })

        return await db.userCredentials.update({
            where: { user_id: this.user.id },
            data: {
                access_token: await encrypt(credentials.access_token),
                expires: credentials.expires,
                refresh_token: await encrypt(credentials.refresh_token),
            },
        })
    }

    async startListeners() {
        logger.debug('Starting listeners YTi')
        // Espera a que el objeto "player" esté disponible y luego accede a la propiedad "youtubei"
        this.session.on(
            'auth-pending',
            (data: { user_code: any; verification_url: any }) => {
                // Imprime un mensaje de depuración
                logger.debug('auth pending')
                // Verifica si el usuario ha superado el límite de tiempo para enviar mensajes
                if (!this.spamInterval.checkUser(this.user.id)) {
                    this.youtubeCodes.set(data.user_code, this.user)
                    // Crea un objeto "EmbedBuilder" y establece la descripción y los campos del mensaje
                    const embed = new EmbedBuilder()
                        .setDescription(
                            'It seems like you dont sign in using Youtube, would you like to?',
                        )
                        .addFields([
                            {
                                name: `Sign in with youtube in the next link; Use code: ${data.user_code}`,
                                value: data.verification_url,
                            },
                        ])
                    // Añade el usuario al registro de spamInterval y establece el intervalo de tiempo en 30 minutos
                    this.spamInterval.addUser(this.user.id, 30 * 60 * 1000)
                    // Envía el mensaje al usuario a través de un mensaje privado
                    this.user.send({ embeds: [embed] }).catch(e => {
                        // Si hay un problema al enviar el mensaje privado, envía un mensaje en el canal de texto especificado
                        logger.error(e)
                    })
                }
            },
        )

        // Espera a que el objeto "player" esté disponible y luego accede a la propiedad "youtubei"
        // Define un manejador de evento para el evento "update-credentials" en la sesión de YouTubeI
        this.session.on('update-credentials', async ({ credentials }) =>
            this.upsertCredentials({ credentials }),
        )
        // Define un manejador de evento para el evento "auth" en la sesión de YouTubeI
        this.session.on('auth', async ({ credentials }) => {
            logger.debug('iniciado sesión correctamente')
            // Busca un documento en la base de datos que coincida con el ID del usuario
            this.upsertCredentials({
                credentials: {
                    access_token: await encrypt(credentials.access_token),
                    refresh_token: await encrypt(credentials.refresh_token),
                    expires: new Date(
                        Date.now() + credentials.expires.getTime(),
                    ),
                },
            })
            // await this.session?.oauth.cacheCredentials();
            // Imprime un mensaje de depuración
            // logger.debug('Sign in successful: ', credentials);
            // Crea un objeto "EmbedBuilder" y establece la descripción del mensaje
            if (!this.spamInterval.checkUser(this.user.id)) {
                const embed = new EmbedBuilder().setDescription(
                    'Has iniciado sesión correctamente. Node ya tiene acceso para ver tus canciones favoritas! Si deseas revocar este acceso, puedes hacerlo desde [este link de google](https://myaccount.google.com/permissions)',
                )
                this.spamInterval.addUser(this.user.id, 7 * 24 * 60 * 60 * 1000)
                return await this.user
                    .send({ embeds: [embed] })
                    .catch(logger.error)
            }
        })
    }
}
