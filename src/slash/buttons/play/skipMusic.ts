import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js'
import Client from '../../../structures/client'
import Command from '../../../structures/command'
export default class skipMusic extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'skipMusic',
            description: 'Skip music button for /play command',
        })
    }
    async run(client: Client, interaction: CommandInteraction) {
        try {
            if (
                (interaction.member as GuildMember).voice.channelId !=
                interaction.guild?.members.cache.get(client.user?.id as string)?.voice.channelId
            ) {
                const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                    client.language.SKIP[2],
                    interaction.user.displayAvatarURL({
                        dynamic: true,
                    }),
                )
                return interaction.reply({
                    embeds: [errorembed],
                    ephemeral: true,
                })
            }

            const player = client.music.players.get(interaction.guild!.id)
            if (!player) return
            if (!player.queue.current) return

            if (player.trackRepeat) player.setTrackRepeat(false)
            if (player.queueRepeat) player.setQueueRepeat(false)

            // const { title } = player.queue.current;

            if (player) player.skip()
        } catch (e) {
            client.logger.error(e)
        }
    }
}
