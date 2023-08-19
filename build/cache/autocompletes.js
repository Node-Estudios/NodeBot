import { Collection } from 'discord.js';
class AutocompleteCache {
    static instance;
    #cache;
    #interactions = new Collection();
    constructor() {
        this.#cache = new Collection();
    }
    static getInstance() {
        if (!AutocompleteCache.instance)
            AutocompleteCache.instance = new AutocompleteCache();
        return AutocompleteCache.instance;
    }
    get cache() {
        return this.#cache;
    }
    canProced(userId, interactionId) {
        const auto = this.#interactions.get(userId);
        if (!auto)
            return true;
        if (auto.interactionId !== interactionId)
            return true;
        if (Date.now() - auto.timestamp < 3000)
            return true;
        return false;
    }
    registerInteraction(userId, interactionId) {
        this.#interactions.set(userId, { interactionId, timestamp: Date.now() });
    }
    removeInteraction(userId) {
        this.#interactions.delete(userId);
    }
}
export default AutocompleteCache.getInstance();
//# sourceMappingURL=autocompletes.js.map