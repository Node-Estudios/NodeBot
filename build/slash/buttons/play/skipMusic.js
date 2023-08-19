import EmbedBuilder from '#structures/EmbedBuilder.js';
import Translator, { keys } from '#utils/Translator.js';
import Button from '#structures/Button.js';
import logger from '#utils/logger.js';
export default class Skip extends Button {
    constructor() {
        super('nextMusic');
    }
    async run(interaction) {
        try {
            if (!interaction.inCachedGuild())
                return;
            const client = interaction.client;
            const translate = Translator(interaction);
            const player = client.music.players.get(interaction.guild.id);
            if (!player?.queue.current)
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor(client.settings.color).setFooter({
                            text: translate(keys.queue.no_queue),
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                });
            if (interaction.member.voice.channelId !== (player.voiceChannel.id ?? ''))
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor(client.settings.color).setFooter({
                            text: translate(keys.skip.no_same),
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                });
            if (!player.queue.current)
                return;
            if (player.trackRepeat)
                player.setTrackRepeat(false);
            if (player.queueRepeat)
                player.setQueueRepeat(false);
            return player.skip();
        }
        catch (e) {
            logger.error(e);
        }
    }
}
//# sourceMappingURL=skipMusic.js.map