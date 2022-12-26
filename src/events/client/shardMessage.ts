const { setTimeout: sleep } = require('node:timers/promises')
import NodeManager from '../../structures/manager'
import { Cluster } from 'discord-hybrid-sharding'
import { writeFile, readFile } from 'node:fs'
import logger from '../../utils/logger.js'

// TODO: Add types
// TODO! Fix this

export default async function (
    originShard: Cluster,
    message: {
        data: any
        type: any
        shard: any
        value: any
    },
    manager: NodeManager,
) {
    if (!originShard || !message) return

    switch (message.type) {
        case 'reboot':
            switch (message.shard) {
                case 'all':
                    logger.warn('Reiniciando todas las shards')
                    writeFile('./test.txt', '0', err => err && console.log(err))
                    let s = 0
                    for (const shard of manager.clusters.values()) {
                        logger.warn(`Reiniciando Shard ${shard.id}`)
                        const players = await manager.broadcastEval(
                            (c: any) =>
                                c.manager.players.map((player: any) => {
                                    /*
                                        current .....
                                        previous...
                                        {
                                            proxima 
                                        } 
                                        */
                                    c.channels.fetch(player.options.textchannel).then((channel: any) => {
                                        channel.send({
                                            content: c.language.REBOOTMESSAGE,
                                        })
                                    })
                                    return {
                                        options: player.options, //todo lo otro sale bien, es solo queue, porque es un Object
                                        queue: Object.values(player.queue), //  pero
                                        position: player.position,
                                    }
                                }),
                            {
                                cluster: shard.id,
                            },
                        )
                        const promises = [
                            await shard.respawn({
                                delay: 500,
                                timeout: 30_000,
                            }),
                        ]
                        readFile('./test.txt', 'utf8', function (err, data) {
                            if (err) {
                                return console.log(err)
                            }

                            if (data == '0') {
                                // require("../../webhook.js");
                            }

                            writeFile('./test.txt', '1', function (err) {
                                if (err) {
                                    return console.log(err)
                                }
                            })
                        }) //
                        if (++s < manager.clusters.size && 5_000 > 0) promises.push(sleep(5_000))
                        await Promise.all(promises).then(async () => {
                            return await manager.broadcastEval(
                                (c: any, context: any) => {
                                    const interval3 = setInterval(async function () {
                                        if (!c.manager) return
                                        clearInterval(interval3)
                                        return c.manager.nodes.map((node: any) => {
                                                const  interval = setInterval(function () {
                                                    if (node.stats.uptime >= 0) return
                                                    clearInterval(interval)
                                                    if (!context.length) return 
                                                    context.forEach(async (player2: any) => {
                                                        const player = c.manager.create({
                                                            guild: player2.options.guild,
                                                            voiceChannel: player2.options.voiceChannel,
                                                            textChannel: player2.options.textChannel,
                                                            selfDeafen: true,
                                                        })
                                                        if (player2.stayInVc)
                                                            player.stayInVc = true
                                                        let i = 0
                                                        player2.queue.reverse()
                                                        player2.queue.shift()
                                                        player.connect(node.id)
                                                        if (player2.stayInVc) player.stayInVc = true
                                                        await Promise.all(
                                                            player2.queue.map(async (track: any) => {
                                                                if (!track || !track.title) return
                                                                let uri = await c.manager.search(
                                                                    player2.queue[i].identifier,
                                                                    player2.queue[i].requester,
                                                                )
                                                                i++
                                                                return await player.queue.add(uri.tracks[0])
                                                            }),
                                                        )
                                                        player.play()
                                                        const interval2 = setInterval(function () {
                                                            if (player2.isStream || !player2.isSeekeable)
                                                                clearInterval(interval2)
                                                            if (player2.position > 0) {
                                                                clearInterval(interval2)
                                                                player.seek(player2.position)
                                                            }
                                                        }, 200)
                                                    })
                                                }, 200)
                                            }),
                                        
                                    }, 200)
                                },
                                {
                                    cluster: shard.id,
                                    context: await players,
                                },
                            )
                        }) // eslint-disable-line no-await-in-loop
                    }
                    return manager.clusters

                    break
                case 'shard':
                    logger.warn(`Reiniciando Shard ${message.shard}`)
                    // eslint-disable-next-line no-case-declarations
                    const shard = manager.clusters.get(message.shard)
                    if (shard) shard.respawn()
                    break
            }
            break
    }
}
