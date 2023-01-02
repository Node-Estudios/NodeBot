import { EmbedBuilder as MessageEmbed } from 'discord.js'
import { interactionCommandExtend } from '../../../events/client/interactionCreate.js'
import Client from '../../../structures/Client.js'
import logger from '../../../utils/logger.js'

export default {
    name: 'skipMusic',
    async run(interaction: interactionCommandExtend) {
        const client = interaction.client as Client
        try {
            if (interaction.member?.voice?.channelId !== interaction.guild.me?.voice.channelId) {
                const errorembed = new MessageEmbed().setColor(client.settings.color).setFooter({
                    text: interaction.language.SKIP[2],
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
