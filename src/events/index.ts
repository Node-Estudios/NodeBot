import Client from '../structures/Client.js'
import { BaseEvent } from '../structures/Events.js'
import debug from './client/debug.js'
import { interactionCreate as interactioncreator } from './client/interactionCreate.js'
import Ready from './client/ready.js'
import guildCreate from './guild/guildCreate.js'
import guildDelete from './guild/guildDelete.js'
import voiceStateUpdate from './voice/voiceStateUpdate.js'
export interface Event {
    [eventName: string]: new (client: Client) => BaseEvent
}
const events: Event = {
    ready: Ready,
    voiceStateUpdate,
    interactionCreate: interactioncreator,
    guildCreate,
    guildDelete,
    debug,
}
export default events
