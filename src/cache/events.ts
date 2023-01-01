import { Collection } from 'discord.js'
import { EventHandler } from '../structures/Events'
export default new Collection<string, EventHandler>()
