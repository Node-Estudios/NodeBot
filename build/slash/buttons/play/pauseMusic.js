import EmbedBuilder from '#structures/EmbedBuilder.js';
import Translator, { keys } from '#utils/Translator.js';
import Button from '#structures/Button.js';
export default class Pause extends Button {
    constructor() {
        super('pauseMusic');
    }
    async run(interaction) {
        if (!interaction.inCachedGuild())
            return await interaction.deferUpdate();
        const client = interaction.client;
        const translate = Translator(interaction);
        const player = client.music.players.get(interaction.guild.id);
        if (!player?.queue.current)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(15548997).setFooter({
                        text: translate(keys.queue.no_queue),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
            });
        interaction.deferUpdate();
        return await client.music.trackPause(player, interaction);
    }
}
//# sourceMappingURL=pauseMusic.js.map