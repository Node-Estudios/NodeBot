/* eslint-disable no-irregular-whitespace */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js'
import Translator, { keys } from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'

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
                    name_localizations: {
                        'es-ES': 'usuario',
                        'en-US': 'user',
                    },
                    description_localizations: {
                        'es-ES': 'Es este usuario el impostor? SUS na na na na na na na',
                        'en-US': 'Are this user the impostor? SUS na na na na na na na',
                    },
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

        　　ﾟ　　 ${(interaction.options.getUser('user') ?? interaction.user).tag} ${
    Math.random() < 0.7 ? trnaslate(keys.impostor.was_not) : trnaslate(keys.impostor.was)
} 　 。　.

        　　'　　　  　 　　。     ,         ﾟ             ,   ﾟ      .       ,        .             ,

        　　ﾟ　　　.　　　. ,　　　　.　 .`)
    }
}
