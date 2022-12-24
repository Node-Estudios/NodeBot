import client from '../bot.js';
export class Events {
    client: any;
    name: any;
    file: any;
    static default: any;
    constructor(file: { name: any }, options = { name: 'any' }) {
        this.name = options.name || file.name;
        this.file = file;
    }

    async _run(...args: any[]) {
        try {
            await this._run(...args);
        } catch (err) {
            client.logger.error(err);
        }
    }

    reload() {
        const path = `../listeners/${this.name}.js`;
        delete require.cache[path];
        require(`../listeners/${this.name}.js`);
    }
}
