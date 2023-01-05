import { GuildMember, EmbedBuilder as MessageEmbed } from 'discord.js'
import { interactionButtonExtend } from '../../../events/client/interactionCreate.js'
import { messageHelper } from '../../../handlers/messageHandler.js'
import Client from '../../../structures/Client.js'
import logger from '../../../utils/logger.js'

export default {
    name: 'skipMusic',
    async run(client: Client, interaction: interactionButtonExtend) {
        if (!interaction.inGuild()) return;
        const message = new messageHelper(interaction)
        const player = client.music.players.get(interaction.guild!.id)
        if (!player) return message.sendEphemeralMessage({
            embeds: new MessageEmbed().setColor(15548997).setFooter({
                text: interaction.language.QUEUE[1],
                iconURL: interaction.user.displayAvatarURL()
            })
        }, false)
        try {
            interaction.member = interaction.member as GuildMember
            const errorEmbed = new MessageEmbed().setColor(15548997)
                .setFooter({ text: interaction.language.QUEUE[10], iconURL: interaction.user.displayAvatarURL() });
            if (!interaction.member.voice) return message.sendEphemeralMessage({ embeds: errorEmbed }, false)
            let vc = player?.voiceChannel
            if (interaction.member?.voice.channelId != vc?.id) {
                const errorembed = new MessageEmbed().setColor(client.settings.color).setFooter({
                    text: interaction.language.QUEUE[10],
                    iconURL: interaction.user.displayAvatarURL(),
                })
                return message.sendMessage({
                    embeds: [errorembed],
                }, false)
            }

            // const player = client.music.players.get(interaction.guild!.id)
            if (!player?.queue.current) return

            if (player.trackRepeat) player.setTrackRepeat(false)
            if (player.queueRepeat) player.setQueueRepeat(false)

            // const { title } = player.queue.current;
            // logger.debug(player)
            return player.skip()
        } catch (e) {
            logger.error(e)
        }
    },
}
