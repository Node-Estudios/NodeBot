import { IPCMessage } from 'discord-hybrid-sharding'
import logger from '../../utils/logger.js'
import * as Sentry from '@sentry/node'
import { connect } from 'mongoose'
import client from '../../bot.js'

export default function () {
    //* ADD DATABASE CONNECTION
    if (process.env.mongoURL)
        connect(process.env.mongoURL.toString(), {
            // @ts-ignore
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then(() => logger.db('Se ha conectado la base de datos correctamente.'))
    // cluster
    client.cluster.triggerReady()
    client.cluster.on('message', async message2 => {
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
                    .then(results => {
                        // console.log(results)
                        ;(message2 as any).reply(results)
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
                ;(message as any).reply({
                    error: 'Statistics internal error, call the developer with the next id',
                    status: 500,
                })
            }
        }
    })
    logger.debug(`${client.user!.username} ✅`)
}
