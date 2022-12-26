import { CommandInteraction } from 'discord.js'
export default class Command {
    name: string
    description: string
    args: any
    cooldown: number
    options: any
    name_localizations: any
    description_localizations: any
    permissions = { dev: false, botPermissions: [], userPermissions: [] }
    constructor(options: any) {
        this.name = options.name
        this.description = options.description
        this.args = options.args || false
        this.cooldown = options.cooldown || false
        this.options = options.options || []
        this.name_localizations = options.name_localizations || null
        this.description_localizations = options.description_localizations || null
        this.permissions = {
            dev: !!options.permissions?.dev,
            botPermissions: options.permissions?.botPermissions || [],
            userPermissions: options.permissions?.userPermissions || [],
        }
    }
    async run(interaction: CommandInteraction<'cached'>): Promise<any> {
        throw new Error(`Command ${this.name} doesn't provide a run method!`)
    }
}
