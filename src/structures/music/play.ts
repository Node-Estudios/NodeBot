import Client from '../client';
import 'dotenv/config';
import { CommandInteraction } from 'discord.js';
interface message {
    nonce: string;
    content: {
        system: string;
        command: string;
        data: {
            interaction: CommandInteraction;
            args: any;
        };
    };
    _sRequest: boolean;
    _sReply: boolean;
    error: any;
}
export class play {
    client: Client;
    constructor(client: Client) {
        this.client = client;
    }

    async run(message: message) {
        this.client.logger.log('comando play ejecutado');
        // console.log(message);
        let content = message.content;
        let data = content.data;
        let interaction = data.interaction;
        let args = data.args;
        console.log("Hemos llegado a donde queríamos", client.music)
    }
}
