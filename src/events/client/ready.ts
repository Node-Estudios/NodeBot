const Event = require('../../structures/event');
import Client from '../../structures/client';
import { connect } from 'mongoose'
import MusicManager from './../../structures/musicManager';
import 'dotenv/config';
import { listenerCount } from 'process';
export default class ready {
    constructor() { }

    async run(client: Client) {
        // const cmds = await customCmdModel.find({});
        // cmds.forEach(async (cmd: { guildId: any; name: any; description: any }) => {
        // })
        // const guild = client.guilds.cache.get(cmd.guildId);

        //   guild?.commands.create({
        //     name: cmd.name,
        //     description: cmd.description,
        //   });
        // });

        //    await customCommand.delete();
        // const command = await interaction.guild.commands.cache.find (
        // (cmd) => cmd.name
        // commandName
        // );
        // await interaction.guild.commands.delete(command.id);

        //* ADD DATABASE CONNECTION
        if (process.env.mongoURL)
            connect(process.env.mongoURL?.toString(), {
                // @ts-ignore
                useUnifiedTopology: true,
                useNewUrlParser: true,
            }).then(() => client.logger.db('Se ha conectado la base de datos correctamente.'));
        client.music = new MusicManager(client);
        let result: any[]
        try {
            const promises = [
                client.cluster.broadcastEval((c: { guilds: { cache: { size: any; }; }; }) => { c.guilds.cache.size }),
                client.cluster.broadcastEval((c) => c.guilds.cache.reduce((prev: any, guild: { memberCount: any; }) => prev + guild.memberCount, 0)),
            ];

            const shardInfo = await client.cluster.broadcastEval((c: any) => ({
                clustersCount: c.cluster,
                clusterId: c.cluster.id,
                internalClusterShards: c.cluster.ids,
                guilds: c.guilds.cache.size,
                channels: c.channels.cache.size,
                members: c.guilds.cache.reduce((prev: any, guild: { memberCount: any; }) => prev + guild.memberCount, 0),
                memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                players: c.music.players.size,
                playingPlayers: c.music.players.filter((p: { playing: any; }) => p.playing).size,
                ping: c.ws.ping,
            }));

            let totalPlayers = 0;
            let totalPlayingPlayers = 0;
            client.logger.debug(shardInfo)
            for (let n = 0; n < shardInfo.length / 15; n++) {
                const shardArray = shardInfo.slice(n * 15, n * 15 + 15);
                Promise.all(promises).then(async results => {
                    let totalMemory = 0;
                    shardArray.forEach((s: { memoryUsage: string; }) => (totalMemory += parseInt(s.memoryUsage)));
                    let totalChannels = 0;
                    shardArray.forEach((s: { channels: string; }) => (totalChannels += parseInt(s.channels)));
                    let avgLatency = 0;
                    shardArray.forEach((s: { ping: number; }) => (avgLatency += s.ping));
                    avgLatency = avgLatency / shardArray.length;
                    avgLatency = Math.round(avgLatency);
                    const totalGuilds = results[0].reduce((prev: any, guildCount: any) => prev + guildCount, 0);
                    const totalMembers = results[1].reduce((prev: any, memberCount: any) => prev + memberCount, 0);
                    result.push({ totalChannels, totalGuilds, totalMembers, totalMemory, avgLatency, totalPlayers, totalPlayingPlayers, shardInfo })
                });
            }
        } catch (e) {
            client.logger.error(e)
        }
        client.cluster.on('message', async (message) => {
            // client.logger.debug(client.cluster.broadcastEval((c: any) => c.guilds.cache.size))
            // client.ws.client.shard?.broadcastEval((c: any) => c.guilds.cache.size).then((data: any) => {
            //     console.log(data)
            // })
            if (message.content = "statistics" && message._sRequest && !message._sReply) {

                message.reply({ content: result })
            }
        })
        client.logger.debug(`${client.user!.username} ✅`);
        Promise.resolve(true);
        // new CreateManager(client).then(() => {
        //   client.on("raw", async (d: any) => {
        //     client.manager.updateVoiceState(d);
        //   });
        // });
    }
}
