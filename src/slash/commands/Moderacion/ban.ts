import Command from '../../../structures/Command.js'

export default class Ban extends Command {
    constructor() {
        super({
            name: 'ban',
            description: 'Banea a un usuario del servidor',
            dm_permission: false,
            only_dm: false,
        })
    }
}
