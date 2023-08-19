import { Collection } from 'discord.js';
class ModalCache {
    static instance;
    #cache = new Collection();
    static getInstance() {
        if (!ModalCache.instance)
            ModalCache.instance = new ModalCache();
        return ModalCache.instance;
    }
    get cache() {
        return this.#cache;
    }
}
export default ModalCache.getInstance();
//# sourceMappingURL=modals.js.map