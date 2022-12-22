import { Cluster } from "discord-hybrid-sharding";
import Logger from "../utils/console";
import Manager from "./manager";
import express from 'express';
import cors from 'cors';

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

        app.get('/statistics', async (req: express.Request, res: express.Response) => {
            let result: any[] = []
            manager.clusters.forEach(async (cluster: Cluster) => {
                cluster.request({ content: "statistics" }).then((data: any) => {
                    if (data._sReply) result.push(data.content)
                }).then(() => { console.log(result); res.json(result) })
            })
        });

        // Iniciamos el servidor en el puerto 3000
        app.listen(3000, () => {
            this.manager.logger.log('Server listening on port 3000');
        });
    }

    // Primera función para inicializar el rest API
}
