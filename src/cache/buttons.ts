import { Collection } from 'discord.js'
import { interactionButtonExtend } from '../events/client/interactionCreate'
import Client from '../structures/Client'
type Button = (client: Client, interaction: interactionButtonExtend) => Promise<any>
export default new Collection<string, Button>()
