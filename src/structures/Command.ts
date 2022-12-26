import { CommandInteraction } from 'discord.js'
export default class Command {
    opciones: any
    name: string
    description: any
    args: any
    cooldown: any
    options: any
    name_localizations: any
    description_localizations: any
    permissions: { dev: any; botPermissions: any; userPermissions: any }
    constructor(options: any) {
        this.name = options.name
        this.description = options.description
        this.args = options.args || false
        this.cooldown = options.cooldown || false
        this.options = options.options || []
        this.name_localizations = options.name_localizations || null
        this.description_localizations = options.description_localizations || null
        this.permissions = {
            dev: options.permissions ? options.permissions.dev || false : false,
            botPermissions: options.permissions ? options.permissions.botPermissions || [] : [],
            userPermissions: options.permissions ? options.permissions.userPermissions || [] : [],
        }
    }
    async run(interaction: CommandInteraction, args: (string | number | boolean)[]) {
        throw new Error(`Command ${this.name} doesn't provide a run method!`)
    }
}
