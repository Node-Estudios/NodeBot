import { Collection, EmbedBuilder, GuildMember, Message } from 'discord.js'
import Music from 'youtubei.js/dist/src/core/clients/Music.js'
import { spamIntervalDB } from './spamInterval.js'
import { Session, Innertube } from 'youtubei.js'
import UserModel from '../models/user.js'
import logger from '../utils/logger.js'
let spamInterval = new spamIntervalDB()
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
            return user.send({ embeds: [embed] }).catch(e => {
                logger.error(e)
            })
        }
    }
    async startListeners() {
        logger.debug('Starting listeners YTi')
        let user = this.user
        //Espera a que el objeto "player" esté disponible y luego accede a la propiedad "youtubei"
        this.session!.on('auth-pending', (data: { user_code: any; verification_url: any }) => {
            // Imprime un mensaje de depuración
            logger.debug('auth pending')
            // Verifica si el usuario ha superado el límite de tiempo para enviar mensajes
            if (!this.spamInterval.checkUser(user.id)) {
                this.youtubeCodes.set(data.user_code, user)
                // Crea un objeto "EmbedBuilder" y establece la descripción y los campos del mensaje
                const embed = new EmbedBuilder()
                    .setDescription(`It seems like you dont sign in using Youtube, would you like to?`)
                    .addFields([
                        {
                            name: `Sign in with youtube in the next link; Use code: ${data.user_code}`,
                            value: data.verification_url,
                        },
                    ])
                // Añade el usuario al registro de spamInterval y establece el intervalo de tiempo en 30 minutos
                this.spamInterval.addUser(user.id, 30 * 60 * 1000)
                // Envía el mensaje al usuario a través de un mensaje privado
                user.send({ embeds: [embed] }).catch(e => {
                    // Si hay un problema al enviar el mensaje privado, envía un mensaje en el canal de texto especificado
                    logger.error(e)
                })
            }
        })

        // Espera a que el objeto "player" esté disponible y luego accede a la propiedad "youtubei"
        // Define un manejador de evento para el evento "update-credentials" en la sesión de YouTubeI
        this.session!.on('update-credentials', ({ credentials }: any) => {
            // Busca un documento en la base de datos que coincida con el ID del usuario
            UserModel.findOne({ id: user.id }).then(async (user2: any) => {
                // Si se encuentra un documento, actualiza las credenciales y lo guarda
                if (user2) {
                    user2.credentials = credentials
                    return await user2.save()
                    // Si no se encuentra un documento, crea uno nuevo con el ID del usuario, las credenciales y algunas propiedades predeterminadas
                } else {
                    return await UserModel.create({
                        id: user.id,
                        executedCommands: 0,
                        roles: { Developer: { enabled: false }, Tester: { enabled: false }, credentials: credentials },
                    })
                }
            })
        })
        // Define un manejador de evento para el evento "auth" en la sesión de YouTubeI
        this.session!.on('auth', async ({ credentials }: any) => {
            logger.debug('iniciado sesión correctamente')
            // Busca un documento en la base de datos que coincida con el ID del usuario
            UserModel.findOne({ id: user.id }).then(async (user2: any) => {
                credentials.expires_at = Date.now() + credentials.expires_in * 1000
                // Si se encuentra un documento, actualiza las credenciales y lo guarda
                if (user2) {
                    user2.credentials = credentials
                    return await user2.save()
                    // Si no se encuentra un documento, crea uno nuevo con el ID del usuario, las credenciales y algunas propiedades predeterminadas
                } else {
                    return await UserModel.create({
                        id: user.id,
                        executedCommands: 0,
                        roles: { Developer: { enabled: false }, Tester: { enabled: false }, credentials: credentials },
                    })
                }
            })
            // await this.session?.oauth.cacheCredentials();
            // Imprime un mensaje de depuración
            // logger.debug('Sign in successful: ', credentials);
            // Crea un objeto "EmbedBuilder" y establece la descripción del mensaje
            if (!this.spamInterval.checkUser(user.id)) {
                const embed = new EmbedBuilder().setDescription(
                    'Has iniciado sesión correctamente. Node ya tiene acceso para ver tus canciones favoritas! Si deseas revocar este acceso, puedes hacerlo desde [este link de google](https://myaccount.google.com/permissions)',
                )
                this.spamInterval.addUser(user.id, 7 * 24 * 60 * 60 * 1000)
                return user.send({ embeds: [embed] }).catch(e => {
                    logger.error(e)
                })
            } else return
        })
    }
}
