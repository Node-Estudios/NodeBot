import commands from '#cache/commands.js'
import Client from '#structures/Client.js'
import Command from '#structures/Command.js'
import logger from '#utils/logger.js'
import * as Sentry from '@sentry/node'
import { IPCMessage } from 'discord-hybrid-sharding'
import { ActivityType } from 'discord.js'
import { BaseEvent } from '../../structures/Events.js'

export default class Ready extends BaseEvent {
    async run(client: Client): Promise<void> {
        // console.log('client: \n', client.cluster)
        // ...

        // cluster
        // client.cluster.triggerReady()
        const arr: Command[] = []
        for (const [, command] of commands.cache) arr.push(command)
        if (process.env.TESTINGGUILD) {
            const guild = await client.guilds.fetch(process.env.TESTINGGUILD)
            guild.commands.set(arr).catch(logger.error)
        } else if (!process.env.TESTINGUILD)
            client.application?.commands.set(arr).catch(logger.error)

        client.cluster.on('message', async (message2: any) => {
            const message = (message2 as IPCMessage).raw
            if (message.content === 'statistics')
                try {
                    // logger.debug(`Cluster's ${client.cluster.id} received statistics`)
                    client.cluster
                        .broadcastEval(
                            c => ({
                                guilds: c.guilds.cache.size,
                                ping: c.ws.ping,
                                channels: c.channels.cache.size,
                                members: c.guilds.cache.reduce(
                                    (prev, guild) => prev + guild.memberCount,
                                    0,
                                ),
                                memoryUsage: (
                                    process.memoryUsage().heapUsed /
                                    1024 /
                                    1024
                                ).toFixed(2),
                                players: c.music.players.size,
                                playingPlayers: c.music.players.filter(
                                    p => p.playing,
                                ).size,
                            }),
                            { cluster: client.cluster.id },
                        )
                        .then(results => {
                            // console.log(results)
                            message2.reply(results)
                        })
                } catch (e) {
                    logger.error(e)
                    if (client.services.sentry.loggedIn) {
                        Sentry.captureException(e, scope => {
                            scope.clear()
                            scope.setContext('Statistics', {
                                message,
                                cluster: client.cluster.id,
                            })
                            return scope
                        })
                        logger.debug('Sentry error sent')
                    }
                    // * Status 500 is Internal Server Error
                    message.reply({
                        error: 'Statistics internal error, call the developer with the next id',
                        status: 500,
                    })
                }
        })
        if (!process.env.TESTINGUILD)
            setInterval(() => {
                updateStatus()
            }, 300000)

        async function updateStatus() {
            const promises = [
                client.cluster.fetchClientValues('guilds.cache.size'),
                // client.shard.broadcastEval((c) =>
                //   c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
                // ),
                client.cluster.broadcastEval(c => {
                    return c.music?.players?.size ?? 0
                }),
            ]
            Promise.all(promises)
                .then(results => {
                    const guildNum = results[0].reduce(
                        (acc: any, guildCount: any) => acc + guildCount,
                        0,
                    )
                    // const memberNum = results[1].reduce(
                    //   (acc, memberCount) => acc + memberCount,
                    //   0
                    // );
                    const playersSize = results[1].reduce(
                        (acc: any, playerCount: any) => acc + playerCount,
                        0,
                    )
                    client.user.setActivity(
                        `Servidores: ${guildNum}, Escuchando Música: ${playersSize}`,
                        { type: ActivityType.Listening },
                    )
                })
                .catch(logger.error)
        }
        logger.debug(
            `${client.user.username} ✅ | Cluster: ${client.cluster.id}`,
        )
    }
}
