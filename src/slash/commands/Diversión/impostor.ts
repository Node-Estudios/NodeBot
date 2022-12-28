import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'
import { CommandInteraction } from 'discord.js'

export default class impostor extends Command {
    constructor() {
        super({
            name: 'impostor',
            description: 'Are you the impostor? SUS',
            description_localizations: {
                'es-ES': 'Eres el impostor? SUS',
            },
            cooldown: 5,
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: 'Are this user the impostor? SUS na na na na na na na',
                    name_localizations: {
                        'es-ES': 'usuario',
                    },
                    description_localizations: {
                        'es-ES': 'Es este usuario el impostor? SUS na na na na na na na',
                    },
                    required: false,
                },
            ],
        })
    }

    override async run(interaction: CommandInteraction<'cached'>) {
        const client = interaction.client as Client
        interaction.reply(`. 　　　。　　　　•　 　ﾟ　　。 　　.

        　　　.　　　 　　.　　　　　。　　 。　. 　

        .　　 。　　　　　 ඞ 。 . 　　 • 　　　　•

        　　ﾟ　　 ${(interaction.options.getUser('user') ?? interaction.user).tag} ${
            Math.random() < 0.7 ? client.language.IMPOSTOR[1] : client.language.IMPOSTOR[2]
        } 　 。　.

        　　'　　　  　 　　。     ,         ﾟ             ,   ﾟ      .       ,        .             ,

        　　ﾟ　　　.　　　. ,　　　　.　 .`)
    }
}
