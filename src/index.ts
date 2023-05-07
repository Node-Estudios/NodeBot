import 'dotenv/config'
import NodeManager from './structures/NodeManager.js'
new NodeManager().spawn()

import Discord from 'discord.js'
Discord.Events.ClientReady
