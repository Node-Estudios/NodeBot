const { setTimeout: sleep } = require('node:timers/promises')
import { Cluster } from 'discord-hybrid-sharding'
import NodeManager from '../../structures/NodeManager.js'
import logger from '../../utils/logger.js'

export default async function (
    originShard: Cluster,
    message: {
        data: any
        type: any
        shard: any
        value: any
    },
    manager: NodeManager,
) {
    if (!originShard || !message) return

    switch (message.type) {
        case 'reboot':
            switch (message.shard) {
                case 'all':
                    logger.warn('Reiniciando todas las shards...')
                    manager.recluster?.start({ restartMode: 'gracefulSwitch', totalShards: 'auto', shardsPerClusters: 10 })
                case 'shard':
                    logger.warn(`Reiniciando Shard ${message.shard}`)
                    manager.recluster?.start({ restartMode: 'gracefulSwitch', totalShards: 'auto', shardsPerClusters: message.shard })
                    break
            }
            break
    }
}
