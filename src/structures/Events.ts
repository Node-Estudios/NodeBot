import logger from '../utils/logger.js';
import Client from './Client.js';
export default class Event {
    client: Client
    constructor(client: Client) {
        this.client = client
    }
    async _run(...args: any[]): Promise<any> {
        try {
            await (this as any).run(...args);
        } catch (err) {
            // TDOO: Add error handler
            logger.error(err);
        }
    }
}
