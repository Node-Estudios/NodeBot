import { Router } from 'express';
import Statistics from '../statistics/index.js';
import Stripe from '../stripe/index.js';
import Twitch from '../twitch/index.js';
export default class restApiBase {
    manager;
    #router = Router();
    constructor(manager) {
        this.manager = manager;
        this.#load();
    }
    get router() {
        return this.#router;
    }
    async #load() {
        this.router.use('/statistics', new Statistics(this.manager).router);
        this.router.use('/stripe', new Stripe(this.manager).router);
        this.router.use('/twitch', new Twitch(this.manager).router);
        return this.router;
    }
}
//# sourceMappingURL=app.js.map