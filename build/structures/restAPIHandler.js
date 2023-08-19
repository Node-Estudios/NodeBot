import cors from 'cors';
import express from 'express';
import logger from '#utils/logger.js';
export default function (manager) {
    const app = express();
    app.use(cors());
    let result = [];
    app.get('/statistics', async (req, res) => {
        res.json(result);
    });
    app.listen(3000, () => {
        logger.log('Server listening on port 3000');
    });
    async function getData() {
        try {
            if (manager.queue.queue.length !== 0)
                return;
            result = [];
            const Promises = Array.from(manager.clusters).map(async ([key, cluster]) => {
                const data = await cluster.request({ content: 'statistics' });
                Object.assign(data[0], { cluster: cluster.id, shardList: cluster.shardList });
                result.push(data[0]);
                return data[0];
            });
            await Promise.all(Promises).then(data => {
                if (data.length === 0)
                    return (result = [{ error: 'Shards still spawning', status: 503 }]);
                const sum = result.reduce((acc, element) => {
                    return {
                        guilds: acc.guilds + element.guilds,
                        players: acc.players + element.players,
                        memoryUsage: parseInt(acc.memoryUsage) + parseInt(element.memoryUsage),
                        members: acc.members + element.members,
                        channels: acc.channels + element.channels,
                        playingPlayers: acc.playingPlayers + element.playingPlayers,
                    };
                }, { guilds: 0, playingPlayers: 0, players: 0, memoryUsage: 0, members: 0, channels: 0 });
                Object.assign(sum, {
                    cluster: -1,
                    dateNow: Date.now(),
                    dateHumanNow: new Date().toLocaleString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        weekday: 'long',
                        hour: '2-digit',
                        hour12: false,
                        minute: '2-digit',
                        second: '2-digit',
                    }),
                    status: { error: '', status: 200 },
                });
                return result.push(sum);
            });
        }
        catch (e) {
            if (e)
                logger.error(new Error(e));
            result.push({
                error: 'Statistics internal error, call the developer with the next id',
                status: 500,
            });
        }
    }
    getData();
    setInterval(() => {
        getData();
    }, 6000);
}
//# sourceMappingURL=restAPIHandler.js.map