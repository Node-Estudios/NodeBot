import { MessageEmbed, ButtonInteraction } from 'discord.js'
import logger from '../../../utils/logger.js'
import client from '../../../bot.js'
export default {
    name: 'skipMusic',
    async run(interaction: ButtonInteraction<'cached'>) {
        try {
            if (interaction.member?.voice?.channelId !== interaction.guild.me?.voice.channelId) {
                const errorembed = new MessageEmbed().setColor(client.settings.color).setFooter({
                    text: client.language.SKIP[2],
                    iconURL: interaction.user.displayAvatarURL({
                        dynamic: true,
                    }),
                })
                return interaction.reply({
                    embeds: [errorembed],
                    ephemeral: true,
                })
            }

            const player = client.music.players.get(interaction.guild.id)
            if (!player?.queue.current) return

            if (player.trackRepeat) player.setTrackRepeat(false)
            if (player.queueRepeat) player.setQueueRepeat(false)

            // const { title } = player.queue.current;

            player.skip()
        } catch (e) {
            logger.error(e)
        }
    },
}
