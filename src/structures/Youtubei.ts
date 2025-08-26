// src/structures/Youtubei.ts

import { Collection, GuildMember, Message } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import { SpamIntervalDB } from './spamInterval.js'
import * as YouTubeiJS from 'youtubei.js'
import logger from '#utils/logger.js'
import { db } from 'src/prisma/db.js'
import { encrypt } from '#utils/encrypt.js'

// CAMBIO 1: Se define un tipo explícito para las credenciales.
interface Credentials {
    access_token: string
    refresh_token?: string | null
    expires: Date
}

// Se obtiene el tipo de la instancia de Innertube.
type Innertube = Awaited<ReturnType<typeof YouTubeiJS.Innertube.create>>

const spamInterval = new SpamIntervalDB()
type UserExtended = GuildMember & {
    youtubei: Youtubei
}

export default class Youtubei {
    youtubeCodes = new Collection<string, UserExtended>()
    spamInterval = spamInterval
    user: UserExtended
    music!: Innertube['music']
    session!: Innertube['session']

    constructor(user: UserExtended) {
        this.user = user
    }

    async createSession() {
        const innertube = await YouTubeiJS.Innertube.create()
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

    // CAMBIO 2: Se usa nuestra interfaz 'Credentials' definida localmente.
    async upsertCredentials({ credentials }: { credentials: Credentials }) {
        const user = await db.user.findFirst({
            where: { id: this.user.id },
            select: { user_credentials: { select: { id: true } } },
        })

        if (!user) await db.user.create({ data: { id: this.user.id } })

        const expires =
            credentials.expires ?? new Date(Date.now() + 3600 * 1000)

        if (!user?.user_credentials)
            return await db.userCredentials.create({
                data: {
                    access_token: await encrypt(credentials.access_token),
                    expires: expires,
                    refresh_token: await encrypt(
                        credentials.refresh_token ?? '',
                    ),
                    user_id: this.user.id,
                },
            })

        return await db.userCredentials.update({
            where: { user_id: this.user.id },
            data: {
                access_token: await encrypt(credentials.access_token),
                expires: expires,
                refresh_token: await encrypt(credentials.refresh_token ?? ''),
            },
        })
    }

    async startListeners() {
        logger.debug('Starting listeners YTi')
        this.session.on(
            'auth-pending',
            (data: { user_code: any; verification_url: any }) => {
                logger.debug('auth pending')
                if (!this.spamInterval.checkUser(this.user.id)) {
                    this.youtubeCodes.set(data.user_code, this.user)
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
                    this.spamInterval.addUser(this.user.id, 30 * 60 * 1000)
                    this.user.send({ embeds: [embed] }).catch(e => {
                        logger.error(e)
                    })
                }
            },
        )

        // CAMBIO 3: Se añade 'as any' para evitar el conflicto de tipos de la librería.
        this.session.on('update-credentials', async ({ credentials }) =>
            this.upsertCredentials({ credentials: credentials as any }),
        )
        this.session.on('auth', async ({ credentials }) => {
            logger.debug('iniciado sesión correctamente')
            this.upsertCredentials({
                credentials: credentials as any,
            })
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
