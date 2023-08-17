import Client from '#structures/Client.js'
import Logger from '#utils/logger.js'
import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'
import { WebhookClient  } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
// TODO: se cmbiara a sentry

class ErrorManager {
    client: Client
    services = { sentry: { loggedIn: false } }
    webhookClient: WebhookClient
    constructor (client: Client) {
        this.client = client

        if (process.env.SENTRY_DSN && process.env.NODE_ENV === 'production') {
            Sentry.init({
                dsn: process.env.SENTRY_DSN,
                integrations: [
                    new Sentry.Integrations.Console(),
                    new ProfilingIntegration(),
                    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),

                ],
                environment: process.env.NODE_ENV,
                tracesSampleRate: 0.5,
            })
            this.services.sentry.loggedIn = true
            Logger.log('Connected to Sentry')
        } else
            Logger.warn('Sentry DSN missing or not in production environment.')

        this.webhookClient = new WebhookClient({
            id: process.env.ERROR_WEBHOOK_ID ?? '',
            token: process.env.ERROR_WEBHOOK_TOKEN ?? '',
        })

        process.on('unhandledRejection', this.handleUnhandledRejection.bind(this))
        process.on('uncaughtException', this.handleUncaughtException.bind(this))
        process.on('uncaughtExceptionMonitor', this.handleUncaughtExceptionMonitor.bind(this))
    }

    async handleUnhandledRejection (reason: any, p: any) {
        await this.webhookClient.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(15548997)
                    .setFields(
                        { name: 'Razón', value: '```' + (await reason) + '```' },
                        { name: 'Error', value: '```' + (await p) + '```' },
                        { name: 'Bot', value: this.client.user?.displayName ?? 'Unknown' },
                    ),
            ],
        })

        if (this.services.sentry.loggedIn)
            Sentry.captureException(p)

        Logger.warn(' [antiCrash] :: Unhandled Rejection/Catch')
        Logger.error(reason, p)
    }

    handleUncaughtException (err: string, origin: string) {
        this.webhookClient.send({
            embeds: [
                new EmbedBuilder().setColor(15548997).setFields(
                    { name: 'Origen', value: '```' + origin + '```' },
                    {
                        name: 'Error',
                        value: '```' + err + '```',
                    },
                    { name: 'Bot', value: this.client.user?.displayName ?? 'Unknown' },
                ),
            ],
        })

        if (this.services.sentry.loggedIn)
            Sentry.captureException(err)

        Logger.warn(' [antiCrash] :: Uncaught Exception/Catch')
        Logger.error(err, origin)
    }

    handleUncaughtExceptionMonitor (err: string, origin: string) {
        this.webhookClient.send({
            embeds: [
                new EmbedBuilder().setColor(15548997).setFields(
                    { name: 'Origen', value: '```' + origin + '```' },
                    {
                        name: 'Error',
                        value: '```' + err + '```',
                    },
                    { name: 'Bot', value: this.client.user?.displayName ?? 'Unknown' },
                ),
            ],
        })

        if (this.services.sentry.loggedIn)
            Sentry.captureException(err)

        Logger.warn(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)')
        Logger.error(err, origin)
    }

    handleMultipleResolves (type: any, promise: any, reason: string) {
        this.webhookClient.send({
            embeds: [
                new EmbedBuilder().setColor(15548997).setFields({
                    name: 'Razón',
                    value: '```' + reason + '```',
                }),
            ],
        })

        if (this.services.sentry.loggedIn)
            Sentry.captureMessage('Multiple Resolves: ' + reason)

        Logger.warn(' [antiCrash] :: Multiple Resolves')
        Logger.error(reason)
    }

    captureException (error: Error) {
        if (this.services.sentry.loggedIn)
            Sentry.captureException(error)
        const origin = error.stack?.split('\n')[1].trim().split(' ')[1]
        const reason = error.stack?.split('\n')[0].trim()
        this.webhookClient.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(15548997)
                    .setFields(
                        { name: 'Origen', value: '```' + origin + '```' },
                        {
                            name: 'Razón',
                            value: '```' + reason + '```',
                        },
                        { name: 'Bot', value: this.client.user?.displayName ?? 'Unknown' })
                    .setDescription('```\n' + error.stack + '\n```'),
            ],
        })
    }
}

export default ErrorManager
