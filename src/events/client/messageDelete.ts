//TODO? use global client?
import { Message } from 'discord.js';
import Client from '../../structures/Client.js';

// TODO: Remove (variable: any) in the code
// Interfaz de eventos
import { BaseEvent } from '../../structures/Events.js';

export default class messageDelete extends BaseEvent {
    async run(client: Client, message: Message<true>): Promise<void> {
/*         this.client.snipes.set(message.channel.id, message); */
    }
}
