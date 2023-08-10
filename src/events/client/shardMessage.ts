import { Cluster } from 'discord-hybrid-sharding'
import NodeManager from '#structures/NodeManager.js'
import logger from '#utils/logger.js'

export default async function (
    originShard: Cluster,
    message: {
        data: any
        type: 'reboot'
        shard: 'all' | number
        value: any
    },
    manager: NodeManager,
) {
    if (!originShard || !message) return

    if (message.type === 'reboot') {
        if (message.shard === 'all') {
            logger.warn('Reiniciando todas las shards...')
            manager.recluster?.start({
                restartMode: 'gracefulSwitch',
                totalShards: 'auto',
                shardsPerClusters: 10,
            })
        } else {
            logger.warn(`Reiniciando Shard ${message.shard}`)
            manager.recluster?.start({
                restartMode: 'gracefulSwitch',
                totalShards: 'auto',
                shardsPerClusters: message.shard,
            })
        }
    }
}
