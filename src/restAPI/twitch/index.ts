import express, { Router as router, Request } from 'express'
import NodeManager from '#structures/NodeManager.js'
import { LocaleString, REST, Routes } from 'discord.js'
import Translator, { keys } from '#utils/Translator.js'
import { db } from 'src/prisma/db'

const rest = new REST().setToken(process.env.TOKEN)

export default class Twitch {
    manager: NodeManager
    router = router()
    // app: Express.Application
    constructor(manager: NodeManager) {
        this.manager = manager
        this.#load()
    }

    #load() {
        this.router.use(express.json())

        this.router.post(
            '/webhook',
            express.raw({ type: 'application/json' }),
            async (
                req: Request<
                    {},
                    {},
                    WebhookCallbackVerificationEvent | NotificationEvent
                >,
                res,
            ) => {
                const type = req.headers.webhook_callback_verification ?? ''
                if (type === 'webhook_callback_verification') {
                    const body = req.body as WebhookCallbackVerificationEvent
                    return res.status(200).send(body.challenge)
                }
                if (type === 'revocation') {
                    // TODO: handle this
                    return res.status(200).send('ok')
                }
                if (type !== 'notification') {
                    return res.status(200).send('ok')
                }

                res.status(200).send('ok')
                const body = req.body as NotificationEvent
                const subs = await db.twitch.findMany({
                    where: {
                        streamer_id: body.event.broadcaster_user_id,
                    },
                })

                for (const sub of subs) {
                    const translate = Translator(
                        await this.getGuildLang(sub.guild_id),
                    )
                    await rest.post(Routes.channelMessages(sub.channel_id), {
                        body: {
                            content: `${sub.role_id ? `<@&${sub.role_id}> ` : ''}${translate(
                                keys.twitch.now_live,
                                {
                                    streamer: body.event.broadcaster_user_name,
                                },
                            )}`,
                        },
                    })
                }
                return undefined
            },
        )
        return this.router
    }

    async getGuildLang(guildId: string) {
        const guild = (await rest.get(Routes.guild(guildId))) as {
            preferred_locale: LocaleString
        }
        return guild?.preferred_locale ?? 'en-US'
    }
}

export interface WebhookCallbackVerificationEvent {
    challenge: string
    subscription: Subscription
}

export interface Subscription {
    id: string
    status: string
    type: string
    version: string
    cost: number
    condition: Condition
    transport: Transport
    created_at: string
}

export interface Condition {
    broadcaster_user_id: string
}

export interface NotificationEvent {
    subscription: Subscription
    event: Event
}

export interface Transport {
    method: string
    callback: string
}

export interface Event {
    user_id: string
    user_login: string
    user_name: string
    broadcaster_user_id: string
    broadcaster_user_login: string
    broadcaster_user_name: string
    followed_at: string
}
