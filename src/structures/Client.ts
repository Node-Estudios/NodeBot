import logger from '#utils/logger.js'
import { ClusterClient as HybridClient, getInfo } from 'discord-hybrid-sharding'
import {
    Client as ClientBase,
    ColorResolvable,
    Colors,
    GatewayIntentBits,
    Options,
    Partials,
} from 'discord.js'
import events from '../events/index.js'
import ErrorManager from '../handlers/antiCrash.js'
// CAMBIO 1: Importa la función loadHandlers
import { loadHandlers } from '../handlers/commands.js'
import { EventHandler } from '../handlers/events.js'
import MusicManager from './MusicManager.js'

interface emoji {
    full: String
    id: String
    name: String
}
export default class Client extends ClientBase<true> {
    devs: string[]
    cluster = new HybridClient(this)
    errorHandler = new ErrorManager(this)
    makeCache = Options.cacheWithLimits({
        ReactionManager: 0,
        ReactionUserManager: 0,
        GuildStickerManager: 0,
        GuildBanManager: 0,
        GuildEmojiManager: 0,
        GuildInviteManager: 0,
        GuildForumThreadManager: 0,
        BaseGuildEmojiManager: 0,
        GuildTextThreadManager: 0,
        GuildMemberManager: 0,
        GuildScheduledEventManager: 0,
        UserManager: {
            maxSize: 40,
            keepOverLimit: member => member.id === this.user.id,
        },
        VoiceStateManager: {
            maxSize: 20,
            keepOverLimit: member => member.id === this.user.id,
        },
    })

    settings: {
        color: ColorResolvable
        mode: 'production' | 'development'
        debug: 'true' | 'false'
        emojis: {
            white: {
                pause: emoji
                play: emoji
                shuffle: emoji
                next: emoji
                repeat_off: emoji
                library: emoji
            }
            blue: {
                shuffle: emoji
                repeat_all: emoji
                repeat_one: emoji
            }
            grey: {}
        }
    } = {
        color: (process.env.COLOR as ColorResolvable) ?? Colors.Green,
        mode: process.env.NODE_ENV,
        debug: process.env.DEBUG_MODE,
        emojis: {
            white: {
                pause: {
                    full: '<:white_pause:1133738854415867966>',
                    id: '113373885441586796g6',
                    name: 'white_pause',
                },
                play: {
                    full: '<:white_play:1133381601565360269>',
                    id: '1133381601565360269',
                    name: 'white_play',
                },
                shuffle: {
                    full: '<:white_shuffle:1133738851672784916>',
                    id: '1133738851672784916',
                    name: 'white_shuffle',
                },
                next: {
                    full: '<:white_next:1133738850162855986>',
                    id: '1133738850162855986',
                    name: 'white_next',
                },
                repeat_off: {
                    full: '<:white_repeat_off:1133896931043721267>',
                    id: '1133896931043721267',
                    name: 'white_repeat_off',
                },
                library: {
                    full: '<:white_library:1133738836858519603>',
                    id: '1133738836858519603',
                    name: 'white_library',
                },
            },
            blue: {
                shuffle: {
                    full: '<:blue_shuffle:1133323554654527540>',
                    id: '1133323554654527540',
                    name: 'blue_shuffle',
                },
                repeat_all: {
                    full: '<:blue_repeat_all:1133323538024104036>',
                    id: '1133323538024104036',
                    name: 'blue_repeat_all',
                },
                repeat_one: {
                    full: '<:blue_repeat_one:1133323549088682056>',
                    id: '1133323549088682056',
                    name: 'blue_repeat_one',
                },
            },
            grey: {},
        },
    }

    music = new MusicManager()
    officialServerURL = 'https://discord.gg/xhAWYggKKh'
    services = {
        sentry: {
            loggedIn: false,
        },
    }

    constructor() {
        super({
            partials: [Partials.Channel, Partials.Reaction],
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessageReactions,
            ],
            allowedMentions: {
                parse: ['users', 'roles'],
                repliedUser: true,
            },
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS,
        })
        if (!process.env.DEVS)
            throw new Error(
                'Add developers to the .env file, expected input (example): devs=123456789,987654321 ',
            )
        this.devs = process.env.DEVS.split(',')
    }

    async init() {
        try {
            // CAMBIO 2: Llama a la función aquí
            await loadHandlers()

            // * Load Events (./handlers/events.js) ==> ./events/*/* ==> ./cache/events.ts (Collection)
            console.log('color:', process.env.color)
            new EventHandler(this).load(events)

            // AÑADE ESTA LÍNEA para ver que el login se inicia
            logger.info('Attempting to log in with Discord token...')

            await super.login(process.env.DISCORD_TOKEN)

            // ESTA LÍNEA SOLO SE EJECUTARÁ SI EL LOGIN TIENE ÉXITO
            logger.startUp(
                `${this.user.username} logged in | Cluster ${this.cluster.id}`,
            )
        } catch (e) {
            // CAMBIA el bloque catch para que registre cualquier error
            logger.error('Failed to log in:', e)
            if ((e as any).code === 'TOKEN_INVALID') {
                logger.error('The provided Discord token is invalid.')
            }
        }
    }
}
