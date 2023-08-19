import logger from '#utils/logger.js';
import { Router as router } from 'express';
export default class Statistics {
    manager;
    result = [];
    #router = router();
    constructor(manager) {
        this.manager = manager;
        this.#load();
    }
    get router() {
        return this.#router;
    }
    async getData(manager, result) {
        try {
            if (manager.queue.queue.length !== 0)
                return;
            result = [];
            const Promises = Array.from(manager.clusters).map(([key, cluster]) => {
                return cluster.request({ content: 'statistics' }).then((data) => {
                    Object.assign(data[0], { cluster: cluster.id, shardList: cluster.shardList });
                    result.push(data[0]);
                    return data[0];
                });
            });
            return await Promise.all(Promises).then(data => {
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
                result.push(sum);
                return result;
            });
        }
        catch (e) {
            if (e)
                logger.error(new Error(e));
            result.push({
                error: 'Statistics internal error, call the developer with the next id',
                status: 500,
            });
            return result;
        }
    }
    async #load() {
        const getData = await this.getData(this.manager, this.result);
        if (getData)
            this.result = getData;
        setInterval(async () => {
            const getData = await this.getData(this.manager, this.result);
            if (getData)
                this.result = getData;
        }, 6000);
        this.router.get('/', (req, res) => {
            res.json(this.result);
        });
        return this.router;
    }
}
//# sourceMappingURL=index.js.map