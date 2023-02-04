import { EmbedBuilder, GuildMember } from 'discord.js'
import { interactionButtonExtend } from '../../../events/client/interactionCreate.js'
import { messageHelper } from '../../../handlers/messageHandler.js'
import Client from '../../../structures/Client.js'
import formatTime from '../../../utils/formatTime.js'
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
                requester,
                id
            } = player.queue.current!;

            const {
                queue
            } = player;
            player.queue.retrieve(1)
            // return console.log(player.queue.current)
            if (!player.queue[0] && player.queue.current) {
                return interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setTitle(interaction.language.QUEUE[9])
                        .setDescription(`🎧 ${interaction.language.QUEUE[3]}\n[${title}](https://www.music.youtube.com/watch?v=${player.queue.current.id}) [<@${player.queue.current.requester.id}> - ${formatTime(Math.trunc(player.queue.current.duration), false)} - ${player.queue.current.streams![0].bitrate.toString().slice(0, 3)}Kbps]`)
                        .setAuthor({ name: `${interaction.language.QUEUE[6]} ${player.queue.current?.author} ${interaction.language.QUEUE[7]}`, iconURL: "https://i.imgur.com/CCqeomm.gif" })
                        .setColor(client.settings.color)]
                })
            }
            let x = Math.floor(10);
            let i: any;
            let j: any;
            i = -1;
            j = 0;

            let queuelist = player.queue
                .slice(x - 10, x)
                .map(
                    () =>
                        `**${++j}.** [${queue[++i].title}](https://www.music.youtube.com/watch?v=${queue[i].id}) [<@${queue[i].requester.id}> - ${formatTime(Math.trunc(queue[i].duration), false)} - ${queue[i].streams[0].bitrate.toString().slice(0, 3)}Kbps]`
                )
                .join("\n");

            if (!queuelist) {
                const errorembed = new EmbedBuilder()
                    .setColor(15548997)
                    .setFooter({
                        text: interaction.language.QUEUE[4],
                        iconURL: interaction.user.displayAvatarURL(),
                    })
                return errorembed
            }
            const embed = new EmbedBuilder();
            embed.setDescription(
                `🎧 ${interaction.language.QUEUE[3]}\n [${title}](https://www.music.youtube.com/watch?v=${player.queue.current!.id}) [<@${player.queue.current!.requester.id}> - ${formatTime(Math.trunc(player.queue.current!.duration), false)} - ${player.queue.current!.streams![0].bitrate.toString().slice(0, 3)}Kbps]\n__${interaction.language.QUEUE[8]}__:\n${queuelist}`
            );
            embed.setThumbnail(client.user.displayAvatarURL());
            embed.setAuthor({
                name: `${interaction.language.QUEUE[6]} ${interaction.user.username} ${interaction.language.QUEUE[7]} (${Math.floor(x / 10)} / ${Math.floor(
                    (player.queue.slice(1).length + 10) / 10
                )})`,
                iconURL: "https://i.imgur.com/CCqeomm.gif"
            });
            embed.setFooter({
                text: `${interaction.language.QUEUE[5]} ${player.queue.length}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            embed.setColor(client.settings.color)
            return interaction.reply({
                embeds: [embed]
            })

        } catch (e) {
            return logger.error(e)
        }
    },
}
