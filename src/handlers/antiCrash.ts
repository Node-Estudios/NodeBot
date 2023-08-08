import * as Sentry from '@sentry/node'
import { EmbedBuilder, WebhookClient } from 'discord.js'
import Client from '../structures/Client.js'
import Logger from '../utils/logger.js'
// TODO: se cmbiara a sentry

class ErrorManager {
    client: Client
    services: { sentry: { loggedIn: boolean } }
    webhookClient: WebhookClient
    constructor (client: Client) {
        this.client = client

        if (process.env.SENTRY_DSN && process.env.NODE_ENV === 'production') {
            Sentry.init({
                dsn: process.env.SENTRY_DSN,
                environment: process.env.NODE_ENV,
                tracesSampleRate: 0.5,
            })
            this.services = {
                sentry: {
                    loggedIn: true,
                },
            }
            Logger.log('Connected to Sentry')
        } else {
            this.services = {
                sentry: {
                    loggedIn: false,
                },
            }
            Logger.warn('Sentry DSN missing or not in production environment.')
        }

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
                        { name: 'Bot', value: this.client.user.displayName },
                    ),
            ],
        })

        if (this.services.sentry.loggedIn) {
            Sentry.captureException(p)
        }

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
                    { name: 'Bot', value: this.client.user.displayName },
                ),
            ],
        })

        if (this.services.sentry.loggedIn) {
            Sentry.captureException(err)
        }

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
                    { name: 'Bot', value: this.client.user.displayName },
                ),
            ],
        })

        if (this.services.sentry.loggedIn) {
            Sentry.captureException(err)
        }

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

        if (this.services.sentry.loggedIn) {
            Sentry.captureMessage('Multiple Resolves: ' + reason)
        }

        Logger.warn(' [antiCrash] :: Multiple Resolves')
        Logger.error(reason)
    }
}

export default ErrorManager
