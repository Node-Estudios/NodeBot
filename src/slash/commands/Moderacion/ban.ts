import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js'
import Translator, { keys } from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'


export default class Ban extends Command {
    constructor() {
        super({
            name: 'ban',
            description: 'Ban a user from the server',
            name_localizations: {
                'es-ES': 'banear',
                'en-US': 'ban',
            },
            description_localizations: {
                'en-US': 'Ban a user from the server',
                'es-ES': 'Banea a un usuario del servidor',
            },
            dm_permission: false,
            only_dm: false,
            options: [
                { 
                    type: ApplicationCommandOptionType.User,
                    name: 'user',
                    description: 'User to ban',
                    required: true,
                    name_localizations: {
                        'es-ES': 'usuario',
                        'en-US': 'user',
                    },
                    description_localizations: {
                        'es-ES': 'Usuario a banear',
                        'en-US': 'User to ban',
                    },
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'reason',
                    description: 'Reason for the ban',
                    required: false,
                    name_localizations: {
                        'es-ES': 'razón',
                        'en-US': 'reason',
                    },
                    description_localizations: {
                        'es-ES': 'Razón del ban',
                        'en-US': 'Reason for the ban',
                    },
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: 'days',
                    description: 'Days to delete messages from the user',
                    required: false,
                    name_localizations: {
                        'es-ES': 'días',
                        'en-US': 'days',
                    },
                    description_localizations: {
                        'es-ES': 'Días para borrar mensajes del usuario',
                        'en-US': 'Days to delete messages from the user',
                    },
                }
            ]
        })
    }

    override async run(interaction: ChatInputCommandInteraction<'cached'>) {
        const translate = Translator(interaction)
        const member = interaction.options.getMember('user')
        if (!member) return interaction.reply({
            content: translate(keys.ban.not_found),
            ephemeral: true,
        })
        const reason = interaction.options.getString('reason') ?? 'No reason provided'
        const days = interaction.options.getInteger('days') ?? 0
        if (member.id === interaction.user.id) return interaction.reply({
            content: translate(keys.ban.self),
            ephemeral: true,
        })
        if (member.id === interaction.guild.ownerId) return interaction.reply({
            content: translate(keys.ban.owner),
            ephemeral: true,
        })
        if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({
            content: translate(keys.ban.higher),
            ephemeral: true,
        })
        if (!member.bannable) return interaction.reply({
            content: translate(keys.ban.unbannable),
            ephemeral: true,
        })
        return member.ban({ reason, deleteMessageSeconds: days * 86400 })
    }
}
