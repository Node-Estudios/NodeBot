import { init } from '@sentry/node'
import { ClusterClient as HybridClient, getInfo } from 'discord-hybrid-sharding'
import { Client as ClientBase, ColorResolvable, GatewayIntentBits, Partials } from 'discord.js'
import events from '../handlers/events.js'
import logger from '../utils/logger.js'
import MusicManager from './MusicManager.js'
export default class Client extends ClientBase<true> {
    devs: string[]
    //@ts-ignores
    cluster = new HybridClient(this)
    settings: { color: ColorResolvable }
    music = new MusicManager()
    officialServerURL: string
    services: { sentry: { loggedIn: boolean } }
    constructor() {
        super({
            partials: [/*Partials.Message,*/ Partials.Channel, Partials.Reaction],
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions],
            allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS,
        })

        this.services = { sentry: { loggedIn: false } }
        this.officialServerURL = 'https://discord.gg/xhAWYggKKh'
        this.settings = {
            color: 'Green',
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
            // * Load Events (./handlers/events.js) ==> ./events/*/* ==> ./cache/events.ts (Collection)
            new events(this)
            return super.login(process.env.TOKEN).then(() => logger.startUp(`${this.user!.username} logged in`))
        } catch (e) {
            if ((e as any).code == 'TOKEN_INVALID') logger.error('Invalid token')
        }
    }
}
