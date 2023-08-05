import Client from '../structures/Client.js'
import { BaseEvent } from '../structures/Events.js'
import logger from '../utils/logger.js'
export interface Event {
    [eventName: string]: new (client: Client) => BaseEvent
}

export class EventHandler {
    constructor (private readonly client: Client) { }
    load (events: Event): void {
        if (this.client.cluster.maintenance) {
            logger.debug('Maintenance mode is enabled, skipping event loading')
            this.client.cluster.once('ready', () => {
                this.load(events)
            })
            return
        }
        for (const [eventName, EventClass] of Object.entries(events)) {
            const event = new EventClass(this.client)
            // console.log(`Loading event: ${eventName}.js`);
            this.client.on(eventName, async (...args) => {
                // console.log(`Event ${eventName} loaded`);
                // console.log(...args)
                // Pasar una función anónima como primer argumento y la tupla de argumentos como argumentos de esta función
                await event._run(() => event.run(this.client, ...args))
            })
        }
    }
}
