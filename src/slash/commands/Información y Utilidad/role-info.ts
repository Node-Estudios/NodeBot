import { ColorResolvable, EmbedBuilder as EmbedBuilder } from 'discord.js'
import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'

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
            dm_permission: false,
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
    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        if (!interaction.inCachedGuild()) return
        const language = interaction.language
        let role = interaction.options.getRole('role', true)
        const rol = new EmbedBuilder()
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp()
            .setColor(role.color || '#1DC44F')
            .setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL() ?? undefined,
            })
            .setFields(
                {
                    name: `<:pepeblink:967941236029788160> ${language.ROLEINFO[1]}: `,
                    value: '```' + role.name + '```',
                    inline: true,
                },
                {
                    name: `<:textchannelblurple:893490117451333632> ${language.ROLEINFO[2]}: `,
                    value: '```' + role.id + '```',
                    inline: true,
                },
                {
                    name: `🔢 ${language.ROLEINFO[4]}: `,
                    value: '```' + Math.abs(role.position - interaction.guild!.roles.cache.size) + '```',
                    inline: true,
                },
                {
                    name: `🎩 ${language.ROLEINFO[5]}: `,
                    value: '```' + role.color + '```',
                    inline: true,
                },
                {
                    name: `<:star:893553167915188275> ${language.ROLEINFO[6]}: `,
                    value: role.mentionable
                        ? '```' + language.ROLEINFO[10] + '```'
                        : '```' + language.ROLEINFO[11] + '```',
                    inline: true,
                },
                {
                    name: `<:share:893553167894216744> ${language.ROLEINFO[7]}: `,
                    value: role.hoist ? '```' + language.ROLEINFO[10] + '```' : '```' + language.ROLEINFO[11] + '```',
                    inline: true,
                },
                {
                    name: `<:cmd:894171593431994388> ${language.ROLEINFO[8]}: `,
                    value: role.managed ? '```' + language.ROLEINFO[10] + '```' : '```' + language.ROLEINFO[11] + '```',
                    inline: true,
                },
            )
            .setImage(interaction.guild.iconURL())

        return interaction.reply({ embeds: [rol] })
    }
}
