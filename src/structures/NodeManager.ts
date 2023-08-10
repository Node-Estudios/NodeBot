import { Cluster, ClusterManager, fetchRecommendedShards } from 'discord-hybrid-sharding'
import { Collection } from 'discord.js'
import pkg from 'figlet'
import { ShardingClient } from 'statcord.js'
import Logger from '../utils/logger.js'
const { textSync } = pkg

export default class NodeManager extends ClusterManager {
    public commands: any
    public clustersArray: Collection<any, any>
    public players: Collection<any, any>
    public statcord: ShardingClient | undefined
    public logger = Logger

    constructor () {
        super('build/bot.js', {
            totalClusters: 1,
            totalShards: 1,
            mode: 'worker',
            queue: {
                auto: false,
            },
        })

        this.logger.startUp(
            'Iniciando Sistema De Node' +
            '\n' +
            textSync('Node Bot', {
                font: 'Ghost',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 80,
                whitespaceBreak: true,
            }),
        )

        // Función para dividir los shards en bloques
        const chunk = (arr: any[], size: any): any[] =>
            Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size))
        this.clustersArray = new Collection<string, any[]>()
        this.players = new Collection<string, any[]>()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let clusterList: any[]
        if (!process.env.TOKEN) { throw new Error('No pudimos encontrar tu token, asegurate de añadirlo al .env con el nombre de TOKEN!') }

        // Inicializa las colecciones para los clusters de diferentes nodos
        this.clustersArray.set('node', [])
        this.clustersArray.set('customBots', [])
        this.clustersArray.set('node2', [])
        this.clustersArray.set('node3', [])
        this.clustersArray.set('node4', [])

        fetchRecommendedShards(process.env.TOKEN)
            .then((data: number) => {
                // * Crea una lista de shards
                const shardList = [...Array(data).keys()]

                // * Divide los shards en bloques
                clusterList = chunk(shardList, 6)

                this.queue.queue.shift()
                this.totalClusters = 0

                for (let i = this.clusterList.length; i < clusterList.length; i++) {
                    this.totalClusters = (this.totalClusters) + 1

                    const datos: any = {
                        /**
                         * @param {string} botType - Type of the bot
                         * * botType: {
                         * *  1 - Bot Principal
                         * *  2 - Bot de Node 2 / 3 / 4 (opcionales de música)
                         * *  3 - Bot Custom de un usuario que ha comprado la función
                         * * }
                         *
                         * */
                        botType: 1,
                        typeData: {
                            botNumber: 1,

                        },
                    }

                    const cluster = this.createCluster(i, clusterList[i], data);

                    (this.clustersArray.get('node') as any[]).push({
                        id: cluster.id,
                        shardsArray: clusterList[i],
                    })

                    this.queue.add({
                        run: async () => {
                            const cluster = this.clusters.get(i)
                            await cluster?.spawn(1000000, process.env.TOKEN, datos)
                            return await this.queue.next()
                        },
                        args: [],
                        timeout: 10000,
                    })
                }

                // Uncomment and modify the following lines to add more clusters
                // Node 2
                if (process.env.TOKEN_NODE_2) this.createNodeCluster(2, process.env.TOKEN_NODE_2)
                // Node 3
                if (process.env.TOKEN_NODE_3) this.createNodeCluster(3, process.env.TOKEN_NODE_3)
                // Node 4
                if (process.env.TOKEN_NODE_4) this.createNodeCluster(4, process.env.TOKEN_NODE_4)
            })
            .then(() => {
                this.queue.start()
                this.queue.next()
            })

        this.on('debug', (message: any) => {
            this.logger.debug(message)
        })

        this.on('clusterCreate', (cluster: Cluster) => {
            this.logger.startUp(`Launched cluster ${cluster.id}`)
        })
    }

    createNodeCluster (nodeNumber: number, token: string) {
        const chunk = (arr: any[], size: any): any[] =>
            Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size))
        let color
        switch (nodeNumber) {
            case 2:
                color = 'Purple'
                break
            case 3:
                color = 'Orange'
                break
            case 4:
                color = 'Aqua'
                break
        }

        const datos = {
            botType: 2,
            typeData: {
                botNumber: nodeNumber,
                color,
            },
        }

        fetchRecommendedShards(token)
            .then((data: number) => {
                let shardList = [...Array(data).keys()]
                if (data === 1) shardList = [0]
                // * Divide los shards en bloques
                const clusterList = chunk(shardList, 6)

                for (let i = 0; i < clusterList.length; i++) {
                    const clusterIndex = this.totalClusters + 1
                    this.totalClusters = clusterIndex
                    const cluster = this.createCluster(clusterIndex, clusterList[i], data);

                    (this.clustersArray.get(`node${nodeNumber}`) as any[]).push({
                        id: cluster.id,
                        shardsArray: clusterList[i],
                    })

                    this.queue.add({
                        run: async () => {
                            const cluster = this.clusters.get(clusterIndex)
                            await cluster?.spawn(1000000, token, datos)
                            return await this.queue.next()
                        },
                        args: [],
                        timeout: 10000,
                    })
                }
            })
            .catch((err: any) => console.log(err))
    }
}
