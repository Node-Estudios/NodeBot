import { EmbedBuilder as EmbedBuilder } from 'discord.js'
import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'
export default class avatar extends Command {
    constructor() {
        super({
            name: 'avatar',
            description: 'Send your avatar!',
            name_localizations: {
                'es-ES': 'perfil',
                'en-US': 'profile',
            },
            description_localizations: {
                'es-ES': 'Envia tu foto de perfil o de otro usuario.',
                'en-US': 'Send your avatar or the other user one!',
            },
            cooldown: 5,
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: 'The user to get the avatar of.',
                    name_localizations: {
                        'es-ES': 'usuario',
                        'en-US': 'user',
                    },
                    description_localizations: {
                        'es-ES': 'La foto de perfil del usuario que quieres ver.',
                        'en-US': 'The user to get the avatar of. xD',
                    },
                },
            ],
        })
    }
    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        const language = interaction.language
        const client = interaction.client as Client
        const member = interaction.options.getUser('user') ?? interaction.user
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setImage(member.displayAvatarURL({ size: 4096 }))
                    .setFooter({ text: `Aqui tienes el avatar de <@${member.id}>!` }),
            ],
        })
    }
}
