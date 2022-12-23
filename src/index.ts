import 'dotenv/config';
import NodeManager from './structures/manager';

// const {
//     ClusterManager
// } = require('discord.js-cluster');

const manager = new NodeManager();
// const manager = new ClusterManager('./bot.js', {
//     token: process.env.TOKEN,
//     totalShards: "auto",
//     totalClusters: "auto",
//     mode: 'worker',
// });
// manager.on('shardCreate', cluster => Logger.debug(`Launched cluster ${cluster.id}`));

manager.spawn();
