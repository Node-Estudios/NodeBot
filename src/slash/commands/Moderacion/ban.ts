import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
} from 'discord.js'
import Command from '#structures/Command.js'
import Translator, { keys } from '#utils/Translator.js'

export default class Ban extends Command {
    constructor() {
        super({
            name: 'ban',
            description: 'Ban a user from the server',
            dm_permission: false,
            only_dm: false,
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: 'user',
                    description: 'User to ban',
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'reason',
                    description: 'Reason for the ban',
                    required: false,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: 'days',
                    description: 'Days to delete messages from the user',
                    required: false,
                },
            ],
        })
    }

    override async run(interaction: ChatInputCommandInteraction<'cached'>) {
        const translate = Translator(interaction)
        const member = interaction.options.getMember('user')
        if (!member) {
            return await interaction.reply({
                content: translate(keys.ban.not_found),
                ephemeral: true,
            })
        }
        const reason =
            interaction.options.getString('reason') ?? 'No reason provided'
        const days = interaction.options.getInteger('days') ?? 0
        if (member.id === interaction.user.id) {
            return await interaction.reply({
                content: translate(keys.ban.self),
                ephemeral: true,
            })
        }
        if (member.id === interaction.guild.ownerId) {
            return await interaction.reply({
                content: translate(keys.ban.owner),
                ephemeral: true,
            })
        }
        if (
            member.roles.highest.position >=
            interaction.member.roles.highest.position
        ) {
            return await interaction.reply({
                content: translate(keys.ban.higher),
                ephemeral: true,
            })
        }
        if (!member.bannable) {
            return await interaction.reply({
                content: translate(keys.ban.unbannable),
                ephemeral: true,
            })
        }
        return await member.ban({ reason, deleteMessageSeconds: days * 86400 })
    }
}
