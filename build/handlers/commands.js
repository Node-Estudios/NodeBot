import { readdir } from 'node:fs/promises';
import logger from '#utils/logger.js';
import { join } from 'node:path';
import autocompletes from '#cache/autocompletes.js';
import commands from '#cache/commands.js';
import buttons from '#cache/buttons.js';
import modals from '#cache/modals.js';
await loadCache(commands.cache, join(process.cwd(), 'build', 'slash', 'commands'));
await loadCache(buttons.cache, join(process.cwd(), 'build', 'slash', 'buttons'));
await loadCache(autocompletes.cache, join(process.cwd(), 'build', 'slash', 'autocompletes'));
await loadCache(modals.cache, join(process.cwd(), 'build', 'slash', 'modals'));
async function loadCache(cache, dir) {
    const files = await readdir(join(dir), { recursive: true, withFileTypes: true });
    for (const file of files.filter(f => f.isFile() && f.name.endsWith('.js'))) {
        const { default: File } = await import(join(file.path, file.name));
        if (typeof File !== 'function')
            continue;
        try {
            const instance = new File();
            if (!cache.has(instance.name))
                cache.set(instance.name, instance);
        }
        catch (error) {
            logger.error(join(file.path, file.name), error);
        }
    }
}
//# sourceMappingURL=commands.js.map