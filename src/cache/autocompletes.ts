import { Collection, Snowflake } from 'discord.js'
import Autocomplete from '#structures/Autocomplete.js'

class AutocompleteCache {
    private static instance: AutocompleteCache
    #cache: Collection<string | RegExp, Autocomplete>
    #interactions = new Collection<Snowflake, {
        interactionId: Snowflake
        timestamp: number
    }>()

    private constructor () {
        this.#cache = new Collection<string, Autocomplete>()
    }

    static getInstance (): AutocompleteCache {
        if (!AutocompleteCache.instance)
            AutocompleteCache.instance = new AutocompleteCache()

        return AutocompleteCache.instance
    }

    get cache (): Collection<string | RegExp, Autocomplete> {
        return this.#cache
    }

    canProced (userId: Snowflake, interactionId: Snowflake): boolean {
        const auto = this.#interactions.get(userId)
        if (!auto) return true
        if (auto.interactionId !== interactionId) return true
        if (Date.now() - auto.timestamp < 3000) return true
        return false
    }

    registerInteraction (userId: Snowflake, interactionId: Snowflake): void {
        this.#interactions.set(userId, { interactionId, timestamp: Date.now() })
    }

    removeInteraction (userId: Snowflake): void {
        this.#interactions.delete(userId)
    }
}

export default AutocompleteCache.getInstance()
