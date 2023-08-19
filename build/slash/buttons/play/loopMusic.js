import Translator, { keys } from '#utils/Translator.js';
import { ComponentType } from 'discord.js';
import EmbedBuilder from '#structures/EmbedBuilder.js';
import Button from '#structures/Button.js';
import logger from '#utils/logger.js';
function getBlueRepeatEmoji(repeatMode, client) {
    if (repeatMode === 'queue')
        return client.settings.emojis.blue.repeat_all;
    else if (repeatMode === 'track')
        return client.settings.emojis.blue.repeat_one;
    else
        return client.settings.emojis.white.repeat_off;
}
export default class Repeat extends Button {
    constructor() {
        super('repeatMusic');
    }
    async run(interaction) {
        try {
            if (!interaction.inCachedGuild())
                return await interaction.deferUpdate();
            const translate = Translator(interaction);
            const client = interaction.client;
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
            let queueRepeatMode;
            if (player.trackRepeat && !player.queueRepeat) {
                queueRepeatMode = 'off';
                player.setQueueRepeat(false);
                player.setTrackRepeat(false);
            }
            else if (!player.trackRepeat && player.queueRepeat) {
                queueRepeatMode = 'track';
                player.setQueueRepeat(false);
                player.setTrackRepeat(true);
            }
            else {
                queueRepeatMode = 'queue';
                player.setQueueRepeat(true);
                player.setTrackRepeat(false);
            }
            const blueRepeatEmoji = getBlueRepeatEmoji(queueRepeatMode, client);
            const repeatButton = player.message?.components[0].components.find((c) => c.customId === 'repeatMusic' && c.type === ComponentType.Button);
            if (repeatButton && repeatButton.type === ComponentType.Button)
                repeatButton.data.emoji = {
                    name: blueRepeatEmoji.name.toString(),
                    id: blueRepeatEmoji.id.toString(),
                    animated: repeatButton.data.emoji?.animated,
                };
            if (player.message)
                await player.message.edit({ components: player.message.components, embeds: player.message.embeds });
            await interaction.deferUpdate();
        }
        catch (e) {
            logger.error(e);
        }
        return true;
    }
}
//# sourceMappingURL=loopMusic.js.map