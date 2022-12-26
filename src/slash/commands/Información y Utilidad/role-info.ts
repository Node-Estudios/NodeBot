import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js'
import Command from '../../../structures/Command.js'
import client from '../../../bot.js'

export default class roleinfo extends Command {
    constructor() {
        super({
            name: 'roleinfo',
            description: 'Get information about a role.',
            name_localizations: {
                'es-ES': 'inforol',
            },
            description_localizations: {
                'es-ES': 'Obtener información sobre un rol.',
            },
            cooldown: 5,
            options: [
                {
                    type: 8,
                    name: 'role',
                    description: 'Role to get information about.',
                    name_localizations: {
                        'es-ES': 'role',
                    },
                    description_localizations: {
                        'es-ES': 'El rol a obtener información sobre.',
                    },
                    required: true,
                },
            ],
        })
    }
    override async run(interaction: CommandInteraction<'cached'>) {
        let role = interaction.options.getRole('role', true)
        const rol = new MessageEmbed()
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor((role.hexColor as ColorResolvable) || ('#1DC44F' as ColorResolvable))
            .setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ dynamic: true }) ?? '',
            })
            .setFields(
                {
                    name: `<:pepeblink:967941236029788160> ${client.language.ROLEINFO[1]}: `,
                    value: '```' + role.name + '```',
                    inline: true,
                },
                {
                    name: `<:textchannelblurple:893490117451333632> ${client.language.ROLEINFO[2]}: `,
                    value: '```' + role.id + '```',
                    inline: true,
                },
                {
                    name: `🔢 ${client.language.ROLEINFO[4]}: `,
                    value: '```' + Math.abs(role.rawPosition - interaction.guild.roles.cache.size) + '```',
                    inline: true,
                },
                {
                    name: `🎩 ${client.language.ROLEINFO[5]}: `,
                    value: '```' + role.hexColor + '```',
                    inline: true,
                },
                {
                    name: `<:star:893553167915188275> ${client.language.ROLEINFO[6]}: `,
                    value: role.mentionable
                        ? '```' + client.language.ROLEINFO[10] + '```'
                        : '```' + client.language.ROLEINFO[11] + '```',
                    inline: true,
                },
                {
                    name: `<:share:893553167894216744> ${client.language.ROLEINFO[7]}: `,
                    value: role.hoist
                        ? '```' + client.language.ROLEINFO[10] + '```'
                        : '```' + client.language.ROLEINFO[11] + '```',
                    inline: true,
                },
                {
                    name: `<:cmd:894171593431994388> ${client.language.ROLEINFO[8]}: `,
                    value: role.managed
                        ? '```' + client.language.ROLEINFO[10] + '```'
                        : '```' + client.language.ROLEINFO[11] + '```',
                    inline: true,
                },
            )
            .setImage(interaction.guild.iconURL({ dynamic: true }) ?? '')

        return interaction.editReply({ embeds: [rol] })
    }
}
