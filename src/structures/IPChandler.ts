// import { Cluster, JSONObject } from "discord-hybrid-sharding";
// import Logger from "../utils/console";
// import NodeManager from './manager'

// export default class IPChandler {
//     // Inicializamos el sistema de IPC en el constructor
//     constructor(cluster: Cluster, message: JSONObject, manager: NodeManager, logger: Logger) {
//         // Si estamos en el proceso principal, escuchamos los mensajes que llegan de otras shards
//         // if (ipcMain) {
//         //     ipcMain.on('message', (event, message) => {
//         //         this.handleMessage(message);
//         //     });
//         // }
//     }

//     // Método que se encarga de enviar un mensaje a una shard específica
//     sendMessage(cluster: Cluster, message: JSONObject) {
//         // Si estamos en el proceso principal, enviamos el mensaje a la shard correspondiente
//         if (ipcMain) {
//             ipcMain.to(shard).send('message', message);
//         }
//         // Si estamos en una shard, enviamos el mensaje al proceso principal
//         else {
//             ipcRenderer.send('message', message);
//         }
//     }

//     // Método que se encarga de identificar el tipo de mensaje que se ha recibido y realizar la acción correspondiente
//     handleMessage(message) {
//         switch (message.type) {
//             case 'example':
//                 // Realizamos la acción correspondiente al mensaje de tipo 'example'
//                 // ...
//                 break;

//             // Añadimos más casos para cada tipo de mensaje que queramos gestionar
//             // ...
//         }
//     }
// }
