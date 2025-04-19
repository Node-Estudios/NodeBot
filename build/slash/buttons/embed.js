import Button from '#structures/Button.js';
import Color from '#structures/Color.js';
import Translator, { keys } from '#utils/Translator.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
export default class Embed extends Button {
    constructor() {
        super(/embed:(e)|(p):\d*/);
    }
    async run(interaction) {
        const [, option] = interaction.customId.split(':');
        if (option === 'e')
            return await this.edit(interaction);
        if (option === 'p')
            return await this.publish(interaction);
    }
    async edit(interaction) {
        const [, , channelId] = interaction.customId.split(':');
        const translate = Translator(interaction);
        const { data: embed } = interaction.message.embeds[0];
        return await interaction.showModal(new ModalBuilder()
            .setCustomId('embed:e:' + channelId)
            .setTitle(translate(keys.embed.modal.title))
            .setComponents(new ActionRowBuilder().setComponents(new TextInputBuilder()
            .setCustomId('title')
            .setPlaceholder(translate(keys.embed.modal.title_placeholder))
            .setLabel(translate(keys.embed.modal.title_label))
            .setMaxLength(256)
            .setStyle(TextInputStyle.Short)
            .setValue(embed.title ?? '')
            .setRequired(false)), new ActionRowBuilder().setComponents(new TextInputBuilder()
            .setCustomId('description')
            .setPlaceholder(translate(keys.embed.modal.description_placeholder))
            .setLabel(translate(keys.embed.modal.description_label))
            .setStyle(TextInputStyle.Paragraph)
            .setValue(embed.description ?? '')
            .setRequired(false)), new ActionRowBuilder().setComponents(new TextInputBuilder()
            .setCustomId('color')
            .setPlaceholder('#0F99A7')
            .setLabel(translate(keys.embed.modal.color_label))
            .setStyle(TextInputStyle.Short)
            .setValue(new Color((typeof embed.color === 'number' ? `#${embed.color.toString(16).padStart(6, '0')}` : (embed.color ?? '#000000'))).hex)
            .setRequired(false))));
    }
    async publish(interaction) {
        const [, , channelId] = interaction.customId.split(':');
        const translate = Translator(interaction);
        const client = interaction.client;
        const { data: embed } = interaction.message.embeds[0];
        const channel = await client.channels.fetch(channelId);
        channel?.send({ embeds: [embed] })
            .then(async () => await interaction.reply({ content: translate(keys.embed.successfully), ephemeral: true }))
            .catch(async () => await interaction.reply({
            content: translate(keys.GENERICERROR, {
                inviteURL: client.officialServerURL,
            }),
            ephemeral: true,
        }));
    }
}
//# sourceMappingURL=embed.js.map