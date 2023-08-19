import logger from '#utils/logger.js';
export class BaseEvent {
    client;
    constructor(client) {
        this.client = client;
    }
    async _run(run) {
        try {
            await run();
        }
        catch (err) {
            logger.error(err);
        }
    }
}
//# sourceMappingURL=Events.js.map