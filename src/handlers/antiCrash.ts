import { EmbedBuilder, WebhookClient } from 'discord.js'
import Logger from '../utils/logger'
import Sentry from '@sentry/node'
// TODO: se cmbiara a sentry
const webhookClient = new WebhookClient({
    url: process.env.errorWebhookURL!,
})
process.on('unhandledRejection', async (reason, p) => {
    await webhookClient.send({
        embeds: [
            new EmbedBuilder()
                .setColor(15548997)
                .setFields(
                    { name: 'Razón', value: '```' + (await reason) + '```' },
                    { name: 'Error', value: '```' + (await p) + '```' },
                ),
        ],
    })
    Sentry.captureException(p)
    Logger.warn(' [antiCrash] :: Unhandled Rejection/Catch')
    Logger.error(reason, p)
})
process.on('uncaughtException', (err, origin) => {
    webhookClient.send({
        embeds: [
            new EmbedBuilder().setColor(15548997).setFields(
                { name: 'Origen', value: '```' + origin + '```' },
                {
                    name: 'Error',
                    value: '```' + err + '```',
                },
            ),
        ],
    })
    Logger.warn(' [antiCrash] :: Uncaught Exception/Catch')
    Logger.error(err, origin)
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
    webhookClient.send({
        embeds: [
            new EmbedBuilder().setColor(15548997).setFields(
                { name: 'Origen', value: '```' + origin + '```' },
                {
                    name: 'Error',
                    value: '```' + err + '```',
                },
            ),
        ],
    })
    Logger.warn(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)')
    Logger.error(err, origin)
})
process.on('multipleResolves', (type, promise, reason) => {
    webhookClient.send({
        embeds: [
            new EmbedBuilder().setColor(15548997).setFields({
                name: 'Razón',
                value: '```' + reason + '```',
            }),
        ],
    })
    Logger.warn(' [antiCrash] :: Multiple Resolves')
    Logger.error(reason)
})
