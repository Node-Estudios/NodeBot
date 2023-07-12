import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder } from 'discord.js'
import Translator, { keys } from '../../../utils/Translator.js'
import Client from '../../../structures/Client.js'
import Button from '../../../structures/Button.js'


export default class Pause extends Button {
    constructor() {
        super('pauseMusic')
    }

    override async run(interaction: ButtonInteraction) {
        if (!interaction.inCachedGuild()) return interaction.deferUpdate()
        const client = interaction.client as Client
        const translate = Translator(interaction)

        const player = client.music.players.get(interaction.guild.id)
        if (!player?.queue.current) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(15548997).setFooter({
                        text: translate(keys.queue.no_queue),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
            })
        }

        const prevDesc = player.message?.embeds[0].description?.split('\n')[0]
        const embed = new EmbedBuilder().setColor(client.settings.color).setDescription(
            prevDesc +
                '\n\n' +
                translate(keys.stop[player.paused ? 'paused' : 'resumed'], {
                    user: interaction.user.toString(),
                }),
        )
        if (player.message?.embeds[0].thumbnail) embed.setThumbnail(player.message?.embeds[0].thumbnail.url)

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setStyle(4).setLabel(translate(keys.STOP)).setCustomId('stopMusic'),
            new ButtonBuilder()
                .setStyle(2)
                .setLabel(translate(player.paused ? keys.PAUSE : keys.RESUME))
                .setCustomId('pauseMusic'),
            new ButtonBuilder().setStyle(1).setLabel(translate(keys.SKIP)).setCustomId('skipMusic'),
            new ButtonBuilder().setStyle(1).setLabel(translate(keys.QUEUE)).setCustomId('queueMusic'),
        )

        if (player.paused) player.resumedUser = interaction.user
        else player.pausedUser = interaction.user
        player.pause(!player.paused)

        return await interaction.update({
            embeds: [embed],
            components: [row],
        })
    }
}
