import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    PermissionsBitField,
    PermissionFlagsBits,
    TextInputBuilder,
    ActionRowBuilder,
    TextInputStyle,
    ModalBuilder,
    ChannelType,
    GuildMember,
} from 'discord.js'
import Translator, { keys } from '#utils/Translator.js'
import Command from '#structures/Command.js'
import Client from '#structures/Client.js'

export default class embed extends Command {
    constructor () {
        super({
            name: 'embed',
            description: 'Sends a embed.',
            cooldown: 5,
            dm_permission: false,
            permissions: {
                botPermissions: new PermissionsBitField([
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.EmbedLinks,
                    PermissionsBitField.Flags.ViewChannel,
                ]),
            },
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: 'channel',
                    channel_types: [ChannelType.GuildText],
                    description: 'Channel where the embed will be sent.',
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'color',
                    description: 'Color of the embed',
                    autocomplete: true,
                },
            // {
            //     type: ApplicationCommandOptionType.String,
            //     name: 'title',
            //     description: 'Title of the embed',
            //     required: true,
            // },
            // {
            //     type: ApplicationCommandOptionType.String,
            //     name: 'description',
            //     description: 'Description of the embed',
            //     required: true,
            // },
            ],
        })
    }

    override async run (interaction: ChatInputCommandInteraction) {
        const translate = Translator(interaction)
        const client = interaction.client as Client
        if (!interaction.inCachedGuild()) {
            return await interaction.reply({
                content: translate(keys.GENERICERROR, {
                    inviteURL: client.officialServerURL,
                }),
                ephemeral: true,
            })
        }
        const channel = interaction.options.getChannel('channel', false, [ChannelType.GuildText]) ?? interaction.channel
        if (!channel?.permissionsFor(interaction.guild.members.me as GuildMember).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])) {
            return await interaction.reply({
                content: Translator(interaction)(keys.embed.missing_permissions, {
                    permisions: new PermissionsBitField([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])
                        .toArray()
                        .map(p => p.replace(/([A-Z])/g, ' $&').trim())
                        .join(', '),
                }),
                ephemeral: true,
            })
        }
        return await interaction.showModal(
            new ModalBuilder()
                .setCustomId('embed:n:' + channel.id)
                .setTitle('Embed')
                .setComponents(
                    new ActionRowBuilder<TextInputBuilder>().setComponents(
                        new TextInputBuilder()
                            .setCustomId('title')
                            .setPlaceholder('My Awesome Embed')
                            .setLabel(translate(keys.embed.modal.title_label))
                            .setMaxLength(256)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false),
                    ),
                    new ActionRowBuilder<TextInputBuilder>().setComponents(
                        new TextInputBuilder()
                            .setCustomId('description')
                            .setPlaceholder('This is my awesome embed!')
                            .setLabel(translate(keys.embed.modal.description_label))
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(false),
                    ),
                ))
    }
}
