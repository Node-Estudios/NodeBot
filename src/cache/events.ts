// commands.ts
import { Collection } from 'discord.js'
import { BaseEvent } from '../structures/Events'
class eventCache {
    private static instance: eventCache
    private cache: Collection<string, BaseEvent>

    private constructor() {
        this.cache = new Collection<string, BaseEvent>()
    }

    public static getInstance(): eventCache {
        if (!eventCache.instance) {
            eventCache.instance = new eventCache()
        }
        return eventCache.instance
    }

    public getCache(): Collection<string, BaseEvent> {
        return this.cache
    }
}

export default eventCache.getInstance()
