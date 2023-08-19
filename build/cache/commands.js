import { Collection } from 'discord.js';
class CommandCache {
    static instance;
    #cache;
    constructor() {
        this.#cache = new Collection();
    }
    static getInstance() {
        if (!CommandCache.instance) {
            CommandCache.instance = new CommandCache();
        }
        return CommandCache.instance;
    }
    get cache() {
        return this.#cache;
    }
}
export default CommandCache.getInstance();
//# sourceMappingURL=commands.js.map