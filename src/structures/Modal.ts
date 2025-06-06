import { ModalSubmitInteraction } from 'discord.js'
import Translator, { keys } from '#utils/Translator.js'
import Client from './Client.js'

export default class Modal {
    #pattern: string | RegExp
    constructor(pattern: string | RegExp) {
        this.#pattern = pattern
    }

    get name() {
        return this.#pattern
    }

    async run(interaction: ModalSubmitInteraction): Promise<any> {
        const translate = Translator(interaction)
        const client = interaction.client as Client
        return await interaction.reply({
            content: translate(keys.GENERICERROR, {
                inviteURL: client.officialServerURL,
            }),
            ephemeral: true,
        })
    }

    match(id: string) {
        if (typeof this.#pattern === 'string') return this.#pattern === id
        else return this.#pattern.test(id)
    }
}
