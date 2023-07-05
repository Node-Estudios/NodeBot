import { AttachmentBuilder } from 'discord.js'
import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
import Command from '../../../structures/Command.js'
export default class mcserver extends Command {
    constructor() {
        super({
            name: 'mcserver',
            description: 'Send a image of a Minecraft server.',
            description_localizations: {
                'es-ES': 'Envía una imagen de un servidor de Minecraft.',
            },
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: 'server',
                    description: 'Minecraft server to show the image of.',
                    name_localizations: {
                        'es-ES': 'servidor',
                    },
                    description_localizations: {
                        'es-ES': 'Servidor de Minecraft.',
                    },
                    required: true,
                },
            ],
        })
    }

    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        const server = interaction.options.getString('server', true)
        interaction.reply({
            files: [
                new AttachmentBuilder(`http://status.mclive.eu/${server}/${server}/banner.png`, {
                    name: server + '.png',
                }),
            ],
        })
    }
}
