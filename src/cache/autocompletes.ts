import { Collection, Snowflake } from 'discord.js'
import Autocomplete from '#structures/Autocomplete.js'

class AutocompleteCache {
    private static instance: AutocompleteCache
    #cache: Collection<string | RegExp, Autocomplete>
    #interactions = new Collection<Snowflake, Snowflake>()

    private constructor () {
        this.#cache = new Collection<string, Autocomplete>()
    }

    static getInstance (): AutocompleteCache {
        if (!AutocompleteCache.instance) {
            AutocompleteCache.instance = new AutocompleteCache()
        }
        return AutocompleteCache.instance
    }

    get cache (): Collection<string | RegExp, Autocomplete> {
        return this.#cache
    }

    canProced (userId: Snowflake, interactionId: Snowflake): boolean {
        return this.#interactions.get(userId) === interactionId
    }

    registerInteraction (userId: Snowflake, interactionId: Snowflake): void {
        this.#interactions.set(userId, interactionId)
    }

    removeInteraction (userId: Snowflake): void {
        this.#interactions.delete(userId)
    }
}

export default AutocompleteCache.getInstance()
