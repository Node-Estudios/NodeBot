import logger from '../utils/logger';
import Client from './Client';

// Interfaz de la clase base de eventos
interface Event {
    run(client: Client, ...args: any[]): Promise<void>;
}


// Clase base de eventos
export class EventHandler implements Event {
    constructor(private client: Client) { }

    async run(client: Client, ...args: any[]): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async _run(run: (...args: any[]) => Promise<any>): Promise<any> {
        try {
            await run();
        } catch (err) {
            // TODO: Add error handler
            logger.error(err);
        }
    }
}
