import { EmbedBuilder, GuildMember } from 'discord.js'
import { interactionButtonExtend } from '../../../events/client/interactionCreate.js'
import { messageHelper } from '../../../handlers/messageHandler.js'
import Client from '../../../structures/Client.js'
import logger from '../../../utils/logger.js'

export default {
    name: 'queueMusic',
    run: async (client: Client, interaction: interactionButtonExtend) => {
        if (!interaction.inGuild()) return;
        const message = new messageHelper(interaction)
        const player = client.music.players.get(interaction.guild!.id)
        if (!player) return message.sendEphemeralMessage({
            embeds: [new EmbedBuilder().setColor(15548997).setFooter({
                text: interaction.language.QUEUE[1],
                iconURL: interaction.user.displayAvatarURL()
            })]
        }, true)
        try {
            interaction.member = interaction.member as GuildMember
            const errorEmbed = new EmbedBuilder().setColor(15548997)
                .setFooter({ text: interaction.language.QUEUE[10], iconURL: interaction.user.displayAvatarURL() });
            if (!interaction.member.voice) return message.sendEphemeralMessage({ embeds: [errorEmbed] }, true)
            let vc = player?.voiceChannel
            if (interaction.member?.voice.channelId != vc?.id) {
                const errorembed = new EmbedBuilder().setColor(client.settings.color).setFooter({
                    text: interaction.language.QUEUE[10],
                    iconURL: interaction.user.displayAvatarURL(),
                })
                return message.sendMessage({
                    embeds: [errorembed],
                }, true)
            }

            // const player = client.music.players.get(interaction.guild!.id)
            const {
                title,
                requester
            } = player.queue.current!;

            const {
                queue
            } = player;
            return player.queue.retrieve(1)
            // return console.log(player.queue.current)
            // if (player.queue.current) {
            //     return new EmbedBuilder()
            //         .setTitle(interaction.language.QUEUE[9])
            //         .setDescription(`🎧 ${interaction.language.QUEUE[3]}\n[${title}](${uri}) [<@${requester.userId}>]`)
            //         .setAuthor(`${interaction.language.QUEUE[6]} ${player.queue.current.author} ${client.language.QUEUE[7]}`, "https://i.imgur.com/CCqeomm.gif")
            //         .setColor(client.settings.color)
            // }

        } catch (e) {
            return logger.error(e)
        }
    },
}
