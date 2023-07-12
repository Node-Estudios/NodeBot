import { ButtonInteraction } from 'discord.js'

export default class Button {
    #patron: string | RegExp
    constructor(patron: string | RegExp) {
        this.#patron = patron
    }

    get patron() {
        return this.#patron
    }

    async run(interaction: ButtonInteraction) {
        return interaction.reply('This button is not yet implemented.')
    }

    match(id: string) {
        if (typeof this.patron === 'string') return this.patron === id
        else return this.patron.test(id)
    }
}