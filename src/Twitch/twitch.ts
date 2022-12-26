import express from 'express'
import crypto from 'node:crypto'
const app = express()
const port = '8085'
const twitchSigningSecret = '273823283ehywdh'
import logger from '../utils/logger.js'
import TwitchModel from '../models/twitch'
import client from '../bot.js'
import { MessageEmbed, TextChannel } from 'discord.js'

logger.debug('Twitch Iniciado Correctamente')
app.get('/', (req, res) => {
    res.send('Hola pa')
})

const verifyTwitchSignature = (req, res, buf, encoding) => {
    const messageId = req.header('Twitch-Eventsub-Message-Id')
    const timestamp = req.header('Twitch-Eventsub-Message-Timestamp')
    const messageSignature = req.header('Twitch-Eventsub-Message-Signature')
    const time = Math.floor(Date.now() / 1000)
    logger.log(`Message ${messageId} Signature: `, messageSignature)

    if (Math.abs(time - timestamp) > 600) {
        // needs to be < 10 minutes
        logger.debug(`Verification Failed: timestamp > 10 minutes. Message Id: ${messageId}.`)
        throw new Error('Ignore this request.')
    }

    if (!twitchSigningSecret) {
        logger.warn(`Twitch signing secret is empty.`)
        throw new Error('Twitch signing secret is empty.')
    }

    const computedSignature =
        'sha256=' +
        crypto
            .createHmac('sha256', twitchSigningSecret)
            .update(messageId + timestamp + buf)
            .digest('hex')
    logger.debug(`Message ${messageId} Computed Signature: `, computedSignature)

    if (messageSignature !== computedSignature) throw new Error('Invalid signature.')
    else logger.log('Verification successful')
}

app.use(
    '/webhooks/callback/',
    express.json({
        verify: verifyTwitchSignature,
    }),
)

app.post('/webhooks/callback/', async (req, res) => {
    const messageType = req.header('Twitch-Eventsub-Message-Type')
    if (messageType === 'webhook_callback_verification') {
        logger.info('Verifying Webhook')
        const s = await TwitchModel.findOne({
            broadcaster_user_id: '59718370' /*parseInt(req.body.subscription.condition.broadcaster_user_id)*/,
        })
        if (s) logger.info('Ya existe')

        return res.status(200).send(req.body.challenge)
    }

    const { type } = req.body.subscription
    const { event } = req.body

    switch (type) {
        case 'stream.online':
            logger.log(event)
            const s = await TwitchModel.findOne({
                broadcaster_user_id:
                    event.broadcaster_user_id /*parseInt(req.body.subscription.condition.broadcaster_user_id)*/,
            })
            if (!s) return logger.error('Error, no existe este usuario en nuestra base de datos')
            s.Interacciones.Guilds.forEach(guild =>
                client.shard?.broadcastEval(
                    (c, context: any) => {
                        if (c.guilds.cache.get(context.guild?.id as string)) {
                            const guild2 = c.guilds.cache.get(context.guild.id)
                            if (!context.guild.customMessage.embed?.length) return
                            const tituloEmbed = context.guild.customMessage.embed.title
                                .toString()
                                .replace('{streamer}', context.s.display_name)
                            const descripcionEmbed = context.guild.customMessage.embed.description
                                .toString()
                                .replace('{streamer}', context.s.display_name)
                                .replace('{link}', `https://twitch.tv/${context.s.display_name}`)
                            const embed = new MessageEmbed()
                                .setTitle(tituloEmbed)
                                .setColor(context.guild.customMessage.embed.color)
                                .setDescription(descripcionEmbed)
                                .setAuthor(
                                    'Node Bot',
                                    'https://cdn.discordapp.com/avatars/828771710676500502/c0e14a183dead07a277b0aa907ebc270.webp?size=4096',
                                    'https://nodebot.xyz',
                                )
                                .setImage(
                                    `https://static-cdn.jtvnw.net/previews-ttv/live_user_${context.s.login}-1920x1080.jpg`,
                                )
                            if (
                                context.guild.customMessage.embed.footer &&
                                context.guild.customMessage.embed.footericon
                            )
                                embed.setFooter({
                                    text: context.guild.customMessage.embed.footer
                                        .replace('{streamer}', context.s.display_name)
                                        .replace('{link}', `https://twitch.tv/${context.s.display_name}`),
                                    iconURL: context.guild.customMessage.embed.footericon,
                                })
                            else if (
                                context.guild.customMessage.embed.footer &&
                                !context.guild.customMessage.embed.footericon
                            )
                                embed.setFooter({
                                    text: context.guild.customMessage.embed.footer
                                        .replace('{streamer}', context.s.display_name)
                                        .replace('{link}', `https://twitch.tv/${context.s.display_name}`),
                                })

                            if (context.guild.customMessage.embed.thumbnail)
                                embed.setThumbnail(context.guild.customMessage.embed.thumbnail)

                            if (context.guild.customMessage.embed.titleurl)
                                embed.setURL(
                                    context.guild.customMessage.embed.titleurl.replace(
                                        '{link}',
                                        `https://twitch.tv/${context.s.display_name}`,
                                    ),
                                )

                            if (context.guild.customMessage.embed.timestamp)
                                context.embed
                                    .setTimestamp()(
                                        guild2?.channels?.cache.get(
                                            context.guild.textChannel.replace('<#', '').replace('>', ''),
                                        ) as TextChannel,
                                    )
                                    ?.send({ embeds: [embed] })
                        }
                    },
                    { context: { guild, s } },
                ),
            )
            s.Interacciones.Users.forEach(async user => {
                try {
                    const u = await client.users.fetch(user.id)
                    if (!user.id) return
                    u.send({
                        content: user.message
                            .toString()
                            .replace('{streamer}', s.display_name)
                            .replace('{link}', `https://twitch.tv/${s.display_name}`),
                    })
                } catch {}
            })
            logger.info(`${event.broadcaster_user_name} started streaming`)
            break
        case 'stream.offline':
            logger.info(`${event.broadcaster_user_name} stopped streaming`)
            break
        case '':
            break
        default:
            logger.info(`${type} - ${event.channel_name} - ${event.broadcaster_user_name}`)
            break
    }

    res.status(200).end()
})

app.listen(port)
