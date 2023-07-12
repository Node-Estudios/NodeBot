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
                    name: `<:pepeblink:967941236029788160> ${translate(keys.NAME)}:`,
                    value: '```' + role.name + '```',
                    inline: true,
                },
                {
                    name: `<:textchannelblurple:893490117451333632> ${translate(keys.ID)}:`,
                    value: '```' + role.id + '```',
                    inline: true,
                },
                {
                    name: `🔢 ${translate(keys.POSITION)}:`,
                    value: '```' + Math.abs(role.position - interaction.guild!.roles.cache.size) + '```',
                    inline: true,
                },
                {
                    name: `🎩 ${translate(keys.COLOR)}:`,
                    value: '```' + role.color + '```',
                    inline: true,
                },
                {
                    name: `<:star:893553167915188275> ${translate(keys.MENTIONABLE)}:`,
                    value:'```' + translate(keys[role.mentionable?'YES':'NO']) + '```',
                    inline: true,
                },
                {
                    name: `<:share:893553167894216744> ${translate(keys.SEPARATED)}:`,
                    value:'```' + translate(keys[role.hoist?'YES':'NO']) + '```',
                    inline: true,
                },
                {
                    name: `<:cmd:894171593431994388> ${translate(keys.roleinfo.managed)}:`,
                    value:'```' + translate(keys[role.managed?'YES':'NO']) + '```',
                    inline: true,
                },
            )
            .setImage(interaction.guild.iconURL())

        return interaction.reply({ embeds: [rol] })
    }
}
