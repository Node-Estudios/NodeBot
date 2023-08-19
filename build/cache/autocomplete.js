import { Collection } from 'discord.js';
class AutocompleteCache {
    static instance;
    cache;
    constructor() {
        this.cache = new Collection();
    }
    static getInstance() {
        if (!AutocompleteCache.instance) {
            AutocompleteCache.instance = new AutocompleteCache();
        }
        return AutocompleteCache.instance;
    }
    getCache() {
        return this.cache;
    }
}
export default AutocompleteCache.getInstance();
//# sourceMappingURL=autocomplete.js.map