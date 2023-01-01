import { MessageEmbed } from 'discord.js'
import { interactionCommandExtend } from '../../../events/client/interactionCreate.js'
import langFile from '../../../lang/index.json' assert { type: 'json' }
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
    async run(interaction: interactionCommandExtend, args: any[]) {
        const language = await import('../lang/' + langFile.find(l => l.nombre == interaction.language)?.archivo, { assert: { type: "json" } })
        const client = interaction.client as Client
        const member = interaction.options.getUser('user') ?? interaction.user
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('GREEN')
                    .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setFooter({ text: `Aqui tienes el avatar de <@${member.id}>!` }),
            ],
        })
    }
}
