import commands from '#cache/commands.js';
import logger from '#utils/logger.js';
import * as Sentry from '@sentry/node';
import { ActivityType } from 'discord.js';
import { connect } from 'mongoose';
import { BaseEvent } from '../../structures/Events.js';
export default class Ready extends BaseEvent {
    async run(client) {
        if (process.env.MONGOURL)
            connect(process.env.MONGOURL.toString(), {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            }).then(() => logger.db('Se ha conectado la base de datos correctamente.'));
        const arr = [];
        for (const [, command] of commands.cache)
            arr.push(command);
        if (process.env.TESTINGGUILD) {
            const guild = await client.guilds.fetch(process.env.TESTINGGUILD);
            guild.commands.set(arr).catch(logger.error);
        }
        else if (!process.env.TESTINGUILD)
            client.application?.commands.set(arr).catch(logger.error);
        client.cluster.on('message', async (message2) => {
            const message = message2.raw;
            if (message.content === 'statistics')
                try {
                    client.cluster
                        .broadcastEval(c => ({
                        guilds: c.guilds.cache.size,
                        ping: c.ws.ping,
                        channels: c.channels.cache.size,
                        members: c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0),
                        memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                        players: c.music.players.size,
                        playingPlayers: c.music.players.filter(p => p.playing).size,
                    }), { cluster: client.cluster.id })
                        .then(results => {
                        message2.reply(results);
                    });
                }
                catch (e) {
                    logger.error(e);
                    if (client.services.sentry.loggedIn) {
                        Sentry.captureException(e, scope => {
                            scope.clear();
                            scope.setContext('Statistics', {
                                message,
                                cluster: client.cluster.id,
                            });
                            return scope;
                        });
                        logger.debug('Sentry error sent');
                    }
                    message.reply({
                        error: 'Statistics internal error, call the developer with the next id',
                        status: 500,
                    });
                }
        });
        if (!process.env.TESTINGUILD)
            setInterval(() => {
                updateStatus();
            }, 300000);
        async function updateStatus() {
            const promises = [
                client.cluster.fetchClientValues('guilds.cache.size'),
                client.cluster.broadcastEval((c) => {
                    return c.music?.players?.size ?? 0;
                }),
            ];
            Promise.all(promises)
                .then((results) => {
                const guildNum = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                const playersSize = results[1].reduce((acc, playerCount) => acc + playerCount, 0);
                client.user.setActivity(`Servidores: ${guildNum}, Escuchando Música: ${playersSize}`, { type: ActivityType.Listening });
            })
                .catch(logger.error);
        }
        logger.debug(`${client.user.username} ✅ | Cluster: ${client.cluster.id}`);
    }
}
//# sourceMappingURL=ready.js.map