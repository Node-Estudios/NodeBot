// commands.ts
import { Collection } from 'discord.js'
import Command from '../structures/Command'

class CommandCache {
    private static instance: CommandCache
    private readonly cache: Collection<string, Command>

    private constructor () {
        this.cache = new Collection<string, Command>()
    }

    public static getInstance (): CommandCache {
        if (!CommandCache.instance) {
            CommandCache.instance = new CommandCache()
        }
        return CommandCache.instance
    }

    public getCache (): Collection<string, Command> {
        return this.cache
    }
}

export default CommandCache.getInstance()
