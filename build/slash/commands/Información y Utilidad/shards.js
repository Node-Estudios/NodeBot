import EmbedBuilder from '#structures/EmbedBuilder.js';
import Command from '#structures/Command.js';
import logger from '#utils/logger.js';
import Sentry from '@sentry/node';
export default class shards extends Command {
    constructor() {
        super({
            name: 'shards',
            description: 'Get information about shards.',
            cooldown: 30,
        });
    }
    async run(interaction) {
        await interaction.deferReply();
        const client = interaction.client;
        const embeds = [];
        const totalMembers = await this.getMembersCount(client);
        const totalGuilds = await this.getGuildsCount(client);
        const shardInfo = await this.shardInfo(client);
        let totalPlayers = 0;
        let totalPlayingPlayers = 0;
        const totalMemory = shardInfo.reduce((prev, s) => prev + parseInt(s.memoryUsage), 0);
        const totalChannels = shardInfo.reduce((prev, s) => prev + s.channels, 0);
        const avgLatency = Math.round(shardInfo.reduce((prev, s) => prev + s.ping, 0) / shardInfo.length);
        const embedsPerMessage = 10;
        const defaultEmbed = new EmbedBuilder()
            .setColor(client.settings.color)
            .setDescription(`This guild is currently on **Cluster ${client.cluster.id}**.`)
            .setAuthor({ name: 'NodeBot', iconURL: client.user.displayAvatarURL({ forceStatic: false }) });
        interaction.editReply({ embeds: [defaultEmbed] });
        for (let n = 0; n < Math.ceil(shardInfo.length / embedsPerMessage); n++) {
            const startIndex = n * embedsPerMessage;
            const endIndex = startIndex + embedsPerMessage;
            const shardArray = shardInfo.slice(startIndex, endIndex);
            const embed = new EmbedBuilder()
                .setColor(client.settings.color);
            for (const shard of shardArray) {
                const status = shard.status === 'online' ? '<:greendot:894171595365560340>' : '<:RedSmallDot:969759818569093172>';
                embed.addFields([
                    {
                        inline: true,
                        name: `${status} Cluster ${(shard.id).toString()}`,
                        value: `\`\`\`Servers: ${shard.guilds.toLocaleString()}\nChannels: ${shard.channels.toLocaleString()}\nUsers: ${shard.members.toLocaleString()}\nMemory: ${Number(shard.memoryUsage).toLocaleString()} MB\nAPI: ${shard.ping.toLocaleString()} ms\nPlayers: ${shard.playingPlayers.toLocaleString()}/${shard.players.toLocaleString()} \`\`\``,
                    },
                ]);
                totalPlayers += shard.players;
                totalPlayingPlayers += shard.playingPlayers;
            }
            const totalStatsEmbed = new EmbedBuilder()
                .setColor(client.settings.color)
                .addFields([
                {
                    name: 'Total Stats',
                    value: `\`\`\`Total Servers: ${totalGuilds.toLocaleString()}\nTotal Channels: ${totalChannels.toLocaleString()}\nTotal Users: ${totalMembers.toLocaleString()}\nTotal Memory: ${totalMemory.toFixed(2)}\nMB Avg API Latency: ${avgLatency} ms\nTotal Players: ${totalPlayingPlayers}/${totalPlayers}\`\`\``,
                },
            ])
                .setTimestamp();
            embeds.push(embed);
            embeds.push(totalStatsEmbed);
        }
        for (const embedToSend of embeds)
            try {
                await interaction.channel?.send({ embeds: [embedToSend] });
            }
            catch (error) {
                logger.error(error);
                Sentry.captureException(error);
            }
    }
    async getMembersCount(client) {
        try {
            const membersCount = await client.cluster.broadcastEval(c => c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0));
            const totalMembers = membersCount.reduce((prev, guildCount) => prev + guildCount, 0);
            return totalMembers;
        }
        catch (error) {
            logger.error(error);
            return 0;
        }
    }
    async getGuildsCount(client) {
        try {
            const guildCount = await client.cluster.fetchClientValues('guilds.cache.size');
            const totalGuilds = guildCount.reduce((prev, guildCount) => prev + guildCount, 0);
            return totalGuilds;
        }
        catch (error) {
            logger.error(error);
            return 0;
        }
    }
    async shardInfo(client) {
        try {
            const shardInfo = await client.cluster.broadcastEval((c) => ({
                id: c.cluster.id,
                status: c.cluster.client.user.presence.status,
                guilds: c.guilds.cache.size,
                channels: c.channels.cache.size,
                members: c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0),
                memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                players: c.music?.players?.size ?? 0,
                playingPlayers: c.music?.players?.filter((p) => p.playing).size ?? 0,
                ping: c.ws.ping,
            }));
            return shardInfo;
        }
        catch (error) {
            logger.error(error);
            return [];
        }
    }
}
;
//# sourceMappingURL=shards.js.map