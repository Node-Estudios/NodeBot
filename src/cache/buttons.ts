import { Collection } from 'discord.js'
import Button from '../structures/Button'

class buttonCache {
    private static instance: buttonCache
    private cache: Collection<string|RegExp, Button>

    private constructor() {
        this.cache = new Collection<string, Button>()
    }

    public static getInstance(): buttonCache {
        if (!buttonCache.instance) {
            buttonCache.instance = new buttonCache()
        }
        return buttonCache.instance
    }

    public getCache(): Collection<string|RegExp, Button> {
        return this.cache
    }
}

export default buttonCache.getInstance()
