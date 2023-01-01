import { EventHandler } from "../handlers/events.js";
import Client from "../structures/Client.js";
import Ready from "./client/ready.js";
interface Event {
    run(client: Client, ...args: any[]): Promise<void>;
}
type Events = {
    [eventName: string]: new (client: Client) => EventHandler;
};
const events: Events = {
    ready: Ready,
}
export default events