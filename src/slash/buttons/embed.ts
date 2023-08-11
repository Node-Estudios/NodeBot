import Button from '#structures/Button.js'
import Client from '#structures/Client.js'
import Color from '#structures/Color.js'
import Translator, { keys } from '#utils/Translator.js'

import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from 'discord.js'

export default class Embed extends Button {
    constructor () {
        super(/embed:(e)|(p):\d*/)
    }

    override async run (interaction: ButtonInteraction): Promise<any> {
        const [,option] = interaction.customId.split(':')
        if (option === 'e') return await this.edit(interaction)
        if (option === 'p') return await this.publish(interaction)
    }

    async edit (interaction: ButtonInteraction): Promise<any> {
        const [,, channelId] = interaction.customId.split(':')
        const translate = Translator(interaction)
        const { data: embed } = interaction.message.embeds[0]
        return await interaction.showModal(new ModalBuilder().setCustomId('embed:e:' + channelId).setTitle('Embed').setComponents(
            new ActionRowBuilder<TextInputBuilder>().setComponents(
                new TextInputBuilder()
                    .setCustomId('title')
                    .setPlaceholder('My Awesome Embed')
                    .setLabel(translate(keys.embed.modal.title_label))
                    .setMaxLength(256)
                    .setStyle(TextInputStyle.Short)
                    .setValue(embed.title ?? '')
                    .setRequired(false),
            ),
            new ActionRowBuilder<TextInputBuilder>().setComponents(
                new TextInputBuilder()
                    .setCustomId('description')
                    .setPlaceholder('This is my awesome embed!')
                    .setLabel(translate(keys.embed.modal.description_label))
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue(embed.description ?? '')
                    .setRequired(false),
            ),
            new ActionRowBuilder<TextInputBuilder>().setComponents(
                new TextInputBuilder()
                    .setCustomId('color')
                    .setPlaceholder('#0F99A7')
                    .setLabel(translate(keys.embed.modal.color_label))
                    .setStyle(TextInputStyle.Short)
                    .setValue(new Color(`${embed.color}` ?? '#000000').hex)
                    .setRequired(false),
            ),
        ))
    }

    async publish (interaction: ButtonInteraction): Promise<any> {
        const [,, channelId] = interaction.customId.split(':')
        const translate = Translator(interaction)
        const client = interaction.client as Client
        const { data: embed } = interaction.message.embeds[0]
        const channel = await client.channels.fetch(channelId) as TextChannel
        channel?.send({ embeds: [embed] })
            .then(async () => await interaction.reply({ content: 'Embed published!', ephemeral: true }))
            .catch(async () => await interaction.reply({
                content: translate(keys.GENERICERROR, {
                    inviteURL: client.officialServerURL,
                }),
                ephemeral: true,
            }))
    }
}
