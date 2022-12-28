import Logger from '../utils/logger'
import simplestDiscordWebhook from 'simplest-discord-webhook'
import { MessageEmbed } from 'discord.js'
// TODO: se cmbiara a sentry
import Sentry from '@sentry/node'
const webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL)
process.on('unhandledRejection', async (reason, p) => {
    const errorEmbed = new MessageEmbed()
        .setColor(15548997)
        .addField('Razón', '```' + (await reason) + '```')
        .addField('Error', '```' + (await p) + '```')
    await webhookClient.send(errorEmbed)
    Sentry.captureException(p)
    Logger.warn(' [antiCrash] :: Unhandled Rejection/Catch')
    Logger.error(reason, p)
})
process.on('uncaughtException', (err, origin) => {
    const errorEmbed = new MessageEmbed()
        .setColor(15548997)
        .addField('Origen', '```' + origin + '```')
        .addField('Error', '```' + err + '```')
    webhookClient.send(errorEmbed)
    Logger.warn(' [antiCrash] :: Uncaught Exception/Catch')
    Logger.error(err, origin)
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
    const errorEmbed = new MessageEmbed()
        .setColor(15548997)
        .addField('Origen', '```' + origin + '```')
        .addField('Error', '```' + err + '```')
    webhookClient.send(errorEmbed)
    Logger.warn(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)')
    Logger.error(err, origin)
})
process.on('multipleResolves', (type, promise, reason) => {
    const errorEmbed = new MessageEmbed().setColor(15548997).addField('Razón', '```' + reason + '```')
    webhookClient.send(errorEmbed)
    Logger.warn(' [antiCrash] :: Multiple Resolves')
    Logger.error(reason)
})
