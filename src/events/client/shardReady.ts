import logger from '../../utils/logger.js'

export default async function (shard: number) {
    logger.info(`Shard ${shard} ready`)
}
