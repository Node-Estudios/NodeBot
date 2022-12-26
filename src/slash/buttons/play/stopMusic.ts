import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js'
import Client from '../../../structures/Client'
import Command from '../../../structures/Command'
export default default class stopMusic extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'stopMusic',
            description: 'Stop the music button for /play command',
        })
    }
    async run(client: Client, interaction: CommandInteraction) {
        try {
            if (
                (interaction.member as GuildMember).voice.channelId !=
                interaction.guild?.members.cache.get(client.user?.id as string)?.voice.channelId
            ) {
                const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                    client.language.QUEUE[10],
                    interaction.user.displayAvatarURL({
                        dynamic: true,
                    }),
                )
                return interaction.reply({
                    embeds: [errorembed],
                })
            }

            const player = client.music.players.get(interaction.guild!.id)
            if (!player) return
            if (!player.queue.current) return

            // if (player.trackRepeat) player.setTrackRepeat(false)
            // if (player.queueRepeat) player.setQueueRepeat(false)

            // const { title } = player.queue.current;
            // logger.debug(player)
            if (player) player.stop()
        } catch (e) {
            logger.error(e)
        }
    }
}
