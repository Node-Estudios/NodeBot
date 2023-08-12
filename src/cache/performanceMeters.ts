import { Collection } from 'discord.js'
import { PerformanceMeter } from '../handlers/performanceMeter.js'

export default new Collection<string, PerformanceMeter>()
