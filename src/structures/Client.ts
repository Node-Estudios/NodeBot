const defaultLang = await import('../lang/' + langFile.find(l => l.default)?.archivo)
import { ClusterClient as HybridClient, getInfo } from 'discord-hybrid-sharding'
import { Collection, Options, Client as ClientBase } from 'discord.js'
import langFile from '../lang/index.json' assert { type: 'json' }
import MusicManager from './musicManager.js'
import ready from '../events/client/ready'
import logger from '../utils/logger.js'
import { init } from '@sentry/node'
export default class Client extends ClientBase<true> {
    buttons: any
    selectMenu: any
    messages: any
    language = defaultLang.default
    snipes: Map<any, any>
    config: NodeJS.ProcessEnv
    devs: string[]
    cluster: HybridClient
    settings: { color: string }
    clusters: Collection<unknown, unknown>
    music = new MusicManager(this)
    officialServerURL: string
    services: { sentry: { loggedIn: boolean } }
    constructor() {
        super({
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
            intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGE_REACTIONS'],
            allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
            messageCacheLifetime: 60,
            retryLimit: 2,
            makeCache: Options.cacheWithLimits({
                UserManager: {
                    maxSize: 50,
                    keepOverLimit: (value: any) => value.id === value.client.user.id,
                },
                MessageManager: {
                    maxSize: 100,
                },
            }),
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS,
        })
        // @ts-ignore
        this.cluster = new HybridClient(this)
        this.clusters = new Collection()

        this.buttons = new Collection()
        this.services = { sentry: { loggedIn: false } }
        this.selectMenu = new Collection()
        this.messages = new Collection()
        this.snipes = new Map()
        this.officialServerURL = 'https://discord.gg/xhAWYggKKh'
        // this.statcordSongs = 0;
        this.config = process.env
        // this.ControlSystem = new ControlSystem(this);
        this.settings = {
            color: 'GREEN',
        }
        // this.cluster.evalOnManager(`this.clustersArray`).then((data: Map<any, any> | any) => {
        //     console.log('data: ', data);
        // });
        // this.cluster.addListener('fetchGuild', (msg: any) => {
        //     console.log(msg);
        // });

        if (process.env.SENTRY_DSN && process.env.NODE_ENV == 'production') {
            init({
                dsn: process.env.SENTRY_DSN,
                environment: process.env.NODE_ENV,
                tracesSampleRate: 0.5,
            })
            this.services.sentry.loggedIn = true
            logger.log('Connected to Sentry')
        } else logger.warn('Sentry dsn missing.')
        // if ((this.customData as any).botType == 1) {
        //     this.clusters.set('node', []);
        //     (this.clusters.get('node') as Array<any>).push(this.cluster);
        // }
        // // console.log((this.customData as any).typeData.botNumber);
        // if ((this.customData as any).botType == 2) {
        //     if ((this.customData as any).typeData.botNumber == '2') this.clusters.set('node2', this.cluster);
        //     else if ((this.customData as any).typeData.botNumber == '3') this.clusters.set('node3', this.cluster);
        //     else if ((this.customData as any).typeData.botNumber == '4') this.clusters.set('node4', this.cluster);
        // }
        // console.log();
        // console.log(this.clusters)
        // lo de content debe estar obligatoriamente, podemos cmambiar lo otro sin problemas.
        // en vez de .request no sería .send?
        // .request es si necesitamos recibir una respuesta del manager, si lo hacemos con .send solo lo enviamos y no hace falta recibir respuesta, con .request nos obliga a enviar respuesta de vuelta
        // por eso en el .request está el .then
        // this.cluster
        //     .send({
        //         content: {
        //             type: 'music',
        //             data: {
        //                 command: 'play',
        //                 data: {
        //                     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        //                     member: {
        //                         id: '123456789',
        //                         username: 'test',
        //                         tag: '4537',
        //                         avatarURL:
        //                             'https://cdn.discordapp.com/avatars/123456789/abcdefghijklmnopqrstuvwxyz.png',
        //                         voice: {
        //                             channel: {
        //                                 id: '123456789',
        //                             },
        //                             id: '123456789',
        //                         },
        //                     },
        //                     guild: {
        //                         id: '123456789',
        //                         name: 'test',
        //                     },
        //                     channel: {
        //                         id: '123456789',
        //                     },
        //                 },
        //                 //pasemos los datos justos que sean necesarios solo
        //                 //para testear, quiero recibir un mensaje de prueba y definir el esquema del json
        //                 //sabes los datos que hacen falta para crear el player o te los pongo yo?
        //                 //por
        //                 //pone todos los que sen necesarios
        //             },
        //         },
        //     })
        //     .then(data => {
        //         console.log(data);
        //     });
        if (!process.env.devs)
            throw new Error('Add developers to the .env file, expected input (example): devs=123456789,987654321 ')
        this.devs = process.env.devs.split(',')
        try {
            this.on('shardReady', async shard => {
                logger.info(`Shard ${shard} ready`)
            })
        } catch (e) {
            logger.error(e)
        }
        // this.cluster.on('message', message => {
        //     console.log(message);
        // });
    }
    async Login() {
        try {
            // console.log(data.DISCORD_TOKEN);
            // this.cluster.spawnNextCluster();
            // this.cluster.triggerReady();
            //@ts-ignore
            super.login(process.env.TOKEN).then(() => {
                logger.startUp(`${this.user!.username} logged in`)
                // this.cluster.spawnNextCluster()
            })
        } catch (e: any) {
            // this.cluster.spawnNextCluster();
            // console.log('e', e);
            if (e.code == 'TOKEN_INVALID') {
                logger.error('Invalid token')
                // this.cluster.spawnNextCluster()
            }
            return
        }
    }
    formatTime(inputSeconds: number, complete: boolean = false) {
        if (complete) {
            const Days = Math.floor(inputSeconds / (60 * 60 * 24))
            const Hour = Math.floor((inputSeconds % (60 * 60 * 24)) / (60 * 60))
            const Minutes = Math.floor(((inputSeconds % (60 * 60 * 24)) % (60 * 60)) / 60)
            const Seconds = Math.floor(((inputSeconds % (60 * 60 * 24)) % (60 * 60)) % 60)
            let ddhhmmss = ''
            if (Days > 0 && Days != 1) {
                ddhhmmss += Days + 'd '
            } else if (Days === 1) {
                ddhhmmss += Days + 'd '
            }
            if (Hour > 0 && Hour != 1) {
                ddhhmmss += Hour + 'h '
            } else if (Hour === 1) {
                ddhhmmss += Hour + 'h '
            }
            if (Minutes > 0 && Minutes != 1) {
                ddhhmmss += Minutes + 'm '
            } else if (Minutes === 1) {
                ddhhmmss += Minutes + 'm '
            }
            if (Seconds > 0 && Seconds != 1) {
                ddhhmmss += Seconds + 's'
            } else if (Seconds === 1) {
                ddhhmmss += Seconds + 's'
            }
            return ddhhmmss
        } else {
            const Days = Math.floor(inputSeconds / (60 * 60 * 24))
            const Hour = Math.floor((inputSeconds % (60 * 60 * 24)) / (60 * 60))
            const Minutes = Math.floor(((inputSeconds % (60 * 60 * 24)) % (60 * 60)) / 60)
            const Seconds = Math.floor(((inputSeconds % (60 * 60 * 24)) % (60 * 60)) % 60)
            let ddhhmmss = ''
            if (Days > 0 && Days != 1) {
                ddhhmmss += Days + ' Días '
            } else if (Days === 1) {
                ddhhmmss += Days + ' Día '
            }
            if (Hour > 0 && Hour != 1) {
                ddhhmmss += Hour + ' Horas '
            } else if (Hour === 1) {
                ddhhmmss += Hour + ' Hora '
            }
            if (Minutes > 0 && Minutes != 1) {
                ddhhmmss += Minutes + ' Minutos '
            } else if (Minutes === 1) {
                ddhhmmss += Minutes + ' Minuto '
            }
            if (Seconds > 0 && Seconds != 1) {
                ddhhmmss += Seconds + ' Segundos'
            } else if (Seconds === 1) {
                ddhhmmss += Seconds + ' Segundo'
            }
            return ddhhmmss
        }
    }
}
