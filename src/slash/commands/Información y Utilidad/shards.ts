// const { Client, CommandInteraction, MessageEmbed, Discord } = require('discord.js');
// import Command from '../../../structures/command';
// const moment = require('moment');
// require('moment-duration-format');

// export default class shards extends Command {
//     constructor(client) {
//         super(client, {
//             name: 'shards',
//             description: 'Get information about shards.',
//             name_localizations: {
//                 'es-ES': 'shards',
//             },
//             description_localizations: {
//                 'es-ES': 'Obtener información sobre shards.',
//             },
//             cooldown: 5,
//         });
//     }
//     /**,
//      * @param {Client} client
//      * @param {CommandInteraction} interaction
//      * @param {String[]} args
//      */
//     async run(client, interaction, args) {
//         const embeds = [];
//         const promises = [
//             client.shard.fetchClientValues('guilds.cache.size'),
//             client.shard.broadcastEval(c => c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)),
//         ];

//         const shardInfo = await client.shard.broadcastEval(c => ({
//             id: c.shard.ids,
//             shards: c.shard.shards,
//             status: c.shard.client.presence.status,
//             guilds: c.guilds.cache.size,
//             channels: c.channels.cache.size,
//             members: c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0),
//             memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
//             players: c.manager.players.size,
//             playingPlayers: c.manager.players.filter(p => p.playing).size,
//             ping: c.ws.ping,
//         }));

//         let totalPlayers = 0;
//         let totalPlayingPlayers = 0;
//         for (let n = 0; n < shardInfo.length / 15; n++) {
//             const shardArray = shardInfo.slice(n * 15, n * 15 + 15);

//             const embed = new MessageEmbed()
//                 .setColor(process.env.bot1Embed_Color)
//                 .setAuthor('NodeBot', client.user.displayAvatarURL());

//             shardArray.forEach(i => {
//                 const status =
//                     i.status === 'online' ? '<:greendot:894171595365560340>' : '<:RedSmallDot:969759818569093172>';
//                 embed.addField(
//                     `${status} Shard ${parseInt(i.id).toString()}`,
//                     `\`\`\`js\nServers: ${i.guilds.toLocaleString()}\nChannels: ${i.channels.toLocaleString()}\nUsers: ${i.members.toLocaleString()}\nMemory: ${Number(
//                         i.memoryUsage,
//                     ).toLocaleString()} MB\nAPI: ${i.ping.toLocaleString()} ms\nPlayers: ${i.playingPlayers.toLocaleString()}/${i.players.toLocaleString()}\`\`\``,
//                     true,
//                 );
//                 totalPlayers += i.players;
//                 totalPlayingPlayers += i.playingPlayers;
//             });

//             Promise.all(promises).then(async results => {
//                 let totalMemory = 0;
//                 shardArray.forEach(s => (totalMemory += parseInt(s.memoryUsage)));
//                 let totalChannels = 0;
//                 shardArray.forEach(s => (totalChannels += parseInt(s.channels)));
//                 let avgLatency = 0;
//                 shardArray.forEach(s => (avgLatency += s.ping));
//                 avgLatency = avgLatency / shardArray.length;
//                 avgLatency = Math.round(avgLatency);
//                 const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
//                 const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

//                 embed.setDescription(`This guild is currently on **Shard ${client.shard.ids}**.`);
//                 embed.addField(
//                     ' Total Stats',
//                     `\`\`\` Total Servers: ${totalGuilds.toLocaleString()}\nTotal Channels: ${totalChannels.toLocaleString()}\nTotal Users: ${totalMembers.toLocaleString()}\nTotal Memory: ${totalMemory.toFixed(
//                         2,
//                     )} MB\nAvg API Latency: ${avgLatency} ms\nTotal Players: ${totalPlayingPlayers}/${totalPlayers}\`\`\``,
//                 );
//                 embed.setTimestamp();
//                 embeds.push(embed);
//             });
//             interaction.editReply({
//                 embeds: [embed],
//             });
//         }
//     }
// };
