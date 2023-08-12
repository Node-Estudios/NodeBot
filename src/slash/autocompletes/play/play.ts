import { AutocompleteInteraction } from 'discord.js'
import Autocomplete from '#structures/Autocomplete.js'
import yasha from 'yasha'
import logger from '#utils/logger.js'

export default class Repeat extends Autocomplete {
    constructor () {
        super('play')
    }

    override async run (interaction: AutocompleteInteraction) {
        const query = interaction.options.getFocused()
        const search = await yasha.Source.Youtube.search(query)
        if (search.length > 25) search.length = 25
        if (this.canProced(interaction.user.id, interaction.id)) return false
        interaction.respond(search.map(r => ({ name: r.title ?? '', value: r.url ?? '' }))).catch(logger.error)
        return true
    }
}
