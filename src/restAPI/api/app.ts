import { Router } from 'express'
// const auth = require("./auth");
// const discord = require("./discord");
import NodeManager from '#structures/NodeManager.js'
import Statistics from '../statistics/index.js'
import Stripe from '../stripe/index.js'
import Twitch from '../twitch/index.js'

export default class restApiBase {
    manager: NodeManager
    #router = Router()
    // app: Express.Application | undefined
    constructor (manager: NodeManager) {
        this.manager = manager
        this.#load()
    }

    get router () {
        return this.#router
    }

    async #load () {
        // console.log(this)
        // this.router.use(express.json());
        // router.use("/auth", auth);
        // router.use("/discord", discord);
        // this.router.use("/", (req: any, res: any) => res.status(200).json({ message: "Hello World" }));
        this.router.use('/statistics', new Statistics(this.manager).router)
        this.router.use('/stripe', new Stripe(this.manager).router)
        this.router.use('/twitch', new Twitch(this.manager).router)
        return this.router
    }
}
