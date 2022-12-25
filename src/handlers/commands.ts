import { readdir, readdirSync } from 'fs'
import Client from '../structures/client'
const categories = readdirSync('./build/slash/commands')
const categories2 = readdirSync('./build/slash/buttons')
export default class Index {
    constructor(client: Client) {
        categories.forEach(async category => {
            readdir(`./build/slash/commands/${category}`, err => {
                if (err) return console.error(err)
                const iniciar = async () => {
                    const commands = readdirSync(`./build/slash/commands/${category}`).filter(archivo =>
                        archivo.endsWith('.js'),
                    )
                    // console.log(commands);
                    for (const archivo of commands) {
                        const a = require(`../../build/slash/commands/${category}/${archivo}`).default
                        try {
                            if (typeof a === 'function') {
                                const command = new a(client)
                                client.commands.set(command.name.toLowerCase(), command)
                            }
                        } catch (error) {
                            client.logger.error({ a, error })
                        }
                        //   if (command.aliases && Array.isArray(command.aliases)) {
                        //     for (let i = 0; i < command.aliases.length; i++) {
                        //       client.aliases.set(command.aliases[i], command);
                        //     }
                        //   }
                    }
                }
                iniciar()
            })
        })
        categories2.forEach(async category => {
            readdir(`./build/slash/buttons/${category}`, err => {
                if (err) return console.error(err)
                const iniciar = async () => {
                    const button = readdirSync(`./build/slash/buttons/${category}`).filter(archivo =>
                        archivo.endsWith('.js'),
                    )
                    // console.log(button)
                    for (const archivo of button) {
                        const a = require(`../../build/slash/buttons/${category}/${archivo}`).default
                        try {
                            if (typeof a === 'function') {
                                const command = new a(client)
                                client.buttons.set(a.name, command)
                            }
                        } catch (error) {
                            client.logger.error({ a, error })
                        }
                        //   if (command.aliases && Array.isArray(command.aliases)) {
                        //     for (let i = 0; i < command.aliases.length; i++) {
                        //       client.aliases.set(command.aliases[i], command);
                        //     }
                        //   }
                    }
                }
                iniciar()
            })
        })
    }
}
