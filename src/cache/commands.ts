// commands.ts
import { Collection } from 'discord.js'
import Command from '#structures/Command.js'

class CommandCache {
    private static instance: CommandCache
    #cache: Collection<string, Command>

    private constructor () {
        this.#cache = new Collection<string, Command>()
    }

    static getInstance (): CommandCache {
        if (!CommandCache.instance) {
            CommandCache.instance = new CommandCache()
        }
        return CommandCache.instance
    }

    get cache (): Collection<string, Command> {
        return this.#cache
    }
}

export default CommandCache.getInstance()
