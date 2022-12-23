import { init } from '@sentry/node';
import { ClusterClient as HybridClient, getInfo } from 'discord-hybrid-sharding';
import { Collection, Options, Client as client } from 'discord.js';
import interactionCreate from '../events/client/interactionCreate';
import ready from '../events/client/ready';
import Logger from '../utils/console';
import MusicManager from './musicManager';
require('dotenv').config();
const archivo = require('.././lang/index.json');
const fs = require('fs');
const language = fs
    .readFileSync('src/lang/' + archivo.find((language: { default: any }) => language.default).archivo)
    .toString();
export default class Client extends client {
    commands: any;
    buttons: any;
    selectMenu: any;
    messages: any;
    language: any;
    snipes: Map<any, any>;
    logger: Logger;
    // statcordSongs: number;
    config: NodeJS.ProcessEnv;
    devs: string[];
    cluster: HybridClient;
    // customData: data;
    settings: { color: string };
    clusters: Collection<unknown, unknown>;
    music!: MusicManager;
    officialServerURL: string;
    static language: any;
    // ControlSystem: ControlSystem;
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
        });
        this.cluster = new HybridClient(this);
        this.clusters = new Collection();
        this.commands = new Collection();
        this.buttons = new Collection();
        this.selectMenu = new Collection();
        this.messages = new Collection();
        this.language = JSON.parse(language);
        this.snipes = new Map();
        this.officialServerURL = 'https://discord.gg/xhAWYggKKh';
        this.logger = new Logger(
            {
                displayTimestamp: true,
                displayDate: true,
            },
            this,
        );
        // this.logger.time('readyEvent')
        // this.statcordSongs = 0;
        this.config = process.env;
        // this.ControlSystem = new ControlSystem(this);
        this.settings = {
            color: 'GREEN',
        };
        // this.logger.log('testing');
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
            });
            this.logger.log('Connected to Sentry');
        } else this.logger.warn('Sentry dsn missing.');
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
            throw new Error('Add developers to the .env file, expected input (example): devs=123456789,987654321 ');
        this.devs = process.env.devs.split(',');
        try {
            //
            //RUN ALL CLIENT.ON()
            //
            // this.on('debug', debug => {
            //     this.logger.debug('Cluster ' + this.cluster.id + ': ' + debug);
            // });
            // this.cluster.on('TOKEN_INVALID', async (message: any) => {
            //     console.log(message);
            this.once('ready', async () => {
                this.cluster.triggerReady();
                // console.log("test");
                // this.ControlSystem.run();
                new ready().run(this);
            });
            if (process.env.enableCmds == 'true')
                this.on('interactionCreate', async interaction => {
                    new interactionCreate().run(interaction, this);
                });
            this.on('shardReady', async shard => {
                this.logger.info(`Shard ${shard} ready`);
            });
        } catch (e) {
            this.logger.error(e);
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
                this.logger.startUp(`${this.user!.username} logged in`);
                this.cluster.spawnNextCluster();
            });
        } catch (e: any) {
            // this.cluster.spawnNextCluster();
            // console.log('e', e);
            if (e.code == 'TOKEN_INVALID') {
                this.cluster.spawnNextCluster();
            }
            return;
        }
    }
}
