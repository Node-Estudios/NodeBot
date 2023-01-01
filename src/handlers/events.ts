// TODO? use global client?
import Client from '../structures/Client.js';
interface Event {
    run(client: Client, ...args: any[]): Promise<void>;
}


export class EventHandler {
    constructor(private client: Client) { }

    load(events: Event): void {
        for (const [eventName, EventClass] of Object.entries(events)) {
            console.log(eventName);
            const event = new EventClass(this.client);
            console.log(`Loading event: ${eventName}.js`);
            this.client.on(eventName, async (...args) => {
                console.log(`Event ${eventName} loaded`);
                await event._run(() => event.run(...args));
            });
        }
    }

}




// export default class Event {
//   constructor() {}
//   async run(client: Client) {
//     // client.on("ready", (...args) => ready.run(...args));
//     // await eventFolders.forEach(async (eventFolder: any) => {
//     //   function isDir(path: any) {
//     //     try {
//     //       var stat = fs.lstatSync(path);
//     //       return stat.isDirectory();
//     //     } catch (e) {
//     //       // lstatSync throws an error if path doesn't exist
//     //       return false;
//     //     }
//     //   }
//     //   const events: any = (source: any) =>
//     //     fs.readdirSync(source).filter((dirent: any) => {
//     //       return isDir(source + "/" + dirent.name);
//     //     });
//     //   const event = events("./src/events/" + eventFolder);
//     //   console.log(`Loading ${event.length} events from ${eventFolder}`);
//     //   const jsevents = await event.filter(
//     //     (c: string) => c.split(".").pop() === "ts"
//     //   );
//     //   console.log(`jsevents`, jsevents);
//     //   for (let i = 0; i < jsevents.length; i++) {
//     //     console.log(jsevents);
//     //     if (!jsevents.length)
//     //       throw Error("No se encontraron archivos de javascript");
//     //     // const file = require(`../events/${eventFolder}/${jsevents[i]}`);
//     //     // const event = new file(client, file);
//     //     // if (typeof event.run !== "function")
//     //     // throw Error(`No se encontró la función ${jsevents[i]}`);
//     //     // const name = jsevents[i].split(".")[0];
//     //     // client.on(name, (...args) => event.run(...args));
//     //   }
//     // });
//   }
// }
