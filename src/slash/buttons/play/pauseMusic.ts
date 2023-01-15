import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js'
import { interactionButtonExtend } from '../../../events/client/interactionCreate.js'
import { messageHelper } from '../../../handlers/messageHandler.js'
import Client from '../../../structures/Client.js'

export default {
    name: 'pauseMusic',
    async run(client: Client, interaction: interactionButtonExtend) {
        const message = new messageHelper(interaction)
        const player = client.music.players.get(interaction.guild!.id)
        if (!player) return message.sendEphemeralMessage({
            embeds: new EmbedBuilder().setColor(15548997).setFooter({
                text: interaction.language.QUEUE[1],
                iconURL: interaction.user.displayAvatarURL()
            })
        }, false)
        // const player = client.music.players.get(interaction.guild.id)
        if (!player?.queue.current) return message.sendEphemeralMessage({
            embeds: new EmbedBuilder().setColor(15548997).setFooter(interaction.language.QUEUE[1])
        }, true)
        // const message = await interaction.message.fetch()
        const embed = new EmbedBuilder().setColor(client.settings.color)

        const prevDesc = player.message?.embeds[0].description?.split("\n")[0];
        if (player.message?.embeds[0].thumbnail) embed.setThumbnail(player.message?.embeds[0].thumbnail.url)
        let buttonName
        if (player.paused) {
            player.pause(false)
            player.resumedUser = interaction.user.id
            buttonName = interaction.language.PLAYER['resumeMusic']

            let desc = interaction.language.STOP[5] + player.resumedUser + interaction.language.STOP[6]
            embed.setDescription(prevDesc + '\n\n' + desc)
        } else {
            player.pause(true)
            player.pausedUser = interaction.user.id
            let desc = interaction.language.STOP[4] + player.pausedUser + interaction.language.STOP[6]
            embed.setDescription(prevDesc + '\n\n' + desc)

            buttonName = interaction.language.PLAYER['pauseMusic']
        }
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setStyle(4)
                .setLabel(interaction.language.PLAYER['stopMusic'])
                .setCustomId('stopMusic'),
            new ButtonBuilder().setStyle(2).setLabel(buttonName).setCustomId('pauseMusic'),
            new ButtonBuilder()
                .setStyle(1)
                .setLabel(interaction.language.PLAYER['skipMusic'])
                .setCustomId('skipMusic'),
            new ButtonBuilder()
                .setStyle(1)
                .setLabel(interaction.language.PLAYER['queueMusic'])
                .setCustomId('queueMusic'),
        )

        return await interaction.update({
            embeds: [embed],
            components: [row],
        })
    },
}
