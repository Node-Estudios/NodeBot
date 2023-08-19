import Command from '#structures/Command.js';
import logger from '#utils/logger.js';
export default class NowPlaying extends Command {
    constructor() {
        super({
            name: 'nowplaying',
            description: 'See the current song playing.',
            cooldown: 5,
        });
    }
    async run(interaction) {
        return await interaction.reply({ content: 'En desarrollo, comando no disponible' }).catch(logger.error);
    }
}
//# sourceMappingURL=nowplaying.js.map