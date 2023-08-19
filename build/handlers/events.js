import logger from '#utils/logger.js';
export class EventHandler {
    client;
    constructor(client) {
        this.client = client;
    }
    load(events) {
        if (this.client.cluster.maintenance) {
            logger.debug('Maintenance mode is enabled, skipping event loading');
            this.client.cluster.once('ready', () => {
                this.load(events);
            });
            return;
        }
        for (const [eventName, EventClass] of Object.entries(events)) {
            const event = new EventClass(this.client);
            this.client.on(eventName, async (...args) => {
                await event._run(() => event.run(this.client, ...args));
            });
        }
    }
}
//# sourceMappingURL=events.js.map