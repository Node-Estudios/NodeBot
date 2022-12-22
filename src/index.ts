import "dotenv/config";
import Logger from "./utils/console";
import { writeFile } from "fs";
import { ShardingClient } from "statcord.js";
import { init } from "@sentry/node";
import NodeManager from "./structures/manager";
import Cluster from "discord-hybrid-sharding";

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

writeFile("test.txt", "0", function (err) {
  if (err) {
    return console.log(err);
  }
});

// manager.on('shardCreate', cluster => Logger.debug(`Launched cluster ${cluster.id}`));

manager.spawn();
