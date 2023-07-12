import { ButtonInteraction } from 'discord.js'

export default class Button {
    #pattern: string | RegExp
    constructor(pattern: string | RegExp) {
        this.#pattern = pattern
    }

    get pattern() {
        return this.#pattern
    }

    async run(interaction: ButtonInteraction): Promise<any> {
        return interaction.reply('This button is not yet implemented.')
    }

    match(id: string) {
        if (typeof this.pattern === 'string') return this.pattern === id
        else return this.pattern.test(id)
    }
}