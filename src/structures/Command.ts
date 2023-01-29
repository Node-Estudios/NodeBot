import logger from "../utils/logger.js";
import Client from "./Client.js";

interface Commands {
    run(client: Client, ...args: any[]): Promise<void>;
}

export default class Command {
    [x: string]: any;
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
    async _run(run: (...args: any[]) => Promise<any>): Promise<any> {
        try {
            return await run().then((data) => {
                return data
            })
        } catch (err) {
            // TODO: Add error handler
            logger.error(err);
        }
    }
}
