import autocompletes from '#cache/autocompletes.js';
export default class Autocomplete {
    #pattern;
    constructor(pattern) {
        this.#pattern = pattern;
    }
    get name() {
        return this.#pattern;
    }
    async run(interaction) {
        return true;
    }
    match(id) {
        if (typeof this.#pattern === 'string')
            return this.#pattern === id;
        else
            return this.#pattern.test(id);
    }
    canProced(userId, interactionId) {
        return autocompletes.canProced(userId, interactionId);
    }
}
//# sourceMappingURL=Autocomplete.js.map