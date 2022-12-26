const defaultLang = await import('../lang/' + langFile.find(l => l.default)?.archivo)
import { ClusterClient as HybridClient, getInfo } from 'discord-hybrid-sharding'
import { Collection, Options, Client as ClientBase, ColorResolvable } from 'discord.js'
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
    config: NodeJS.ProcessEnv
    devs: string[]
    //@ts-ignores
    cluster = new HybridClient(this)
    settings: { color: ColorResolvable }
    clusters = new Collection<string, unknown>()
    music = new MusicManager()
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

        this.buttons = new Collection()
        this.services = { sentry: { loggedIn: false } }
        this.selectMenu = new Collection()
        this.officialServerURL = 'https://discord.gg/xhAWYggKKh'
        this.config = process.env
        this.settings = {
            color: 'GREEN',
        }

        if (process.env.SENTRY_DSN && process.env.NODE_ENV == 'production') {
            init({
                dsn: process.env.SENTRY_DSN,
                environment: process.env.NODE_ENV,
                tracesSampleRate: 0.5,
            })
            this.services.sentry.loggedIn = true
            logger.log('Connected to Sentry')
        } else logger.warn('Sentry dsn missing.')
        if (!process.env.devs)
            throw new Error('Add developers to the .env file, expected input (example): devs=123456789,987654321 ')
        this.devs = process.env.devs.split(',')
    }
    async init() {
        try {
            return super.login(process.env.TOKEN).then(() => logger.startUp(`${this.user!.username} logged in`))
        } catch (e) {
            if ((e as any).code == 'TOKEN_INVALID') logger.error('Invalid token')
        }
    }
}
