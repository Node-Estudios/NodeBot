import { CommandInteraction } from 'discord.js'
import Client from './Client'
export default class Event {
    name: string
    description: string
    constructor(options: any) {
        this.name = options.name
        this.description = options.description
    }
    async run(interaction: CommandInteraction<'cached'>, Client: Client): Promise<any> {
        throw new Error(`Command ${this.name} doesn't provide a run method!`)
    }
}
