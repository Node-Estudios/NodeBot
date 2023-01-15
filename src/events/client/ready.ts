import * as Sentry from '@sentry/node'
import { IPCMessage } from 'discord-hybrid-sharding'
import { connect } from 'mongoose'
import logger from '../../utils/logger.js'
//TODO? use global client?
import Client from '../../structures/Client.js'

// TODO: Remove (variable: any) in the code
// Interfaz de eventos
import commands from '../../cache/commands.js'
import { BaseEvent } from '../../structures/Events.js'

export default class Ready extends BaseEvent {
    async run(client: Client): Promise<void> {
        // console.log('client: \n', client.cluster)
        // ...

        //* ADD DATABASE CONNECTION
        if (process.env.MONGOURL)
            connect(process.env.MONGOURL.toString(), {
                // @ts-ignore
                useUnifiedTopology: true,
                useNewUrlParser: true,
            }).then(() => logger.db('Se ha conectado la base de datos correctamente.'))
        // cluster
        client.cluster.triggerReady()
        let arr: any[] = []
        commands.map((command) => {
            arr.push(command)
        })
        // console.log(JSON.stringify(arr))
        const guild = client.guilds.cache.get('862635336165097483')
        guild?.commands.set(arr)
        // fetch('https://discord.com/api/v9/applications/834164602694139985/guilds/862635336165097483/commands', {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        //     },
        //     body: arr,
        // }).then(() => console.log('Successfully registered application commands.'))
        client.cluster.on('message', async (message2: any) => {
            let message = (message2 as IPCMessage).raw
            if (message.content == 'statistics') {
                try {
                    // logger.debug(`Cluster's ${client.cluster.id} received statistics`)
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
                        .then((results: any) => {
                            // console.log(results)
                            ; (message2 as any).reply(results)
                        })
                } catch (e) {
                    logger.error(e)
                    if (client.services.sentry.loggedIn) {
                        Sentry.captureException(e, scope => {
                            scope.clear()
                            scope.setContext('Statistics', {
                                message: message,
                                cluster: client.cluster.id,
                            })
                            return scope
                        })
                        logger.debug('Sentry error sent')
                    }
                    // * Status 500 is Internal Server Error
                    ; (message as any).reply({
                        error: 'Statistics internal error, call the developer with the next id',
                        status: 500,
                    })
                }
            }
        })
        logger.debug(`${client.user!.username} ✅`)
    }
}
