import { Collection } from 'discord.js';
import commands from './commands.js';
class CooldownCache {
    static instance;
    #cache = new Collection();
    static getInstance() {
        if (!CooldownCache.instance)
            CooldownCache.instance = new CooldownCache();
        return CooldownCache.instance;
    }
    get cache() {
        return this.#cache;
    }
    canProced(userId, interactionName) {
        if (!this.#cache.has(`${userId}:${interactionName}`))
            return true;
        const commandCooldown = commands.cache.find(c => c.name === interactionName)?.cooldown ?? 0;
        if (!commandCooldown)
            return true;
        const cooldown = this.#cache.get(`${userId}:${interactionName}`) ?? Date.now();
        if (Date.now() - cooldown > (commandCooldown * 1000))
            return true;
        return false;
    }
    registerInteraction(userId, interactionName) {
        this.#cache.set(`${userId}:${interactionName}`, Date.now());
    }
    leftTime(userId, interactionName) {
        if (!this.#cache.has(`${userId}:${interactionName}`))
            return 0;
        const commandCooldown = commands.cache.find(c => c.name === interactionName)?.cooldown ?? 0;
        if (!commandCooldown)
            return 0;
        const cooldown = this.#cache.get(`${userId}:${interactionName}`) ?? Date.now();
        return (commandCooldown * 1000) - (Date.now() - cooldown);
    }
}
export default CooldownCache.getInstance();
//# sourceMappingURL=cooldowns.js.map