import { Colors } from 'discord.js';
import EmbedBuilder from '#structures/EmbedBuilder.js';
import Command from '#structures/Command.js';
import Translator, { keys } from '#utils/Translator.js';
import logger from '#utils/logger.js';
export default class Resume extends Command {
    constructor() {
        super({
            name: 'resume',
            description: 'Resume the current song!',
            cooldown: 5,
            dm_permission: false,
        });
    }
    async run(interaction) {
        if (!interaction.inCachedGuild())
            return;
        const client = interaction.client;
        const translate = Translator(interaction);
        const player = client.music.players.get(interaction.guild.id);
        if (!player)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(client.settings.color).setFooter({
                        text: translate(keys.queue.no_queue),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
                .catch(logger.error);
        await interaction.deferReply();
        if (!interaction.member.voice)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(Colors.Red).setFooter({
                        text: translate(keys.skip.no_same),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
                .catch(logger.error);
        const vc = player.voiceChannel;
        if (interaction.member.voice.channelId !== vc.id)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(Colors.Red).setFooter({
                        text: translate(keys.skip.no_same),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
                .catch(logger.error);
        if (!player.queue.current)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(client.settings.color).setFooter({
                        text: translate(keys.queue.no_queue),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
                .catch(logger.error);
        player.pause(false);
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setTitle(translate(keys.SUCCESSEMBED))
                    .setDescription(translate(keys.resumed))
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() }),
            ],
        })
            .catch(logger.error);
        return player.skip();
    }
}
//# sourceMappingURL=resume.js.map