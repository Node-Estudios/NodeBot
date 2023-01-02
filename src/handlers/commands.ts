import { readdirSync } from 'fs'
import commands from '../cache/commands.js'
// cache commands
for (const dir of readdirSync('./build/slash/commands')) {
    for (const file of readdirSync(`./build/slash/commands/${dir}`)) {
        if (file.endsWith('.js')) {
            const commandFile = await import(`../../build/slash/commands/${dir}/${file}`)
            const command = new commandFile.default()
            commands.set(command.name, command)
        }
    }
}
// cache buttons
// for (const dir of readdirSync('./build/slash/buttons')) {
//     for (const file of readdirSync(`./build/slash/commands/${dir}`)) {
//         const button = await import(`../../build/slash/commands/${dir}/${file}`)
//         buttons.set(button.name, button.run)
//     }
// }
