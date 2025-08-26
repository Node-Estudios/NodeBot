import {
    ButtonInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ComponentType,
    ButtonComponent,
} from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import Translator, { keys } from '#utils/Translator.js'
import Client from '#structures/Client.js'
import Button from '#structures/Button.js'
import logger from '#utils/logger.js'

export default class Pause extends Button {
    constructor() {
        super('pauseMusic')
    }

    override async run(interaction: ButtonInteraction) {
        if (!interaction.inCachedGuild()) return await interaction.deferUpdate()
        const client = interaction.client as Client
        const translate = Translator(interaction)

        const player = client.music.players.get(interaction.guild.id)
        if (!player?.queue.current) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(15548997).setFooter({
                        text: translate(keys.queue.no_queue),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
        }

        // Llama directamente al método pause del reproductor
        player.pause(!player.paused)

        const message = player.message
        if (message) {
            // Reconstruimos la fila de acción para actualizar el botón
            const newActionRows = message.components.map(row => {
                // Solo nos interesan las filas de acción
                if (row.type !== ComponentType.ActionRow) return row

                const rowBuilder = new ActionRowBuilder<ButtonBuilder>()

                row.components.forEach(component => {
                    // Clonamos cada botón
                    const button = ButtonBuilder.from(
                        component as ButtonComponent,
                    )

                    // Si es el botón de pausa, cambiamos su emoji
                    if (component.customId === 'pauseMusic') {
                        const newEmoji = player.paused
                            ? client.settings.emojis.white.play
                            : client.settings.emojis.white.pause

                        button.setEmoji({
                            name: newEmoji.name.toString(),
                            id: newEmoji.id?.toString(),
                        })
                    }
                    rowBuilder.addComponents(button)
                })
                return rowBuilder
            })

            try {
                await message.edit({ components: newActionRows })
            } catch (e) {
                logger.error("Error al editar el mensaje de 'now playing':", e)
            }
        }

        await interaction.deferUpdate()
        return true
    }
}
