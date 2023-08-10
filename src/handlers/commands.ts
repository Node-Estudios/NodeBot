import { readdir } from 'node:fs/promises'
import { Collection } from 'discord.js'
import logger from '#utils/logger.js'
import { join } from 'node:path'
// caches
import autocompletes from '#cache/autocomplete.js'
import commands from '#cache/commands.js'
import buttons from '#cache/buttons.js'
import modals from '#cache/modals.js'

// load commands
await loadCache(commands.getCache(), join(process.cwd(), 'build', 'slash', 'commands'))
// load buttons
await loadCache(buttons.getCache(), join(process.cwd(), 'build', 'slash', 'buttons'))
// load autocompletes
await loadCache(autocompletes.getCache(), join(process.cwd(), 'build', 'slash', 'autocompletes'))
// load modals
await loadCache(modals.getCache(), join(process.cwd(), 'build', 'slash', 'modals'))

// generic function to load cache
async function loadCache (cache: Collection<any, { name: any }>, dir: string) {
    const files = await readdir(join(dir), { recursive: true, withFileTypes: true })
    for (const file of files.filter(f => f.isFile() && f.name.endsWith('.js'))) {
        const { default: File } = await import(join(file.path, file.name))
        if (typeof File !== 'function') continue
        try {
            const instance = new File()
            if (!cache.has(instance.name)) cache.set(instance.name, instance)
        } catch (error) {
            logger.error(join(file.path, file.name), error)
        }
    }
}
