import autocompletes from '#cache/autocompletes.js'
import { AutocompleteInteraction } from 'discord.js'

export default class Autocomplete {
    #pattern: string | RegExp
    constructor (pattern: string | RegExp) {
        this.#pattern = pattern
    }

    get name () {
        return this.#pattern
    }

    /**
     * Run the autocomplete and return if it was responded or not
     * @param {AutocompleteInteraction} interaction
     * @returns {Promise<boolean>}
     */
    async run (interaction: AutocompleteInteraction): Promise<boolean> {
        return true
    }

    match (id: string) {
        if (typeof this.#pattern === 'string') return this.#pattern === id
        else return this.#pattern.test(id)
    }

    canProced (userId: string, interactionId: string): boolean {
        return autocompletes.canProced(userId, interactionId)
    }
}
