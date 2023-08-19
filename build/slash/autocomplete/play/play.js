import logger from '#utils/logger.js';
import Autocomplete from '#structures/Autocomplete.js';
import yasha from 'yasha';
export default class Repeat extends Autocomplete {
    constructor() {
        super('play');
    }
    async run(interaction) {
        try {
            const query = interaction.options.getFocused();
            const search = await yasha.Source.Youtube.search(query);
            if (search.length > 25)
                search.length = 25;
            interaction.respond(search.map(r => ({ name: r.title ?? '', value: r.url ?? '' })));
        }
        catch (e) {
            logger.error(e);
        }
        return true;
    }
}
//# sourceMappingURL=play.js.map