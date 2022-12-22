import Client from './client';
import 'dotenv/config';
import { play } from './music/index';
interface message {
    nonce: string;
    content: {
        system: string;
        command: string;
        args: string;
    };
    _sRequest: boolean;
    _sReply: boolean;
    error: any;
}
export default class ControlSystem {
    client: Client;
    constructor(client: Client) {
        this.client = client;
    }

    async run() {
        // let playCommand = new play(this.client);
        /**
         * * STATUS QUE PUEDES RECIVIR DE VUELTA:
         * * 200: EVERTYHTING IS OKEY, THE REQUEST WAS SUCCESSFULLY EXECUTED
         * * 400: BAD REQUEST, THE REQUEST WAS NOT SUCCESSFULLY EXECUTED
         * * 404: NOT FOUND, THE REQUEST WAS NOT SUCCESSFULLY EXECUTED
         */
        // this.client.logger.music('Sistema de música iniciado');
        // this.client.cluster.on('message', message => {
        //     // console.log(message.content.data);
        //     //{
        //     //     const commands = {
        //     //         play: () => playCommand.run(client),
        //     //     }
        //     //     const command = commands[message.content.command]
        //     // }
        //     if (message.content)
        //         if (message.content.system)
        //             switch (message.content.system) {
        //                 case 'music':
        //                     switch (message.content.command) {
        //                         case 'play':
        //                             playCommand.run(message);
        //                     }
        //                 default:
        //                     message.reply({ content: { status: '404' } });
        //             }
        //     // this.client.logger.log('mensaje recibido');
        //     if (!message._sRequest) return; // Check if the message needs a reply
        //     message.reply({ content: '200' });
        // });
    }
}
