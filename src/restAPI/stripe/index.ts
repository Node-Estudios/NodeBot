import NodeManager from "../../structures/NodeManager.js";

import { Router as router } from 'express';
// export default router
export class stripe {
    manager: NodeManager
    router = router()
    // app: Express.Application
    constructor(manager: NodeManager) {
        this.manager = manager;
    }
    load() {
        this.router.get('/', (req: any, res: any) => {
            res.status(200).json({ message: "Hello World" })
            //ejecutar funcion de estadisticas	
        })
    }
}