import { readdirSync } from 'fs';
import buttons from '../cache/buttons.js';
import commands from '../cache/commands.js';
import logger from '../utils/logger.js';
// cache commands
for (const dir of readdirSync('./build/slash/commands')) {
    for (const file of readdirSync(`./build/slash/commands/${dir}`)) {
        if (file.endsWith('.js')) {
            const commandFile = await import(`../../build/slash/commands/${dir}/${file}`)
            // console.log(typeof commandFile)
            if (typeof commandFile === 'object') {
                try {
                    const command = new commandFile.default()
                    if (!commands.getCache().get(command.name))
                        commands.getCache().set(command.name, command)
                } catch (e) {
                    logger.error(commandFile, e)
                }
            }
        }
    }
}
// cache buttons
for (const dir of readdirSync('./build/slash/buttons')) {
    for (const file of readdirSync(`./build/slash/buttons/${dir}`)) {
        if (file.endsWith('.js')) {
            const button = await import(`../../build/slash/buttons/${dir}/${file}`)
            if (button && button.default) buttons.getCache().set(button.default.name, button.default.run)
        }
    }
}
