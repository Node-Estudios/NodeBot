import { Collection, Snowflake } from 'discord.js'
import commands from './commands.js'

class CooldownCache {
    private static instance: CooldownCache
    #cache = new Collection<string, number>()

    static getInstance (): CooldownCache {
        if (!CooldownCache.instance)
            CooldownCache.instance = new CooldownCache()

        return CooldownCache.instance
    }

    get cache (): Collection<string, number> {
        return this.#cache
    }

    canProced (userId: Snowflake, interactionName: string): boolean {
        if (!this.#cache.has(`${userId}:${interactionName}`)) return true
        const commandCooldown = commands.cache.find(c => c.name === interactionName)?.cooldown ?? 0
        if (!commandCooldown) return true
        const cooldown = this.#cache.get(`${userId}:${interactionName}`) ?? Date.now()
        if (Date.now() - cooldown > (commandCooldown * 1000)) return true
        return false
    }

    registerInteraction (userId: Snowflake, interactionName: string): void {
        this.#cache.set(`${userId}:${interactionName}`, Date.now())
    }

    leftTime (userId: Snowflake, interactionName: string): number {
        if (!this.#cache.has(`${userId}:${interactionName}`)) return 0
        const commandCooldown = commands.cache.find(c => c.name === interactionName)?.cooldown ?? 0
        if (!commandCooldown) return 0
        const cooldown = this.#cache.get(`${userId}:${interactionName}`) ?? Date.now()
        return (commandCooldown * 1000) - (Date.now() - cooldown)
    }
}

export default CooldownCache.getInstance()
