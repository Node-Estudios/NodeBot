import { MessageEmbed, ButtonInteraction, TextChannel } from 'discord.js';
import Logger from '../../../utils/console.js';

module.exports = {
    name: 'skipMusic',
    /**,
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client: any, interaction: ButtonInteraction<'cached'>) => {
        try {
            const botChannelID = interaction.guild.members.cache.get(process.env.bot1id as string)?.voice.channelId;
            if (interaction.member.voice.channelId != botChannelID) {
                const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                    client.language.SKIP[2],
                    interaction.member.displayAvatarURL({
                        dynamic: true,
                    }),
                );
                return interaction.reply({
                    embeds: [errorembed],
                    ephemeral: true,
                });
            }

            const player = client.manager.players.get(interaction.guild.id);
            if (!player) return;
            if (!player.queue.current) return;

            const message = await (
                interaction.guild.channels.cache.get(interaction.channel?.id as string) as TextChannel
            ).messages.fetch(interaction.message.id);

            if (player.trackRepeat) player.setTrackRepeat(false);
            if (player.queueRepeat) player.setQueueRepeat(false);

            // const { title } = player.queue.current;

            if (player) player.stop();
        } catch (e) {
            Logger.error(e);
        }
    },
};
