import { readdir } from 'node:fs/promises'
import { Collection } from 'discord.js'
import logger from '#utils/logger.js'
import { join } from 'node:path'
// caches
import autocompletes from '#cache/autocompletes.js'
import commands from '#cache/commands.js'
import buttons from '#cache/buttons.js'
import modals from '#cache/modals.js'



async function loadHandlers() {
    // load commands
    await loadCache(
        commands.cache,
        join(process.cwd(), 'build', 'slash', 'commands'),
    )
    // load buttons
    await loadCache(
        buttons.cache,
        join(process.cwd(), 'build', 'slash', 'buttons'),
    )
    // load autocompletes
    await loadCache(
        autocompletes.cache,
        join(process.cwd(), 'build', 'slash', 'autocompletes'),
    )
    // load modals
    await loadCache(
        modals.cache,
        join(process.cwd(), 'build', 'slash', 'modals'),
    )
}

// CAMBIO: La función ha sido reescrita para ser recursiva y construir la ruta manualmente
async function loadCache(
    cache: Collection<any, { name: any }>,
    directory: string,
) {
    try {
        const files = await readdir(directory, { withFileTypes: true })

        for (const file of files) {
            const fullPath = join(directory, file.name)

            if (file.isDirectory()) {
                // Si es un directorio, llamamos a la función de nuevo para ese directorio
                await loadCache(cache, fullPath)
            } else if (file.isFile() && file.name.endsWith('.js')) {
                // Si es un archivo .js, lo importamos
                try {
                    const { default: File } = await import(fullPath)
                    if (typeof File !== 'function') continue

                    const instance = new File()
                    if (!cache.has(instance.name)) {
                        cache.set(instance.name, instance)
                    }
                } catch (error) {
                    logger.error(
                        `Error al cargar el archivo: ${fullPath}`,
                        error,
                    )
                }
            }
        }
    } catch (error) {
        logger.error(`No se pudo leer el directorio: ${directory}`, error)
    }
}



export { loadHandlers }
