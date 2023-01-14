import { Router } from 'express';
// const auth = require("./auth");
// const discord = require("./discord");
import NodeManager from '../../structures/NodeManager.js';
import { statistics } from '../statistics/index.js';

export default class restApiBase {
    manager: NodeManager
    router: Router
    // app: Express.Application | undefined
    constructor(manager: NodeManager) {
        this.manager = manager;
        this.router = Router();
    }
    async load(): Promise<Router> {
        // console.log(this)
        // this.router.use(express.json());
        // router.use("/auth", auth);
        // router.use("/discord", discord);
        // this.router.use("/", (req: any, res: any) => res.status(200).json({ message: "Hello World" }));
        this.router.use("/statistics", await new statistics(this.manager).load());
        // this.router.use("/stripe", new stripe(this.manager).load());
        return this.router
    }
}