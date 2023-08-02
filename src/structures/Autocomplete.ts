import { AutocompleteInteraction } from 'discord.js'

export default class Autocomplete {
    #pattern: string | RegExp
    constructor (pattern: string | RegExp) {
        this.#pattern = pattern
    }

    get pattern () {
        return this.#pattern
    }

    async run (interaction: AutocompleteInteraction): Promise<any> {
        return await interaction.respond([
            {
                name: 'notImplemented',
                value: 'This autocomplete is not yet implemented.',
            },
        ])
    }

    match (id: string) {
        if (typeof this.pattern === 'string') return this.pattern === id
        else return this.pattern.test(id)
    }
}
