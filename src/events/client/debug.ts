import Client from '../../structures/Client.js'
import { BaseEvent } from '../../structures/Events.js'
import logger from '../../utils/logger.js'

export default class Ready extends BaseEvent {
    async run (client: Client, input: String): Promise<void> {
        if (!input.includes('Heartbeat')) { logger.debug(input) }
    }
}
