// TODO? use global client?
import Events from '../events/index.js'
import Client from '../structures/Client.js'

// Events
// for (const category of readdirSync('./build'))
// console.log(category)
    // for (const file of readdirSync(`../events/${category}`)) {
    //     const eventFile = await import(`../events/${category}/${file}.js`)
    //     const event = new eventFile.default()
    //     events.set(event.name, event)
    // }
// const fs = require("fs");
// const eventFolders = fs.readdirSync("./src/events/");
// import ready from "../events/client/ready";
// import Client from "../structures/client";

export default class Event {
    constructor(Client: Client) {
        for(var key in Events) {
            console.log(key)
            console.log(Events[key].call( Client))
            // events.set(key, Events[key])
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
