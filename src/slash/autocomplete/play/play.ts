import { AutocompleteInteraction } from 'discord.js'
import Client from '../../../structures/Client'
import logger from '#utils/logger.js'
import Autocomplete from '#structures/Autocomplete.js'

export default class Repeat extends Autocomplete {
    constructor () {
        super('play')
    }

    override async run (interaction: AutocompleteInteraction) {
        try {
            const client = interaction.client as Client
            if (!interaction.options.getFocused()) return
            const result = await (await client.music.youtubei).music.getSearchSuggestions(interaction.options.getFocused())

            // TODO: Remove this any
            interaction.respond(result.map((choice: any) => ({ name: choice.suggestion?.text, value: choice.suggestion?.text })))
        } catch (e) {
            logger.error(e)
        }
        return true
    }
}
