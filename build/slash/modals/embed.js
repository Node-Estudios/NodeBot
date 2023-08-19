import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import EmbedBuilder from '#structures/EmbedBuilder.js';
import Translator, { keys } from '#utils/Translator.js';
import Modal from '#structures/Modal.js';
import Color from '#structures/Color.js';
import logger from '#utils/logger.js';
export default class Embed extends Modal {
    constructor() {
        super(/embed:(n)|(e):\d*/);
    }
    async run(interaction) {
        const translate = Translator(interaction);
        const [, option, channelId] = interaction.customId.split(':');
        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description');
        const color = interaction.fields.getTextInputValue('color');
        if (!title && !description)
            return;
        const embed = new EmbedBuilder();
        if (title)
            embed.setTitle(title);
        if (description)
            embed.setDescription(description);
        if (color && Color.isColor(color))
            embed.setColor(new Color(color).hex);
        if (option === 'n')
            return await interaction.reply({
                content: !Color.isColor(color) ? translate(keys.embed.invalid_input) : undefined,
                embeds: [embed],
                ephemeral: true,
                components: [
                    new ActionRowBuilder().setComponents(new ButtonBuilder().setCustomId('embed:e:' + channelId).setLabel('Edit').setStyle(ButtonStyle.Primary), new ButtonBuilder().setCustomId('embed:p:' + channelId).setLabel('Publish').setStyle(ButtonStyle.Success)),
                ],
            }).catch(logger.error);
        if (interaction.isFromMessage())
            return await interaction.update({ embeds: [embed], components: interaction.message?.components }).catch(logger.error);
        await interaction.deferUpdate().catch(logger.error);
    }
}
//# sourceMappingURL=embed.js.map