import NodeManager from '../../structures/NodeManager.js'
import logger from '../../utils/logger.js'

import { Router as router } from 'express'
// export default router
export default class Statistics {
    manager: NodeManager
    // app: Express.Application
    result: any[] = []
    #router = router()

    constructor (manager: NodeManager) {
        this.manager = manager
        this.#load()
    }

    get router () {
        return this.#router
    }

    async getData (manager: NodeManager, result: any[]): Promise<any[] | undefined> {
        /*
        & My function for get data from clusters, it only took me 4 hours ._.
? Example output:
[{
    "guilds": 4916,
    "ping": 124.4,
    "channels": 123192,
    "members": 326282,
    "memoryUsage": "266.41",
    "players": 0,
    "playingPlayers": 0,
    "cluster": 0,
    "shardList": [
        0,
        1,
        2,
        3,
        4
    ]
},
{
    "guilds": 4834,
    "ping": 168.6,
    "channels": 124016,
    "members": 321190,
    "memoryUsage": "267.27",
    "players": 0,
    "playingPlayers": 0,
    "cluster": 2,
    "shardList": [
        10,
        11,
        12,
        13,
        14
    ]
},
{
    "guilds": 1936,
    "ping": 128.5,
    "channels": 50631,
    "members": 113248,
    "memoryUsage": "128.79",
    "players": 0,
    "playingPlayers": 0,
    "cluster": 3,
    "shardList": [
        15,
        16
    ]
},
{
    "guilds": 4867,
    "ping": 126,
    "channels": 123735,
    "members": 358463,
    "memoryUsage": "265.79",
    "players": 0,
    "playingPlayers": 0,
    "cluster": 1,
    "shardList": [
        5,
        6,
        7,
        8,
        9
    ]
},
{
    "guilds": 16553,
    "players": 0,
    "memoryUsage": 926,
    "members": 1119183,
    "channels": 421574,
    "playingPlayers": 0,
    "cluster": -1,
    "dateNow": 1671881448944,
    "dateHumanNow": "Saturday, 12/24/2022, 12:30:48",
    "status": {
        "error": "",
        "status": 200
    }
}
]

*/
        /* Posible responses:
                    ~ 503: Shards still spawning
                    * 200: OK
                    ! 500: Internal error (inside cluster event ready)
                */
        try {
            if (manager.queue.queue.length !== 0) return
            result = []
            // Convertimos el objeto Map en un array y lo iteramos con map
            // todo: remove any from here
            const Promises = Array.from(manager.clusters).map(([key, cluster]: any) => {
                return cluster.request({ content: 'statistics' }).then((data: any) => {
                    Object.assign(data[0], { cluster: cluster.id, shardList: cluster.shardList })
                    result.push(data[0])
                    return data[0]
                })
            })
            // Esperamos a que todas las promesas se completen
            return await Promise.all(Promises).then(data => {
                // console.log(result)
                if (data.length === 0) return (result = [{ error: 'Shards still spawning', status: 503 }])
                const sum = result.reduce(
                    (
                        acc: {
                            guilds: any
                            players: any
                            memoryUsage: string
                            members: any
                            channels: any
                            playingPlayers: any
                        },
                        element: {
                            guilds: any
                            players: any
                            memoryUsage: string
                            members: any
                            channels: any
                            playingPlayers: any
                        },
                    ) => {
                        // Accedemos a las propiedades del elemento actual del array y las sumamos al acumulador
                        return {
                            guilds: acc.guilds + element.guilds,
                            players: acc.players + element.players,
                            memoryUsage: parseInt(acc.memoryUsage) + parseInt(element.memoryUsage),
                            members: acc.members + element.members,
                            channels: acc.channels + element.channels,
                            playingPlayers: acc.playingPlayers + element.playingPlayers,
                        }
                    },
                    { guilds: 0, playingPlayers: 0, players: 0, memoryUsage: 0, members: 0, channels: 0 },
                )
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
                })
                // Agregamos la suma al final del array
                result.push(sum)
                return result
                // this.manager.logger.log(`Guilds: ${sum.guilds} | Playing Players: ${sum.playingPlayers}`)
            })
        } catch (e: any) {
            if (e) logger.error(new Error(e))
            // * Status 500 is Internal Server Error
            result.push({
                error: 'Statistics internal error, call the developer with the next id',
                status: 500,
            })
            return result
        }
    }

    async #load () {
        // ejecutar funcion de estadisticas
        const getData = await this.getData(this.manager, this.result)
        if (getData) this.result = getData
        setInterval(async () => {
            const getData = await this.getData(this.manager, this.result)
            if (getData) this.result = getData
        }, 6000)
        this.router.get('/', (req: any, res: any) => {
            res.json(this.result)
        })
        return this.router
    }
}
