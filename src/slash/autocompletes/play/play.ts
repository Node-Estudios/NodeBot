// @ts-nocheck
import { AutocompleteInteraction } from 'discord.js'
import Autocomplete from '#structures/Autocomplete.js'
import yasha from 'yasha'
import logger from '#utils/logger.js'
import Client from '#structures/Client.js'

export default class Repeat extends Autocomplete {
    constructor () {
        super('play')
    }

    override async run (interaction: AutocompleteInteraction) {
        const client = interaction.client as Client
        try {
            const query = interaction.options.getFocused()
             // @ts-expect-error
            const search = await yasha.Source.Youtube.search(query)
            if (search.length > 25) search.length = 24
            if (!this.canProced(interaction.user.id, interaction.id)) return false
            await interaction.respond([{
                name: query,
                value: query,
            }, ...search.map(r => {
                const title = r.title ?? ''
                // @ts-expect-error
                const url = r.url ?? ''
                return {
                    name: title.length > 100 ? title.slice(0, 95) + '...' : title,
                    value: url.length > 100 ? url.slice(0, 95) + '...' : url,
                }
            })]).catch(logger.error)
            return true
        } catch (error) {
            logger.error(error)
            client.errorHandler.captureException(error as Error)
            return true
        }
    }
}
