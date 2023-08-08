import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction } from 'discord.js'
import TwitchModel from '../../../models/twitch.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'
import Translator, { keys } from '../../../utils/Translator.js'
import logger from '../../../utils/logger.js'

const headers = {
    'Client-ID': process.env.TWITCH_CLIENT_ID,
    Authorization: process.env.TWITCH_AUTHORIZATION,
}

export default class Twitch extends Command {
    constructor () {
        super({
            name: 'twitch',
            description: 'Set a notification for when a streamer goes live',
            cooldown: 5,
            dm_permission: false,
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: 'add',
                    description: 'Add a notification for when a streamer goes live',
                    options: [
                        {
                            type: ApplicationCommandOptionType.String,
                            name: 'streamer',
                            description: 'Streamer to set the notification',
                            required: true,
                        },
                        {
                            type: ApplicationCommandOptionType.Channel,
                            name: 'channel',
                            description: 'Channel to send the notification',
                            required: true,
                            channel_types: [ChannelType.GuildText],
                        },
                        {
                            type: ApplicationCommandOptionType.Role,
                            name: 'role',
                            description: 'Role to mention when the streamer goes live',
                        },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: 'remove',
                    description: 'Remove a notification for when a streamer goes live',
                    options: [
                        {
                            type: ApplicationCommandOptionType.String,
                            name: 'streamer',
                            description: 'Streamer to remove the notification',
                            required: true,
                        },
                    ],
                },
            ],
        })
    }

    override async run (interaction: ChatInputCommandInteraction) {
        const option = interaction.options.getSubcommand()
        if (option === 'add') this.add(interaction)
        else if (option === 'remove') this.remove(interaction)
    }

    async add (interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild()) return
        const translate = Translator(interaction)
        const client = interaction.client as Client
        const streamer = interaction.options.getString('streamer', true)
        const channel = interaction.options.getChannel('channel', true, [ChannelType.GuildText])
        const role = interaction.options.getRole('role')

        const streamerReq = await fetch(`https://api.twitch.tv/helix/users?login=${streamer}`, { headers })
        if (!streamerReq.ok) {
            return await interaction.reply({
                content: translate(keys.GENERICERROR, {
                    inviteURL: client.officialServerURL,
                }),
                ephemeral: true,
            })
        }

        const streamerData = await streamerReq.json() as { data: TwitchUser[] }
        if (!streamerData.data[0]) {
            return await interaction.reply({
                content: translate(keys.twitch.no_streamer_found),
                ephemeral: true,
            })
        }

        const subreq = await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${2}`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'stream.online',
                version: '1',
                condition: {
                    broadcaster_user_id: streamerData.data[0].id,
                },
                transport: {
                    method: 'webhook',
                    callback: 'https://api.nodebot.xyz/twitch/webhook',
                    secret: process.env.TWITCH_WEBHOOK_SECRET,
                },
            }),
        })
        if (!subreq.ok) {
            return await interaction.reply({
                content: translate(keys.GENERICERROR, {
                    inviteURL: client.officialServerURL,
                }),
                ephemeral: true,
            })
        }
        const subData = await subreq.json() as {
            data: TwitchSubscription[]
            total: number
            total_cost: number
            max_total_cost: number
        }
        logger.info(`TWITCH: ${subData.total} subs creadas | ${subData.total_cost}/${subData.max_total_cost}`)

        await TwitchModel.findOneAndUpdate({
            streamerId: streamerData.data[0].id,
            guildId: interaction.guild.id,
        }, {
            streamerId: streamerData.data[0].id,
            guildId: interaction.guild.id,
            channelId: channel.id,
            roleId: role?.id,
        }, {
            upsert: true,
        })

        return await interaction.reply({
            content: translate(keys.twitch.now_following, {
                streamer: streamerData.data[0].display_name,
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                channel: channel.toString(),
            }) + (role
                ? translate(keys.twitch.role_mention, {
                    role: role.toString(),
                })
                : ''),
        })
    }

    async remove (interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild()) return
        const translate = Translator(interaction)
        const client = interaction.client as Client
        const streamer = interaction.options.getString('streamer', true)

        const streamerReq = await fetch(`https://api.twitch.tv/helix/users?login=${streamer}`, { headers })
        if (!streamerReq.ok) {
            return await interaction.reply({
                content: translate(keys.GENERICERROR, {
                    inviteURL: client.officialServerURL,
                }),
                ephemeral: true,
            })
        }
        const streamerData = await streamerReq.json() as { data: TwitchUser[] }
        if (!streamerData.data[0]) {
            return await interaction.reply({
                content: translate(keys.twitch.no_streamer_found),
                ephemeral: true,
            })
        }

        await TwitchModel.findOneAndDelete({
            streamerId: streamerData.data[0].id,
            guildId: interaction.guild.id,
        })

        return await interaction.reply({
            content: translate(keys.twitch.unfollowed, {
                streamer: streamerData.data[0].display_name,
            }),
        })
    }
}

export interface TwitchUser {
    id: string
    login: string
    display_name: string
    type: string
    broadcaster_type: string
    description: string
    profile_image_url: string
    offline_image_url: string
    view_count: number
    email: string
    created_at: string
}

export interface TwitchSubscription {
    id: string
    status: string
    type: string
    version: string
    condition: {
        user_id: string
    }
    created_at: string
    transport: {
        method: string
        callback: string
    }
    cost: number
}
