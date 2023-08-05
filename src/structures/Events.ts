import { Event } from '../handlers/events.js'
import logger from '../utils/logger.js'
import Client from './Client.js'

export class BaseEvent implements Event {
    [x: string]: any;
    client: Client
    constructor (client: Client) {
        this.client = client
    }

    async _run (run: (...args: any[]) => Promise<any>): Promise<any> {
        try {
            await run()
        } catch (err) {
            // TODO: Add error handler
            logger.error(err)
        }
    }
}
