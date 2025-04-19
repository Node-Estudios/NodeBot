import { ApplicationCommandOptionType, PermissionsBitField, PermissionFlagsBits, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalBuilder, ChannelType, Colors, } from 'discord.js';
import Translator, { keys } from '#utils/Translator.js';
import Command from '#structures/Command.js';
import Color from '#structures/Color.js';
export default class embed extends Command {
    constructor() {
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
                {
                    type: ApplicationCommandOptionType.Attachment,
                    name: 'image',
                    description: 'Image of the embed in format png, jpg, jpeg, gif, webp, bmp, tiff, tif',
                },
            ],
        });
    }
    async run(interaction) {
        const translate = Translator(interaction);
        const client = interaction.client;
        if (!interaction.inCachedGuild())
            return await interaction.reply({
                content: translate(keys.GENERICERROR, {
                    inviteURL: client.officialServerURL,
                }),
                ephemeral: true,
            });
        const channel = interaction.options.getChannel('channel', false, [ChannelType.GuildText]) ?? interaction.channel;
        if (!channel?.permissionsFor(interaction.guild.members.me).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks]))
            return await interaction.reply({
                content: Translator(interaction)(keys.embed.missing_permissions, {
                    permisions: new PermissionsBitField([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])
                        .toArray()
                        .map(p => p.replace(/([A-Z])/g, ' $&')?.trim())
                        .join(', '),
                }),
                ephemeral: true,
            });
        const colorInput = interaction.options.getString('color');
        let color = new Color(`${Colors.Default}`);
        if (colorInput && Color.isColor(colorInput))
            color = new Color(colorInput);
        const immage = interaction.options.getAttachment('image');
        console.log(immage?.url);
        return await interaction.showModal(new ModalBuilder()
            .setCustomId('embed:n:' + channel.id)
            .setTitle(translate(keys.embed.modal.title))
            .setComponents(new ActionRowBuilder().setComponents(new TextInputBuilder()
            .setCustomId('title')
            .setPlaceholder(translate(keys.embed.modal.title_placeholder))
            .setLabel(translate(keys.embed.modal.title_label))
            .setMaxLength(256)
            .setStyle(TextInputStyle.Short)
            .setRequired(false)), new ActionRowBuilder().setComponents(new TextInputBuilder()
            .setCustomId('description')
            .setPlaceholder(translate(keys.embed.modal.description_placeholder))
            .setLabel(translate(keys.embed.modal.description_label))
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)), new ActionRowBuilder().setComponents(new TextInputBuilder()
            .setCustomId('color')
            .setPlaceholder('#0F99A7')
            .setLabel(translate(keys.embed.modal.color_label))
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(color.hex)), new ActionRowBuilder().setComponents(new TextInputBuilder()
            .setCustomId('image')
            .setPlaceholder('https://imgur.com/Vicmk2N'))));
    }
}
//# sourceMappingURL=embed.js.map