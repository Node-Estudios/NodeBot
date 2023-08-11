import { AutocompleteInteraction } from 'discord.js'
// import Client from '../../../structures/Client'
// import logger from '#utils/logger.js'
import Autocomplete from '#structures/Autocomplete.js'
import yasha from 'yasha'

export default class Repeat extends Autocomplete {
    constructor () {
        super('play')
    }

    override async run (interaction: AutocompleteInteraction) {
        const query = interaction.options.getFocused()
        const search = await yasha.Source.Youtube.search(query)
        if (search.length > 25) search.length = 25
        interaction.respond(search.map(r => ({ name: r.title ?? '', value: r.url ?? '' })))
        // try {
        //     const client = interaction.client as Client
        //     if (!interaction.options.getFocused()) return
        //     const result = await (await client.music.youtubei).music.getSearchSuggestions(interaction.options.getFocused())

        //     // TODO: Remove this any
        //     interaction.respond(result.map((choice: any) => ({ name: choice.suggestion?.text, value: choice.suggestion?.text })))
        // } catch (e) {
        //     logger.error(e)
        // }
        // return true
    }
}
