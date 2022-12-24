export class handlers {
    client: any;
    name: any;
    file: any;
    static default: any;
    constructor(client: any, file: { name: any }, options = { name: 'any' }) {
        this.client = client;
        this.name = options.name || file.name;
        this.file = file;
    }

    async _run(...args: any[]) {
        try {
            await this._run(...args);
        } catch (err) {
            this.client.logger.error(err);
        }
    }
}
