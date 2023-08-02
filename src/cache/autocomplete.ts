import { Collection } from 'discord.js'
import Autocomplete from '../structures/Autocomplete'

class AutocompleteCache {
    private static instance: AutocompleteCache
    private readonly cache: Collection<string | RegExp, Autocomplete>

    private constructor () {
        this.cache = new Collection<string, Autocomplete>()
    }

    public static getInstance (): AutocompleteCache {
        if (!AutocompleteCache.instance) {
            AutocompleteCache.instance = new AutocompleteCache()
        }
        return AutocompleteCache.instance
    }

    public getCache (): Collection<string | RegExp, Autocomplete> {
        return this.cache
    }
}

export default AutocompleteCache.getInstance()
