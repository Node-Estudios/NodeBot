import { ChatInputCommandInteraction } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import Command from '#structures/Command.js'
import Client from '#structures/Client.js'
import logger from '#utils/logger.js'

export default class shards extends Command {
    constructor () {
        super({
            name: 'shards',
            description: 'Get information about shards.',
            cooldown: 30,
        })
    }

    override async run (interaction: ChatInputCommandInteraction<'cached'>) {
        await interaction.deferReply()
        const client = interaction.client as Client
        const embeds = []
        const totalMembers = await this.getMembersCount(client)
        const totalGuilds = await this.getGuildsCount(client)
        const shardInfo = await this.shardInfo(client)
        let totalPlayers = 0
        let totalPlayingPlayers = 0
        const totalMemory = shardInfo.reduce((prev, s) => prev + parseInt(s.memoryUsage), 0)
        const totalChannels = shardInfo.reduce((prev, s) => prev + s.channels, 0)
        const avgLatency = Math.round(shardInfo.reduce((prev, s) => prev + s.ping, 0) / shardInfo.length)

        for (let n = 0; n < shardInfo.length / 15; n++) {
            const shardArray = shardInfo.slice(n * 15, n * 15 + 15)

            const embed = new EmbedBuilder()
                .setColor(client.settings.color)

            embed
                .setDescription(`This guild is currently on **Cluster ${client.cluster.id}**.`)
                .setAuthor({ name: 'NodeBot', iconURL: client.user.displayAvatarURL({ forceStatic: false }) })

            for (const shard of shardArray) {
                const status = shard.status === 'online' ? '<:greendot:894171595365560340>' : '<:RedSmallDot:969759818569093172>'
                embed.addFields([
                    {
                        inline: true,
                        name: `${status} Cluster ${(shard.id).toString()}`,
                        value: `\`\`\`Servers: ${shard.guilds.toLocaleString()}\nChannels: ${shard.channels.toLocaleString()}\nUsers: ${shard.members.toLocaleString()}\nMemory: ${Number(shard.memoryUsage).toLocaleString()} MB\nAPI: ${shard.ping.toLocaleString()} ms\nPlayers: ${shard.playingPlayers.toLocaleString()}/${shard.players.toLocaleString()} \`\`\``,
                    },
                ])

                totalPlayers += shard.players
                totalPlayingPlayers += shard.playingPlayers
            }
            embeds.push(embed)
        }

        embeds.push(
            new EmbedBuilder()
                .setColor(client.settings.color)
                .addFields([
                    {
                        name: 'Total Stats',
                        value: `\`\`\`Total Servers: ${totalGuilds.toLocaleString()}\nTotal Channels: ${totalChannels.toLocaleString()}\nTotal Users: ${totalMembers.toLocaleString()}\nTotal Memory: ${totalMemory.toFixed(2)}\nMB Avg API Latency: ${avgLatency} ms\nTotal Players: ${totalPlayingPlayers}/${totalPlayers}\`\`\``,
                    },
                ])
                .setTimestamp(),
        )
        try {
            await interaction.editReply({ embeds })
        } catch (error) {
            logger.error(error)
        }
    }

    async getMembersCount (client: Client) {
        try {
            const membersCount = await client.cluster.broadcastEval(c => c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0))
            const totalMembers = membersCount.reduce((prev, guildCount) => prev + guildCount, 0)
            return totalMembers
        } catch (error) {
            logger.error(error)
            return 0
        }
    }

    async getGuildsCount (client: Client) {
        try {
            const guildCount = await client.cluster.fetchClientValues('guilds.cache.size')
            const totalGuilds = guildCount.reduce((prev: any, guildCount: any) => prev + guildCount, 0)
            return totalGuilds
        } catch (error) {
            logger.error(error)
            return 0
        }
    }

    async shardInfo (client: Client) {
        try {
            const shardInfo = await client.cluster.broadcastEval((c) => ({
                id: c.cluster.id,
                status: c.cluster.client.user.presence.status,
                guilds: c.guilds.cache.size,
                channels: c.channels.cache.size,
                members: c.guilds.cache.reduce(
                    (prev, guild) => prev + guild.memberCount,
                    0,
                ),
                memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                players: c.music?.players?.size ?? 0,
                playingPlayers: c.music?.players?.filter((p) => p.playing).size ?? 0,
                ping: c.ws.ping,
            }))
            return shardInfo
        } catch (error) {
            logger.error(error)
            return []
        }
    }
};
