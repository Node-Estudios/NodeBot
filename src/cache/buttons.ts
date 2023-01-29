// commandCache.ts
import { Collection } from 'discord.js'
import { interactionButtonExtend } from '../events/client/interactionCreate'
import Client from '../structures/Client'
type Button = (client: Client, interaction: interactionButtonExtend) => Promise<any>

class buttonCache {
    private static instance: buttonCache
    private cache: Collection<string, Button>

    private constructor() {
        this.cache = new Collection<string, Button>()
    }

    public static getInstance(): buttonCache {
        if (!buttonCache.instance) {
            buttonCache.instance = new buttonCache()
        }
        return buttonCache.instance
    }

    public getCache(): Collection<string, Button> {
        return this.cache
    }
}

export default buttonCache.getInstance()