import { ModalSubmitInteraction, CacheType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import Modal from '#structures/Modal.js'

export default class Embed extends Modal {
    constructor () {
        super(/embed:(n)|(e):\d*/)
    }

    override async run (interaction: ModalSubmitInteraction<CacheType>): Promise<any> {
        const [,option, channelId] = interaction.customId.split(':')
        const title = interaction.fields.getTextInputValue('title')
        const description = interaction.fields.getTextInputValue('description')
        if (!title && !description) return // ignore if no title or description
        const embed = new EmbedBuilder()
        if (title) embed.setTitle(title)
        if (description) embed.setDescription(description)
        if (option === 'n') {
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
                components: [
                    new ActionRowBuilder<ButtonBuilder>().setComponents(
                        new ButtonBuilder().setCustomId('embed:e:' + channelId).setLabel('Edit').setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId('embed:p:' + channelId).setLabel('Publish').setStyle(ButtonStyle.Success),
                    ),
                ],
            })
        }
        if (interaction.isFromMessage()) return await interaction.update({ embeds: [embed], components: interaction.message?.components })
        interaction.deferUpdate()
    }
}
