// commands.ts
import { Collection } from 'discord.js'
import { BaseEvent } from '#structures/Events.js'
class EventCache {
    private static instance: EventCache
    private readonly cache: Collection<string, BaseEvent>

    private constructor () {
        this.cache = new Collection<string, BaseEvent>()
    }

    public static getInstance (): EventCache {
        if (!EventCache.instance) {
            EventCache.instance = new EventCache()
        }
        return EventCache.instance
    }

    public getCache (): Collection<string, BaseEvent> {
        return this.cache
    }
}

export default EventCache.getInstance()
