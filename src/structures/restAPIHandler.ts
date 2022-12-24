import cors from 'cors';
import { Cluster } from 'discord-hybrid-sharding';
import express from 'express';
import Manager from './manager';

//funcione logger:
//Logger.log, Logger.error, Logger.warn, Logger.info, Logger.debug

export default class IPChandler {
    private manager: Manager;
    //Iniciamos el constructor
    constructor(manager: Manager) {
        this.manager = manager;
        const app = express();
        app.use(cors());
        //Definimos las variables necesarias en el oncstructor para la rest API

        let result: any[] = [];
        app.get('/statistics', async (req: express.Request, res: express.Response) => {
            res.json(result);
        });

        // Iniciamos el servidor en el puerto 3000
        app.listen(3000, () => {
            manager.logger.log('Server listening on port 3000');
        });
        function getData() {
            if (manager.queue.queue.length !== 0) return;
            manager.clusters.forEach(async (cluster: Cluster) => {
                result = [];
                cluster.request({ content: 'statistics' }).then((data: any) => {
                    Object.assign(data[0], { cluster: cluster.id, shardList: cluster.shardList });
                    result.push(data[0]);
                });
            });
        }
        getData();
        setInterval(() => {
            getData();
        }, 3000);
    }

    // Primera función para inicializar el rest API
}
