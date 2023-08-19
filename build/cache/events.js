import { Collection } from 'discord.js';
class EventCache {
    static instance;
    #cache;
    constructor() {
        this.#cache = new Collection();
    }
    static getInstance() {
        if (!EventCache.instance) {
            EventCache.instance = new EventCache();
        }
        return EventCache.instance;
    }
    get cache() {
        return this.#cache;
    }
}
export default EventCache.getInstance();
//# sourceMappingURL=events.js.map