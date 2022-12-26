import 'dotenv/config'
import './handlers/commands.js'
import './handlers/antiCrash.js'
import NodeManager from './structures/manager.js'
new NodeManager().spawn()
