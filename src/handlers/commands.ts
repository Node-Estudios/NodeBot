import { readdir, readdirSync } from 'fs'
import client from '../bot.js'
import commands from '../cache/commands.js'
// cache commands
for (const dir of readdirSync('./build/slash/commands')) {
    for (const file of readdirSync(`./build/slash/commands/${dir}`)) {
        const commandFile = await import(`../../build/slash/commands/${dir}/${file}`)
        const command = new commandFile.default()
        commands.set(command.name, command)
    }
}
// cache buttons
const categories2 = readdirSync('./build/slash/buttons')
categories2.forEach(async category => {
    readdir(`./build/slash/buttons/${category}`, err => {
        if (err) return console.error(err)
        const button = readdirSync(`./build/slash/buttons/${category}`).filter(archivo => archivo.endsWith('.js'))
        // console.log(button)
        for (const archivo of button) {
            const a = require(`../../build/slash/buttons/${category}/${archivo}`).default
            try {
                if (typeof a === 'function') {
                    const command = new a(client)
                    client.buttons.set(a.name, command)
                }
            } catch (error) {
                logger.error({ a, error })
            }
            //   if (command.aliases && Array.isArray(command.aliases)) {
            //     for (let i = 0; i < command.aliases.length; i++) {
            //       client.aliases.set(command.aliases[i], command);
            //     }
            //   }
        }
    })
})
