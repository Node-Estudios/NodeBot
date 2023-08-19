import Translator, { keys } from '#utils/Translator.js';
export default class Button {
    #pattern;
    constructor(pattern) {
        this.#pattern = pattern;
    }
    get name() {
        return this.#pattern;
    }
    async run(interaction) {
        const translate = Translator(interaction);
        const client = interaction.client;
        return await interaction.reply({
            content: translate(keys.GENERICERROR, {
                inviteURL: client.officialServerURL,
            }),
            ephemeral: true,
        });
    }
    match(id) {
        if (typeof this.#pattern === 'string')
            return this.#pattern === id;
        else
            return this.#pattern.test(id);
    }
}
//# sourceMappingURL=Button.js.map