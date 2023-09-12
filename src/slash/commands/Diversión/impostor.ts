/* eslint-disable no-irregular-whitespace */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js'
import Command from '#structures/Command.js'
import Translator, { keys } from '#utils/Translator.js'
import logger from '#utils/logger.js'

export default class impostor extends Command {
    constructor () {
        super({
            name: 'impostor',
            description: 'Are you the impostor? SUS',
            cooldown: 5,
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: 'user',
                    description: 'Are this user the impostor? SUS na na na na na na na',
                    required: false,
                },
            ],
        })
    }

    override async run (interaction: ChatInputCommandInteraction) {
        const trnaslate = Translator(interaction)
        interaction.reply(`. 　　　。　　　　•　 　ﾟ　　。 　　.

        　　　.　　　 　　.　　　　　。　　 。　. 　

        .　　 。　　　　　 ඞ 。 . 　　 • 　　　　•

        　　ﾟ　　 ${trnaslate(keys.impostor[Math.random() < 0.7 ? 'was' : 'was_not'], {
        user: String(interaction.options.getUser('user') ?? interaction.user),
    })} 　 。　.  　 。　.

        　　'　　　  　 　　。     ,         ﾟ             ,   ﾟ      .       ,        .             ,

        　　ﾟ　　　.　　　. ,　　　　.　 .`).catch(logger.error)
    }
}
