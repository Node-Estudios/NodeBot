import { Collection } from 'discord.js';
class ButtonCache {
    static instance;
    #cache;
    constructor() {
        this.#cache = new Collection();
    }
    static getInstance() {
        if (!ButtonCache.instance) {
            ButtonCache.instance = new ButtonCache();
        }
        return ButtonCache.instance;
    }
    get cache() {
        return this.#cache;
    }
}
export default ButtonCache.getInstance();
//# sourceMappingURL=buttons.js.map