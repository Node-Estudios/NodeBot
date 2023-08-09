import fs from 'fs/promises'
import { SlashCommandAssertions } from 'discord.js'
import { join } from 'path'

for (const file of await fs.readdir(join(process.cwd(), 'locales'))) {
    const { default: json } = await import(join(process.cwd(), 'locales', file), { assert: { type: 'json' } })
    /** @type {{[key: string]:{name:string;description:string}}} */
    const command = json.commands
    for (const key in command) {
        const { name, description } = command[key]
        if (!name) {
            console.error(`\x1b[31mERROR:\x1b[0m: Missing name in \x1b[32m"${file}" for \x1b[32m"${key}" command`)
            process.exit(1)
        }
        if (!description) {
            console.error(`\x1b[31mERROR:\x1b[0m: Missing description in \x1b[32m"${file}" for \x1b[32m"${key}" command`)
            process.exit(1)
        }
        if (name.toLowerCase() !== name) {
            console.error(`\x1b[31mERROR:\x1b[0m: Name in \x1b[32m"${file}" for \x1b[32m"${key}" command is not lowercase`)
            process.exit(1)
        }
        if (name.length > 32) {
            console.error(`\x1b[31mERROR:\x1b[0m: Name in \x1b[32m"${file}" for \x1b[32m"${key}" command is too long`)
            process.exit(1)
        }
        try {
            SlashCommandAssertions.validateName(name)
        } catch (e) {
            console.error(`\x1b[31mERROR:\x1b[0m: Name in \x1b[32m"${file}" for \x1b[32m"${key}" command is not valid`, e)
            process.exit(1)
        }
        if (description.length > 100) {
            console.error(`\x1b[31mERROR:\x1b[0m: Description in \x1b[32m"${file}" for \x1b[32m"${key}" command is too long`)
            process.exit(1)
        }
        try {
            SlashCommandAssertions.validateDescription(description)
        } catch (e) {
            console.error(`\x1b[31mERROR:\x1b[0m: Description in \x1b[32m"${file}" for \x1b[32m"${key}" command is not valid`, e)
            process.exit(1)
        }
    }
}
