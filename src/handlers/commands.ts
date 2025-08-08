import { readdir, stat } from 'node:fs/promises'
import { Collection } from 'discord.js'
import logger from '#utils/logger.js'
import { join, dirname } from 'node:path'
// caches
import autocompletes from '#cache/autocompletes.js'
import commands from '#cache/commands.js'
import buttons from '#cache/buttons.js'
import modals from '#cache/modals.js'

// load commands
await loadCache(
    commands.cache,
    join(process.cwd(), 'build', 'slash', 'commands'),
)
// load buttons
await loadCache(buttons.cache, join(process.cwd(), 'build', 'slash', 'buttons'))
// load autocompletes
await loadCache(
    autocompletes.cache,
    join(process.cwd(), 'build', 'slash', 'autocompletes'),
)
// load modals
await loadCache(modals.cache, join(process.cwd(), 'build', 'slash', 'modals'))

// generic function to load cache
async function loadCache(cache: Collection<any, { name: any }>, dir: string) {
    async function processDirectory(currentDir: string, baseDir: string) {
        const entries = await readdir(currentDir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = join(currentDir, entry.name)

            if (entry.isDirectory()) {
                await processDirectory(fullPath, baseDir)
            } else if (entry.isFile() && entry.name.endsWith('.js')) {
                try {
                    const modulePath = join(currentDir, entry.name)
                    const { default: File } = await import(modulePath)

                    if (typeof File === 'function') {
                        const instance = new File()
                        if (!cache.has(instance.name)) {
                            cache.set(instance.name, instance)
                        }
                    }
                } catch (error) {
                    logger.error(`Error loading ${fullPath}:`, error)
                }
            }
        }
    }

    try {
        await processDirectory(dir, dir)
    } catch (error) {
        logger.error(`Error processing directory ${dir}:`, error)
    }
}
