import { AutocompleteInteraction } from 'discord.js'

export default class Autocomplete {
    #pattern: string | RegExp
    constructor (pattern: string | RegExp) {
        this.#pattern = pattern
    }

    get name () {
        return this.#pattern
    }

    async run (interaction: AutocompleteInteraction): Promise<any> {
        const v = interaction.options.getFocused()
        return await interaction.respond([
            {
                name: v,
                value: v,
            },
        ])
    }

    match (id: string) {
        if (typeof this.#pattern === 'string') return this.#pattern === id
        else return this.#pattern.test(id)
    }
}
