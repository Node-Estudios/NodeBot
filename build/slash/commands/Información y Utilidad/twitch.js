import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import TwitchModel from '#models/twitch.js';
import Command from '#structures/Command.js';
import Translator, { keys } from '#utils/Translator.js';
import logger from '#utils/logger.js';
const headers = {
    'Client-ID': process.env.TWITCH_CLIENT_ID,
    Authorization: process.env.TWITCH_AUTHORIZATION,
};
export default class Twitch extends Command {
    constructor() {
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
        });
    }
    async run(interaction) {
        const option = interaction.options.getSubcommand();
        if (option === 'add')
            this.add(interaction);
        else if (option === 'remove')
            this.remove(interaction);
    }
    async add(interaction) {
        if (!interaction.inCachedGuild())
            return;
        const translate = Translator(interaction);
        const client = interaction.client;
        const streamer = interaction.options.getString('streamer', true);
        const channel = interaction.options.getChannel('channel', true, [ChannelType.GuildText]);
        const role = interaction.options.getRole('role');
        const streamerReq = await fetch(`https://api.twitch.tv/helix/users?login=${streamer}`, { headers });
        if (!streamerReq.ok) {
            return await interaction.reply({
                content: translate(keys.GENERICERROR, {
                    inviteURL: client.officialServerURL,
                }),
                ephemeral: true,
            });
        }
        const streamerData = await streamerReq.json();
        if (!streamerData.data[0]) {
            return await interaction.reply({
                content: translate(keys.twitch.no_streamer_found),
                ephemeral: true,
            });
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
        });
        if (!subreq.ok) {
            return await interaction.reply({
                content: translate(keys.GENERICERROR, {
                    inviteURL: client.officialServerURL,
                }),
                ephemeral: true,
            });
        }
        const subData = await subreq.json();
        logger.info(`TWITCH: ${subData.total} subs creadas | ${subData.total_cost}/${subData.max_total_cost}`);
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
        });
        return await interaction.reply({
            content: translate(keys.twitch.now_following, {
                streamer: streamerData.data[0].display_name,
                channel: channel.toString(),
            }) + (role
                ? translate(keys.twitch.role_mention, {
                    role: role.toString(),
                })
                : ''),
        });
    }
    async remove(interaction) {
        if (!interaction.inCachedGuild())
            return;
        const translate = Translator(interaction);
        const client = interaction.client;
        const streamer = interaction.options.getString('streamer', true);
        const streamerReq = await fetch(`https://api.twitch.tv/helix/users?login=${streamer}`, { headers });
        if (!streamerReq.ok) {
            return await interaction.reply({
                content: translate(keys.GENERICERROR, {
                    inviteURL: client.officialServerURL,
                }),
                ephemeral: true,
            });
        }
        const streamerData = await streamerReq.json();
        if (!streamerData.data[0]) {
            return await interaction.reply({
                content: translate(keys.twitch.no_streamer_found),
                ephemeral: true,
            });
        }
        await TwitchModel.findOneAndDelete({
            streamerId: streamerData.data[0].id,
            guildId: interaction.guild.id,
        });
        return await interaction.reply({
            content: translate(keys.twitch.unfollowed, {
                streamer: streamerData.data[0].display_name,
            }),
        });
    }
}
//# sourceMappingURL=twitch.js.map