import { Events } from '../../structures/event';
const { setTimeout: sleep } = require('node:timers/promises');
const { isGeneratorFunction } = require('node:util/types');
import { writeFile, readFile } from 'fs';
import Client from '../../structures/client';
import * as Discord from 'discord.js';
import NodeManager from '../../structures/manager';
import { Cluster } from 'discord-hybrid-sharding';

function areObjEquals(obj1: any, obj2: any) {
    let equal = true;

    for (let [key, val] of Object.entries(obj1)) {
        if (obj2.hasOwnProperty(key)) {
            if (obj2[key] !== val) {
                equal = false;
            }
        } else {
            equal = false;
        }

        if (!equal) { break; }
    }

    return equal;
}

export class shardMessage extends Events {
    constructor(client: null, file: typeof shardMessage) {
        super(client, file);
    }

    async run(
        originShard: Cluster,
        message: {
            data: any;
            type: any;
            shard: any;
            value: any;
        },
        manager: NodeManager,
        Logger: any,
    ) {
        if (!originShard || !message) return;
        switch (message.type) {
            case 'reboot':
                switch (message.shard) {
                    case 'all':
                        Logger.warn('Reiniciando todas las shards');
                        async () => {
                            writeFile('./test.txt', '0', function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            let s = 0;
                            for (const shard of manager.clusters.values()) {
                                Logger.warn(`Reiniciando Shard ${shard.id}`);
                                const players = await manager.broadcastEval(
                                    (c: any) => {
                                        return Promise.resolve(
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
                                                    });
                                                });
                                                return {
                                                    options: player.options, //todo lo otro sale bien, es solo queue, porque es un Object
                                                    queue: Object.values(player.queue), //  pero
                                                    position: player.position,
                                                };
                                            }),
                                        );
                                    },
                                    {
                                        cluster: shard.id,
                                    },
                                );
                                const promises = [
                                    await shard.respawn({
                                        delay: 500,
                                        timeout: 30_000,
                                    }),
                                ];
                                readFile('./test.txt', 'utf8', function (err, data) {
                                    if (err) {
                                        return console.log(err);
                                    }

                                    if (data == '0') {
                                        // require("../../webhook.js");
                                    }

                                    writeFile('./test.txt', '1', function (err) {
                                        if (err) {
                                            return console.log(err);
                                        }
                                    });
                                }); //
                                if (++s < manager.clusters.size && 5_000 > 0) promises.push(sleep(5_000));
                                await Promise.all(promises).then(async () => {
                                    return await manager.broadcastEval(
                                        async (c: any, context: any) => {
                                            var interval3 = setInterval(async function () {
                                                if (c.manager) {
                                                    clearInterval(interval3);
                                                    return await Promise.resolve(
                                                        await c.manager.nodes.map((node: any) => {
                                                            var interval = setInterval(function () {
                                                                if (node.stats.uptime > 0) {
                                                                    clearInterval(interval);
                                                                    if (!areObjEquals(context, [])) {
                                                                        context.forEach(async (player2: any) => {
                                                                            const player = c.manager.create({
                                                                                guild: player2.options.guild,
                                                                                voiceChannel:
                                                                                    player2.options.voiceChannel,
                                                                                textChannel:
                                                                                    player2.options.textChannel,
                                                                                selfDeafen: true,
                                                                            });
                                                                            if (player2.stayInVc == true)
                                                                                (await player.stayInVc) == true;
                                                                            let i = 0;
                                                                            player2.queue.reverse();
                                                                            player2.queue.shift();
                                                                            player.connect(node.id);
                                                                            if (player2.stayInVc == true)
                                                                                player.stayInVc == true;
                                                                            await Promise.all(
                                                                                player2.queue.map(
                                                                                    async (track: any) => {
                                                                                        if (!track || !track.title)
                                                                                            return;
                                                                                        let uri =
                                                                                            await c.manager.search(
                                                                                                player2.queue[i]
                                                                                                    .identifier,
                                                                                                player2.queue[i]
                                                                                                    .requester,
                                                                                            );
                                                                                        i++;
                                                                                        return await player.queue.add(
                                                                                            uri.tracks[0],
                                                                                        );
                                                                                    },
                                                                                ),
                                                                            ).then(() => {
                                                                                player.play();
                                                                            });
                                                                            var interval2 = setInterval(function () {
                                                                                if (
                                                                                    player2.isStream ||
                                                                                    !player2.isSeekeable
                                                                                )
                                                                                    clearInterval(interval2);
                                                                                if (player2.position > 0) {
                                                                                    clearInterval(interval2);
                                                                                    player.seek(player2.position);
                                                                                }
                                                                            }, 200);
                                                                        });
                                                                    }
                                                                }
                                                            }, 200);
                                                        }),
                                                    );
                                                }
                                            }, 200);
                                        },
                                        {
                                            cluster: shard.id,
                                            context: await players,
                                        },
                                    );
                                }); // eslint-disable-line no-await-in-loop
                            }
                            return manager.clusters;
                        };
                    case 'shard':
                        Logger.warn(`Reiniciando Shard ${message.shard}`);
                        // eslint-disable-next-line no-case-declarations
                        const shard = manager.clusters.get(message.shard);
                        if (shard) shard.respawn();
                        break;
                }
                break;
        }
    }
}
