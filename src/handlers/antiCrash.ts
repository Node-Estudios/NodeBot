import Client from '#structures/Client.js'
import * as Sentry from '@sentry/node'
import { WebhookClient } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import logger from '#utils/logger.js'

class ErrorManager {
    client: Client
    services = { sentry: { loggedIn: false } }
    webhookClient: WebhookClient
    constructor(client: Client) {
        this.client = client

        if (process.env.SENTRY_DSN && process.env.NODE_ENV === 'production') {
            Sentry.init({
                dsn: process.env.SENTRY_DSN,
                environment: process.env.NODE_ENV || 'development',
                // Basic error tracking
                attachStacktrace: true,
                // Performance Monitoring
                tracesSampleRate: 1.0,
                // Set sampling rate for profiling - this is relative to tracesSampleRate
                profilesSampleRate: 1.0,
                // Filter out common non-error console logs
                beforeSend(event) {
                    // Only send errors and warnings to Sentry
                    if (event.level === 'log') {
                        return null
                    }
                    return event
                },
            })
            this.services.sentry.loggedIn = true
            logger.log('Connected to Sentry')
        } else
            logger.warn('Sentry DSN missing or not in production environment.')

        this.webhookClient = new WebhookClient({
            id: process.env.ERROR_WEBHOOK_ID ?? '',
            token: process.env.ERROR_WEBHOOK_TOKEN ?? '',
        })

        process.on(
            'unhandledRejection',
            this.handleUnhandledRejection.bind(this),
        )
        process.on('uncaughtException', this.handleUncaughtException.bind(this))
        process.on(
            'uncaughtExceptionMonitor',
            this.handleUncaughtExceptionMonitor.bind(this),
        )
    }

    async handleUnhandledRejection(reason: any, p: any) {
        await this.webhookClient.send({
            embeds: [
                new EmbedBuilder().setColor(15548997).setFields(
                    {
                        name: 'Razón',
                        value: '```' + (await reason) + '```',
                    },
                    { name: 'Error', value: '```' + (await p) + '```' },
                    {
                        name: 'Bot',
                        value: this.client.user?.displayName ?? 'Unknown',
                    },
                ),
            ],
        })

        if (this.services.sentry.loggedIn) Sentry.captureException(p)

        logger.warn(' [antiCrash] :: Unhandled Rejection/Catch')
        logger.error(reason, p)
    }

    handleUncaughtException(err: string, origin: string) {
        this.webhookClient.send({
            embeds: [
                new EmbedBuilder().setColor(15548997).setFields(
                    { name: 'Origen', value: '```' + origin + '```' },
                    {
                        name: 'Error',
                        value: '```' + err + '```',
                    },
                    {
                        name: 'Bot',
                        value: this.client.user?.displayName ?? 'Unknown',
                    },
                ),
            ],
        })

        if (this.services.sentry.loggedIn) Sentry.captureException(err)

        logger.warn(' [antiCrash] :: Uncaught Exception/Catch')
        logger.error(err, origin)
    }

    handleUncaughtExceptionMonitor(err: string, origin: string) {
        this.webhookClient.send({
            embeds: [
                new EmbedBuilder().setColor(15548997).setFields(
                    { name: 'Origen', value: '```' + origin + '```' },
                    {
                        name: 'Error',
                        value: '```' + err + '```',
                    },
                    {
                        name: 'Bot',
                        value: this.client.user?.displayName ?? 'Unknown',
                    },
                ),
            ],
        })

        if (this.services.sentry.loggedIn) Sentry.captureException(err)

        logger.warn(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)')
        logger.error(err, origin)
    }

    handleMultipleResolves(type: any, promise: any, reason: string) {
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

        logger.warn(' [antiCrash] :: Multiple Resolves')
        logger.error(reason)
    }

    captureException(error: Error) {
        logger.error(error)
        if (this.services.sentry.loggedIn) Sentry.captureException(error)
        const origin = error.stack?.split('\n')[1]?.trim().split(' ')[1]
        const reason = error.stack?.split('\n')[0]?.trim()
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
                        {
                            name: 'Bot',
                            value: this.client.user?.displayName ?? 'Unknown',
                        },
                    )
                    .setDescription('```\n' + error.stack + '\n```'),
            ],
        })
    }
}

export default ErrorManager
