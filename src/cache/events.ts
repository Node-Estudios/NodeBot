// commands.ts
import { Collection } from 'discord.js'
import { BaseEvent } from '#structures/Events.js'
class EventCache {
    private static instance: EventCache
    #cache: Collection<string, BaseEvent>

    private constructor () {
        this.#cache = new Collection<string, BaseEvent>()
    }

    static getInstance (): EventCache {
        if (!EventCache.instance) {
            EventCache.instance = new EventCache()
        }
        return EventCache.instance
    }

    get cache (): Collection<string, BaseEvent> {
        return this.#cache
    }
}

export default EventCache.getInstance()
