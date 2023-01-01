import { CacheType, CommandInteraction } from 'discord.js'
import Client from './Client'
export default class Command {
    name: string
    description: string
    args: any
    cooldown: number
    options: any
    name_localizations: any
    description_localizations: any
    only?: { guilds: boolean, dm: boolean }
    permissions: { dev: boolean, botPermissions: String[], userPermissions: String[] }
    constructor(options: any) {
        this.name = options.name
        this.description = options.description
        this.args = options.args || false
        this.cooldown = options.cooldown || false
        this.options = options.options || []
        //TODO: Add funcitonality in interactionCreate for this.only && add more options
        this.only = { guilds: options.only?.guilds, dm: options.only?.dm }
        this.name_localizations = options.name_localizations || null
        this.description_localizations = options.description_localizations || null
        this.permissions = {
            dev: !!options.permissions?.dev,
            botPermissions: options.permissions?.botPermissions || [],
            userPermissions: options.permissions?.userPermissions || [],
        }
    }
    async _run(client: Client, interaction: CommandInteraction<CacheType>, args: number[] | string[] | boolean[]): Promise<any> {
        throw new Error(`Command ${this.name} doesn't provide a run method!`)
    }
}
