import 'dotenv/config'
import commands from './handlers/commands'
import node from './structures/client'
// import './webhook';
const client = new node()
new commands(client)
export default client
// import * as fs from "fs";

// import EventsRegister from "./handlers/events";
// new EventsRegister().run(client);
// fs.readFile("./test.txt", "utf8", function (err, data) {
//   if (err) {
//     return console.log(err);
//   }

//   if (data == "0") {
//     require("./webhook.js");
//   } else return;

//   fs.writeFile("test.txt", "1", function (err) {
//     if (err) {
//       return console.log(err);
//     }
//   });
// }); //
// client.cluster.triggerReady();

/* setInterval(() => {
    updateStatus();
}, 300000);

async function updateStatus() {
    const promises = [
        client.cluster.fetchClientValues('guilds.cache.size'),
        client.cluster.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
    ];
    Promise.all(promises)
        .then(results => {
            const guildNum = results[0].reduce((acc: any, guildCount: any) => acc + guildCount, 0);
            const memberNum = results[1].reduce((acc: any, memberCount: any) => acc + memberCount, 0);
            client.user!.setActivity(`Servidores: ${guildNum} Miembros: ${memberNum}`, { type: 'LISTENING' });
        })
        .catch(console.error);
} */

client.Login() // Para solucionar el error de "No hay token"
