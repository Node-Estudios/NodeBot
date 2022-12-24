import { MessageEmbed, ButtonInteraction, TextChannel, ColorResolvable } from 'discord.js';
import Logger from '../../../utils/console.js';

module.exports = {
    name: 'stopMusic',
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
                    client.language.QUEUE[10],
                    interaction.member.displayAvatarURL({
                        dynamic: true,
                    }),
                );
                return interaction.reply({
                    embeds: [errorembed],
                });
            }

            const player = client.manager.players.get(interaction.guild.id);
            if (!player) return;
            if (!player.queue.current) return;
            const message = await (
                interaction.guild.channels.cache.get(interaction.channel?.id as string) as TextChannel
            ).messages.fetch(interaction.message.id);
            let msgStopMusic = `\n${client.language.STOP[7]}${interaction.user.id}>`;

            const embed = new MessageEmbed().setColor(process.env.bot1Embed_Color as ColorResolvable);
            embed.setDescription(`${msgStopMusic}`);

            player.destroy();

            await interaction.reply({
                embeds: [embed],
            });

            message.edit({
                components: [],
            });
        } catch (e) {
            Logger.error(e);
        }
    },
};
