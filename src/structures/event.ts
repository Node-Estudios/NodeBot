import { any } from "zod";

export class Events {
  client: any;
  name: any;
  file: any;
  static default: any;
  constructor(client: any, file: { name: any }, options = { name: any }) {
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

  reload() {
    const path = `../listeners/${this.name}.js`;
    delete require.cache[path];
    require(`../listeners/${this.name}.js`);
  }
}
