import { CommandInteraction, MessageEmbed } from 'discord.js'
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
    override async run(interaction: CommandInteraction<'cached'>) {
        const member = interaction.options.getMember('user') ?? interaction.member
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('GREEN')
                    .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setFooter({ text: `Aqui tienes el avatar de <@${member.displayName}>!` }),
            ],
        })
    }
}
