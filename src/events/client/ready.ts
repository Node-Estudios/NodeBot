const Event = require('../../structures/event')
import * as Sentry from '@sentry/node'
import { IPCMessage } from 'discord-hybrid-sharding'
import 'dotenv/config'
import { connect } from 'mongoose'
import Client from '../../structures/client'
import MusicManager from './../../structures/musicManager'
export default class ready {
    constructor() {}

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
            }).then(() => client.logger.db('Se ha conectado la base de datos correctamente.'))
        client.music = new MusicManager(client)
        let result: any[]
        client.cluster.on('message', async message2 => {
            let message = (message2 as IPCMessage).raw
            if ((message.content = 'statistics')) {
                try {
                    // client.logger.debug(`Cluster's ${client.cluster.id} received statistics`)
                    client.cluster
                        .broadcastEval(
                            (c: any) => ({
                                guilds: c.guilds.cache.size,
                                ping: c.ws.ping,
                                channels: c.channels.cache.size,
                                members: c.guilds.cache.reduce(
                                    (prev: any, guild: { memberCount: any }) => prev + guild.memberCount,
                                    0,
                                ),
                                memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                                players: c.music.players.size,
                                playingPlayers: c.music.players.filter((p: { playing: any }) => p.playing).size,
                            }),
                            { cluster: client.cluster.id },
                        )
                        .then(results => {
                            // console.log(results)
                            ;(message2 as any).reply(results)
                        })
                } catch (e: any) {
                    if (e) client.logger.error(new Error(e))
                    if (client.services.sentry.loggedIn) {
                        Sentry.captureException(e, scope => {
                            scope.clear()
                            scope.setContext('Statistics', {
                                message: message,
                                cluster: client.cluster.id,
                            })
                            return scope
                        })
                        client.logger.debug('Sentry error sent')
                    }
                    // * Status 500 is Internal Server Error
                    ;(message as any).reply({
                        error: 'Statistics internal error, call the developer with the next id',
                        status: 500,
                    })
                }
            }
        })
        console.log(client.buttons)
        client.logger.debug(`${client.user!.username} ✅`)
        Promise.resolve(true)
        // new CreateManager(client).then(() => {
        //   client.on("raw", async (d: any) => {
        //     client.manager.updateVoiceState(d);
        //   });
        // });
    }
}
