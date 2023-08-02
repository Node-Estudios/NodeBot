import Button from '../structures/Button.js'
import commands from '../cache/commands.js'
import { readdir } from 'node:fs/promises'
import buttons from '../cache/buttons.js'
import logger from '../utils/logger.js'
import Autocomplete from '../structures/Autocomplete.js'
import autoCompleteCache from '../cache/autocomplete.js'
// cache commands
for (const dir of await readdir('./build/slash/commands')) {
    for (const file of await readdir(`./build/slash/commands/${dir}`)) {
        if (file.endsWith('.js')) {
            const { default: commandFile } = await import(`../../build/slash/commands/${dir}/${file}`)
            if (typeof commandFile === 'function') {
                try {
                    const command = new commandFile()
                    if (!commands.getCache().has(command.name)) commands.getCache().set(command.name, command)
                } catch (e) {
                    logger.error(commandFile, e)
                }
            }
        }
    }
}
// cache buttons
for (const dir of await readdir('./build/slash/buttons')) {
    for (const file of await readdir(`./build/slash/buttons/${dir}`)) {
        if (file.endsWith('.js')) {
            const { default: buttonFile } = await import(`../../build/slash/buttons/${dir}/${file}`)
            if (typeof buttonFile === 'function') {
                try {
                    const button = new buttonFile() as Button
                    if (!buttons.getCache().has(button.pattern)) buttons.getCache().set(button.pattern, button)
                } catch (e) {
                    logger.error(buttonFile, e)
                }
            }
        }
    }
}
for (const dir of await readdir('./build/slash/autocomplete')) {
    for (const file of await readdir(`./build/slash/autocomplete/${dir}`)) {
        if (file.endsWith('.js')) {
            const { default: autocompleteFile } = await import(`../../build/slash/autocomplete/${dir}/${file}`)
            if (typeof autocompleteFile === 'function') {
                try {
                    const autocomplete = new autocompleteFile() as Autocomplete
                    if (!autoCompleteCache.getCache().has(autocomplete.pattern)) autoCompleteCache.getCache().set(autocomplete.pattern, autocomplete)
                } catch (e) {
                    logger.error(autocompleteFile, e)
                }
            }
        }
    }
}
