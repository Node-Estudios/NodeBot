import Autocomplete from '#structures/Autocomplete.js';
import yasha from 'yasha';
import logger from '#utils/logger.js';
export default class Repeat extends Autocomplete {
    constructor() {
        super('play');
    }
    async run(interaction) {
        const client = interaction.client;
        try {
            const query = interaction.options.getFocused();
            const search = await yasha.Source.Youtube.search(query);
            if (search.length > 25)
                search.length = 24;
            if (!this.canProced(interaction.user.id, interaction.id))
                return false;
            await interaction.respond([{
                    name: query,
                    value: query,
                }, ...search.map(r => {
                    const title = r.title ?? '';
                    const url = r.url ?? '';
                    return {
                        name: title.length > 100 ? title.slice(0, 95) + '...' : title,
                        value: url.length > 100 ? url.slice(0, 95) + '...' : url,
                    };
                })]).catch(logger.error);
            return true;
        }
        catch (error) {
            logger.error(error);
            client.errorHandler.captureException(error);
            return true;
        }
    }
}
//# sourceMappingURL=play.js.map