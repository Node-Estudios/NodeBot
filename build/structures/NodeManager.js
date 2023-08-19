import { ClusterManager, fetchRecommendedShards } from 'discord-hybrid-sharding';
import { Collection } from 'discord.js';
import pkg from 'figlet';
import Logger from '../utils/logger.js';
const { textSync } = pkg;
export default class NodeManager extends ClusterManager {
    commands;
    clustersArray;
    players;
    statcord;
    logger = Logger;
    constructor() {
        super('build/bot.js', {
            totalClusters: 1,
            totalShards: 1,
            mode: 'worker',
            queue: {
                auto: false,
            },
        });
        this.logger.startUp('Iniciando Sistema De Node' +
            '\n' +
            textSync('Node Bot', {
                font: 'Ghost',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 80,
                whitespaceBreak: true,
            }));
        const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
        this.clustersArray = new Collection();
        this.players = new Collection();
        let clusterList;
        if (!process.env.TOKEN)
            throw new Error('No pudimos encontrar tu token, asegurate de añadirlo al .env con el nombre de TOKEN!');
        this.clustersArray.set('node', []);
        this.clustersArray.set('customBots', []);
        this.clustersArray.set('node2', []);
        this.clustersArray.set('node3', []);
        this.clustersArray.set('node4', []);
        fetchRecommendedShards(process.env.TOKEN)
            .then((data) => {
            const shardList = [...Array(data).keys()];
            clusterList = chunk(shardList, 2);
            this.queue.queue.shift();
            this.totalClusters = 0;
            for (let i = this.clusterList.length; i < clusterList.length; i++) {
                this.totalClusters = (this.totalClusters) + 1;
                const datos = {
                    botType: 1,
                    typeData: {
                        botNumber: 1,
                    },
                };
                const cluster = this.createCluster(i, clusterList[i], data);
                this.clustersArray.get('node').push({
                    id: cluster.id,
                    shardsArray: clusterList[i],
                });
                this.queue.add({
                    run: async () => {
                        const cluster = this.clusters.get(i);
                        await cluster?.spawn(1000000, process.env.TOKEN, datos);
                        return await this.queue.next();
                    },
                    args: [],
                    timeout: 10000,
                });
            }
            if (process.env.TOKEN_NODE_2)
                this.createNodeCluster(2, process.env.TOKEN_NODE_2);
            if (process.env.TOKEN_NODE_3)
                this.createNodeCluster(3, process.env.TOKEN_NODE_3);
            if (process.env.TOKEN_NODE_4)
                this.createNodeCluster(4, process.env.TOKEN_NODE_4);
        })
            .then(() => {
            this.queue.start();
            this.queue.next();
        });
        this.on('debug', (message) => {
            this.logger.debug(message);
        });
        this.on('clusterCreate', (cluster) => {
            this.logger.startUp(`Launched cluster ${cluster.id}`);
        });
    }
    createNodeCluster(nodeNumber, token) {
        const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
        let color;
        switch (nodeNumber) {
            case 2:
                color = 'Purple';
                break;
            case 3:
                color = 'Orange';
                break;
            case 4:
                color = 'Aqua';
                break;
        }
        const datos = {
            botType: 2,
            typeData: {
                botNumber: nodeNumber,
                color,
            },
        };
        fetchRecommendedShards(token)
            .then((data) => {
            let shardList = [...Array(data).keys()];
            if (data === 1)
                shardList = [0];
            const clusterList = chunk(shardList, 2);
            for (let i = 0; i < clusterList.length; i++) {
                const clusterIndex = this.totalClusters + 1;
                this.totalClusters = clusterIndex;
                const cluster = this.createCluster(clusterIndex, clusterList[i], data);
                this.clustersArray.get(`node${nodeNumber}`).push({
                    id: cluster.id,
                    shardsArray: clusterList[i],
                });
                this.queue.add({
                    run: async () => {
                        const cluster = this.clusters.get(clusterIndex);
                        await cluster?.spawn(1000000, token, datos);
                        return await this.queue.next();
                    },
                    args: [],
                    timeout: 10000,
                });
            }
        })
            .catch((err) => console.log(err));
    }
}
//# sourceMappingURL=NodeManager.js.map