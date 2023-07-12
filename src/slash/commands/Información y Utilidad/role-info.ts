import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import Translator from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import { keys } from '../../../utils/locales.js'

export default class roleinfo extends Command {
    constructor() {
        super({
            name: 'roleinfo',
            description: 'Get information about a role.',
            name_localizations: {
                'es-ES': 'inforol',
                'en-US': 'roleinfo'
            },
            description_localizations: {
                'es-ES': 'Obtener información sobre un rol.',
                'en-US': 'Get information about a role.'
            },
            cooldown: 5,
            dm_permission: false,
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: 'role',
                    description: 'Role to get information about.',
                    name_localizations: {
                        'es-ES': 'rol',
                        'en-US': 'role'
                    },
                    description_localizations: {
                        'es-ES': 'El rol a obtener información sobre.',
                        'en-US': 'Role to get information about.'
                    },
                    required: true,
                },
            ],
        })
    }
    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        if (!interaction.inCachedGuild()) return
        const translate = Translator(interaction)
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
                    name: translate(keys.roleinfo.name),
                    value: '```' + role.name + '```',
                    inline: true,
                },
                {
                    name: translate(keys.roleinfo.id),
                    value: '```' + role.id + '```',
                    inline: true,
                },
                {
                    name: translate(keys.roleinfo.position),
                    value: '```' + Math.abs(role.position - interaction.guild!.roles.cache.size) + '```',
                    inline: true,
                },
                {
                    name: translate(keys.roleinfo.color),
                    value: '```' + role.color + '```',
                    inline: true,
                },
                {
                    name: translate(keys.roleinfo.mentionable),
                    value: role.mentionable
                        ? '```' + translate(keys.YES) + '```'
                        : '```' + translate(keys.NO) + '```',
                    inline: true,
                },
                {
                    name: translate(keys.roleinfo.separated),
                    value: role.hoist ? '```' + translate(keys.YES) + '```' : '```' + translate(keys.NO) + '```',
                    inline: true,
                },
                {
                    name: translate(keys.roleinfo.managed),
                    value: role.managed ? '```' + translate(keys.YES) + '```' : '```' + translate(keys.NO) + '```',
                    inline: true,
                },
            )
            .setImage(interaction.guild.iconURL())

        return interaction.reply({ embeds: [rol] })
    }
}
