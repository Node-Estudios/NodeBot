import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js'
import Command from '../../../structures/Command'
import Client from '../../../structures/Client'
export default class avatar extends Command {
    constructor(client: Client) {
        super(client, {
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
    async run(client: Client, interaction: CommandInteraction, args: any) {
        let embed = new MessageEmbed()
        let member
        if (args[0]) {
            member = await interaction.guild?.members.fetch(args[0]).catch(e => {
                return interaction.user
            })
        }
        if (args[0] && !member) {
            const errorembed = new MessageEmbed()
                .setColor('RED')
                .setTitle(client.language.ERROREMBED)
                .setDescription(client.language.AVATAR[1])
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            return interaction.editReply({ embeds: [errorembed] })
        }
        if (!args[0]) {
            member = interaction.user
            embed.setColor(`00ff00` as ColorResolvable)
            embed.setImage(
                member.displayAvatarURL({
                    dynamic: true,
                    size: 4096,
                }),
            )
            interaction.editReply({ embeds: [embed] })
        } else {
            embed.setFooter({ text: `Aqui tienes el avatar de <@${member?.id}>!` })
            let memberAvatar = member?.displayAvatarURL({
                dynamic: true,
                size: 4096,
            })
            if (memberAvatar) embed.setImage(memberAvatar)
            embed.setColor('#00ff00')
            interaction.editReply({ embeds: [embed] })
        }
    }
}
