import Client from "../structures/Client.js";
import { BaseEvent } from '../structures/Events.js';
import { interactionCreate as interactioncreator } from "./client/interactionCreate.js";
import Ready from "./client/ready.js";
export interface Event {
    [eventName: string]: new (client: Client) => BaseEvent;
}
const events: Event = {
    ready: Ready,
    interactionCreate: interactioncreator
}
export default events