import { MessageEmbed, ButtonInteraction, MessageActionRow, MessageButton } from 'discord.js'
import Client from '../../../structures/Client.js'
import logger from '../../../utils/logger.js'

export default {
    name: 'pauseMusic',

    run: async (interaction: ButtonInteraction<'cached'>) => {
        const client = interaction.client as Client
        try {
            const botChannelID = interaction.guild.me?.voice?.channelId
            if (interaction.member.voice.channelId != botChannelID) {
                const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                    client.language.STOP[3],
                    interaction.member.displayAvatarURL({
                        dynamic: true,
                    }),
                )
                return interaction.reply({
                    embeds: [errorembed],
                    ephemeral: true,
                })
            }

            const player = (client as any).manager.players.get(interaction.guild.id)
            if (!player?.queue.current) return
            const message = await interaction.message.fetch()
            const embed = new MessageEmbed().setColor(client.settings.color)
            if (message.embeds[0].thumbnail) embed.setThumbnail(message.embeds[0].thumbnail.url)

            const prevDesc = message.embeds[0].description?.split('\n')[0]
            let buttonName
            if (player.paused) {
                player.pause(false)
                player.resumedUser = interaction.user.id
                buttonName = client.language.PLAYER['resumeMusic']

                let desc = client.language.STOP[5] + player.resumedUser + client.language.STOP[6]
                embed.setDescription(prevDesc + '\n\n' + desc)
            } else {
                player.pause(true)
                player.pausedUser = interaction.user.id
                let desc = client.language.STOP[4] + player.pausedUser + client.language.STOP[6]
                embed.setDescription(prevDesc + '\n\n' + desc)

                buttonName = client.language.PLAYER['pauseMusic']
            }
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setStyle('DANGER')
                    .setLabel(client.language.PLAYER['stopMusic'])
                    .setCustomId('stopMusic'),
                new MessageButton().setStyle('SECONDARY').setLabel(buttonName).setCustomId('pauseMusic'),
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel(client.language.PLAYER['skipMusic'])
                    .setCustomId('skipMusic'),
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel(client.language.PLAYER['queueMusic'])
                    .setCustomId('queueMusic'),
            )

            await interaction.update({
                embeds: [embed],
                components: [row],
            })
        } catch (e) {
            logger.error(e)
        }
    },
}
