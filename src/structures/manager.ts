import { Cluster, HeartbeatManager, ClusterManager } from 'discord-hybrid-sharding'
import { textSync } from 'figlet'
import { ShardingClient } from 'statcord.js'
import logger from '../utils/logger.js'
import RESTAPI from './restAPIHandler.js'
export default class NodeManager extends ClusterManager {
    public commands: any
    // public clustersArray: Collection<any, any>;
    // public players: Collection<any, any>;
    public statcord: ShardingClient | undefined

    constructor() {
        super(`build/bot.js`, {
            totalClusters: 'auto',
            shardsPerClusters: 5,
            totalShards: 'auto',
            mode: 'worker',
            token: process.env.TOKEN,
        })

        // * Crea un nuevo objeto de la clase Logger para mejorar la salida en la consola

        logger.startUp(
            'Iniciando Sistema De Node' +
                '\n' +
                textSync('Node Bot', {
                    font: 'Ghost', // Fuente de la consola
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                    width: 80,
                    whitespaceBreak: true,
                }),
        )

        // // * Función para dividir los shards en bloques
        // const chunk = (arr: Array<any>, size: any): Array<any> =>
        //     Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
        // this.clustersArray = new Collection<string, Array<any>>();
        // this.players = new Collection<string, Array<any>>();
        // let clusterList: Array<any>;
        // if (!process.env.TOKEN)
        //     throw new Error('No pudimos encontrar tu token, asegurate de añadirlo al .env con el nombre de TOKEN!');

        // // * Inicializa las colecciones para los clusters de diferentes nodos
        // this.clustersArray.set('node', []);
        // this.clustersArray.set('customBots', []);
        // this.clustersArray.set('node2', []);
        // this.clustersArray.set('node3', []);
        // this.clustersArray.set('node4', []);

        // // * Obtiene la cantidad recomendada de shards
        // Util.fetchRecommendedShards(process.env.TOKEN)
        //     .then(data => {
        //         // * Crea una lista de shards
        //         let shardList = [...Array(data).keys()];

        //         // * Divide los shards en bloques
        //         clusterList = chunk(shardList, 10);

        //         this.queue.queue.shift();
        //         this.totalClusters = 0;

        //         for (let i = this.clusterList.length; i < clusterList.length; i++) {
        //             this.totalClusters = (this.totalClusters as number) + 1;

        //             // const datos: any = {
        //             //     /**
        //             //      * @param {string} botType - Type of the bot
        //             //      * * botType: {
        //             //      * *  1 - Bot Principal
        //             //      * *  2 - Bot de Node 2 / 3 / 4 (opcionales de música)
        //             //      * *  3 - Bot Custom de un usuario que ha comprado la función
        //             //      * * }
        //             //      *
        //             //      * */
        //             //     botType: 1,
        //             //     typeData: {
        //             //         botNumber: 1,
        //             //     },
        //             // };

        //             const cluster = this.createCluster(i, clusterList[i], data);

        //             (this.clustersArray.get('node') as Array<any>).push({
        //                 id: cluster.id,
        //                 shardsArray: clusterList[i],
        //             });

        //             this.queue.add({
        //                 run: () => {
        //                     const cluster = this.clusters.get(i);
        //                     return cluster!.spawn(1000000, process.env.TOKEN);
        //                 },
        //                 args: [],
        //                 timeout: 10000,
        //             });
        //         }
        //         return clusterList;
        //     })
        //     .then(() => {
        //         console.log(this.queue);
        //         this.queue.start().then(() => {});
        //         this.queue.next();
        //     });
        // const getAvalibleBot = () => {
        //     this.clusters.get(0);
        // };
        // this.on('debug', (message: any) => {
        //     logger.debug(message);
        // });
        // let numClustersReady = 0 - this.totalClusters * 2 + this.totalClusters
        this.extend(
            new HeartbeatManager({
                interval: 2000, // Interval to send a heartbeat
                maxMissedHeartbeats: 5, // Maximum amount of missed Heartbeats until Cluster will get respawned
            }),
        )
        this.on('debug', logger.debug)
        // if (numClustersReady == this.totalClusters)
        RESTAPI(this)
        this.on('clusterReady', (cluster: Cluster) => logger.startUp(`Cluster ${cluster.id} is ready!`))
        this.on('clusterCreate', (cluster: Cluster) => {
            // cluster.on('message', (message: any) => {
            // logger.debug("totalClusters: ", this.totalClusters)
            // logger.log("message received: ", cluster.eval('client.user.tag'))
            /**
             * * STATUS QUE PUEDES RECIVIR DE VUELTA:
             * * 200: EVERTYHTING IS OKEY, THE REQUEST WAS SUCCESSFULLY EXECUTED
             * * 400: BAD REQUEST, THE REQUEST WAS NOT SUCCESSFULLY EXECUTED
             * * 404: NOT FOUND, THE REQUEST WAS NOT SUCCESSFULLY EXECUTED
             */
            // new IPChandler(cluster, message, this, logger)
            // });

            logger.startUp(`Launched cluster ${cluster.id}`)
        })
    }
}
