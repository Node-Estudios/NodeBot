import Client from '../structures/client';
import { readdirSync, readdir } from 'fs';
const categories = readdirSync('./build/slash/commands');
export default class Index {
    constructor(client: Client) {
        categories.forEach(async category => {
            readdir(`./build/slash/commands/${category}`, err => {
                if (err) return console.error(err);
                const iniciar = async () => {
                    const commands = readdirSync(`./build/slash/commands/${category}`).filter(archivo =>
                        archivo.endsWith('.js'),
                    );
                    // console.log(commands);
                    for (const archivo of commands) {
                        const a = require(`../../build/slash/commands/${category}/${archivo}`).default;
                        try {
                            if (typeof a === 'function') {
                                const command = new a(client);
                                client.commands.set(command.name.toLowerCase(), command);
                            }
                        } catch (error) {
                            client.logger.error({ a, error });
                        }
                        //   if (command.aliases && Array.isArray(command.aliases)) {
                        //     for (let i = 0; i < command.aliases.length; i++) {
                        //       client.aliases.set(command.aliases[i], command);
                        //     }
                        //   }
                    }
                };
                iniciar();
            });
        });
    }
}
