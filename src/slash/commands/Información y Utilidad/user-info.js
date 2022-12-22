// const { Client, CommandInteraction, MessageEmbed, Discord } = require('discord.js');
// import Command from '../../../structures/command';
// const moment = require('moment');

// const flags = {
//     DISCORD_EMPLOYEE: 'Discord Employee',
//     PARTNERED_SERVER_OWNER: 'Discord Partner',
//     BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
//     BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
//     HYPESQUAD_EVENTS: 'HypeSquad Events',
//     HOUSE_BRAVERY: 'House of Bravery',
//     HOUSE_BRILLIANCE: 'House of Brilliance',
//     HOUSE_BALANCE: 'House of Balance',
//     EARLY_SUPPORTER: 'Early Supporter',
//     TEAM_USER: 'Team User',
//     SYSTEM: 'System',
//     VERIFIED_BOT: 'Verified Bot',
//     EARLY_VERIFIED_BOT_DEVELOPER: 'Verified Bot Developer',
//     DISCORD_CERTIFIED_MODERATOR: 'Discord Certified Moderator',
// };

// module.exports = class userinfo extends Command {
//     constructor(client) {
//         super(client, {
//             name: 'userinfo',
//             description: 'Get the info of a user.',
//             name_localizations: {
//                 'es-ES': 'infousuario',
//             },
//             description_localizations: {
//                 'es-ES': 'Otene la información de un usuario.',
//             },
//             cooldown: 5,
//             options: [
//                 {
//                     type: 6,
//                     name: 'user',
//                     description: 'User to get the info ',
//                     name_localizations: {
//                         'es-ES': 'usuario',
//                     },
//                     description_localizations: {
//                         'es-ES': 'Ususario al que se le obtendrá la información',
//                     },
//                     required: false,
//                 },
//             ],
//         });
//     }
//     /**,
//      * @param {Client} client
//      * @param {CommandInteraction} interaction
//      * @param {String[]} args
//      */
//     async run(client, interaction, args) {
//         // try {
//         let embed2 = new MessageEmbed()
//             .setColor(process.env.bot1Embed_Color)
//             .setDescription('Obteniendo el perfil...')
//             .setFooter(
//                 interaction.member.user.username + '#' + interaction.member.user.discriminator,
//                 interaction.member.displayAvatarURL(),
//             );
//         const sentMessage = await interaction.editReply({
//             content: ' ',
//             embeds: [embed2],
//         });
//         let member;
//         if (args[0]) {
//             member = await interaction.guild.members.fetch(args[0]).catch(e => {
//                 return;
//             });
//         } else {
//             member = interaction.member;
//         }
//         if (!member || !member.user) {
//             const errorembed = new MessageEmbed()
//                 .setColor('RED')
//                 .setTitle(client.language.ERROREMBED)
//                 .setDescription(client.language.USERINFO[17])
//                 .setFooter(
//                     interaction.member.user.username + '#' + interaction.member.user.discriminator,
//                     interaction.member.displayAvatarURL(),
//                 );
//             return interaction.editReply({
//                 embeds: [errorembed],
//             });
//         }
//         let badges = [];
//         const roles = member.roles.cache
//             .sort((a, b) => b.position - a.position)
//             .map(role => role.toString())
//             .slice(0, -1);
//         const userFlags = member.user.flags ? member.user.flags.toArray() : ' ';
//         const guild = interaction.guild;
//         const embed = new MessageEmbed().setTimestamp(' ');
//         if (member.user.displayAvatarURL())
//             embed.setThumbnail(
//                 member.user.displayAvatarURL({
//                     dynamic: true,
//                 }),
//             );
//         if (guild.name)
//             embed.setAuthor(
//                 guild.name,
//                 guild.iconURL({
//                     dynamic: true,
//                 }),
//             );
//         if (guild.bannerURL())
//             embed.setImage(
//                 guild.bannerURL({
//                     dynamic: true,
//                 }),
//             );
//         if (member.displayHexColor && member.displayHexColor != '#000000') {
//             embed.setColor(member.displayHexColor);
//         } else {
//             embed.setColor('##008822');
//         }
//         if (member.user && member.user.username)
//             embed.addField(
//                 `<:crown:893553167931957298> ${client.language.USERINFO[1]}`,
//                 '```' + `${member.user.username}` + '```',
//             );
//         if (member.user && member.user.discriminator)
//             embed.addField(
//                 '<:textchannelblurple:893490117451333632> ' + client.language.USERINFO[2],
//                 '```' + `${member.user.discriminator}` + '```',
//                 true,
//             );
//         if (member.id)
//             embed.addField(
//                 `<:blurple_settings:970394928742027304> ${client.language.USERINFO[3]}`,
//                 '```' + `${member.id}` + '```',
//                 true,
//             );
//         if (userFlags)
//             embed.addField(
//                 `<:ticketblurple:893490671615361024> ${client.language.USERINFO[11]}`,
//                 '```' +
//                     `${
//                         userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : client.language.USERINFO[8]
//                     }` +
//                     '```',
//                 true,
//             );
//         if (member.user && member.user.createdTimestamp)
//             embed.addField(
//                 `📆 ${client.language.USERINFO[5]}`,
//                 '```' +
//                     `${moment(member.user.createdTimestamp).format('LT')}\n${moment(
//                         member.user.createdTimestamp,
//                     ).format('LL')}\n${moment(member.user.createdTimestamp).fromNow()}` +
//                     '```',
//                 true,
//             );
//         if (member.user && member.user.presence && member.user.presence.game)
//             embed.addField(
//                 `<:screenshare:864126217941942353> ${client.language.USERINFO[12]}`,
//                 '```' + `${member.user.presence.game || client.language.USERINFO[16]}` + '```',
//                 true,
//             );
//         if (member.roles && member.roles.highest.id && member.roles.highest.name)
//             embed.addField(
//                 `<:upvote:970397919700197496> ${client.language.USERINFO[13]}`,
//                 '```' +
//                     `${
//                         member.roles.highest.id === interaction.guild.id
//                             ? client.language.USERINFO[8]
//                             : member.roles.highest.name
//                     }` +
//                     '```',
//                 true,
//             );
//         if (member.joinedAt)
//             embed.addField(
//                 '<:Discord_Emoji_Black:970394989785931866>' + client.language.USERINFO[4],
//                 '```' + `${moment(member.joinedAt).format('LL LTS')}` + '```',
//                 true,
//             );
//         if (member.roles)
//             embed.addField(
//                 `<:search:893553167801921547> ${client.language.USERINFO[14]}`,
//                 `${member.roles.hoist ? member.roles.hoist : client.language.USERINFO[8]}`,
//                 true,
//             );
//         if (member.user.displayAvatarURL())
//             embed.addField(
//                 '<:8512blurplelink:971487113679884288> Avatar',
//                 `[${client.language.USERINFO[15]}](${member.user.displayAvatarURL({
//                     dynamic: true,
//                 })})`,
//                 true,
//             );
//         interaction.editReply({
//             embeds: [embed],
//         });
//         // if (emblemas && emblemas.Premium.Enabled)
//         //     badges.push("<a:premium:866135287258939393>");
//         // if (emblemas && emblemas.EarlyPremium.Enabled)
//         //     badges.push("<a:earlypremium:866135322886012978>");
//         // if (emblemas && emblemas.Tester.Enabled)
//         //     badges.push("<:tester:871395085017813002>");
//         // if (emblemas && emblemas.Notifications.Enabled)
//         //     badges.push("<:notifications:864103839266897951>");
//         // if (emblemas && emblemas.Developer.Enabled)
//         //     badges.push("<:developer:866134938185367552>");
//         // if (emblemas && emblemas.Booster.Enabled)
//         //     badges.push("<:serverbooster:864102069728313354>");
//         // if (emblemas && emblemas.Support.Enabled)
//         //     badges.push("<:support:863983092702904350>");
//         // CodeModel.findOne({ USERID: message.author.id.toString() }).then((s, err) => {
//         //     if (err) {
//         //         embed.addField(
//         //             client.language.USERINFO[18],
//         //             `${badges.length > 0 ? badges.join(" ") : client.language.USERINFO[8]}`,
//         //             true
//         //         );
//         //         if (roles[0])
//         //             embed.addField(
//         //                 `<:star:864103299900243970> Roles [${roles.length}]`,
//         //                 `${roles.length < 10
//         //                     ? roles.join(" ")
//         //                     : roles.length > 10
//         //                         ? trimArray(roles)
//         //                         : client.language.USERINFO[8]
//         //                 }`
//         //             );
//         //         return sentMessage.edit({ embeds: [embed] });
//         //     }
//         //     if (s) {
//         //         if (s.SERVERS >= 1) {
//         //             badges.push("<:25kEvent:877189363157585990>")
//         //         }
//         //         embed.addField(
//         //             client.language.USERINFO[18],
//         //             `${badges.length > 0 ? badges.join(" ") : client.language.USERINFO[8]}`,
//         //             true
//         //         );
//         //         if (roles[0])
//         //             embed.addField(
//         //                 `<:star:864103299900243970> Roles [${roles.length}]`,
//         //                 `${roles.length < 10
//         //                     ? roles.join(" ")
//         //                     : roles.length >= 10
//         //                         ? trimArray(roles)
//         //                         : client.language.USERINFO[8]
//         //                 }`
//         //             );
//         //         return sentMessage.edit({ embeds: [embed] });
//         //     } else {
//         //         embed.addField(
//         //             client.language.USERINFO[18],
//         //             `${badges.length > 0 ? badges.join(" ") : client.language.USERINFO[8]}`,
//         //             true
//         //         );
//         //         if (roles[0])
//         //             embed.addField(
//         //                 `<:star:864103299900243970> Roles [${roles.length}]`,
//         //                 `${roles.length < 10
//         //                     ? roles.join(" ")
//         //                     : roles.length > 10
//         //                         ? trimArray(roles)
//         //                         : client.language.USERINFO[8]
//         //                 }`
//         //             );
//         //         return sentMessage.edit({ embeds: [embed] });
//         //     }
//         // })
//         // } catch (e) {
//         //     console.error(e);
//         //     message.channel.send({
//         //         embeds: [
//         //             new Discord.MessageEmbed()
//         //                 .setColor("RED")
//         //                 .setTitle(client.language.ERROREMBED)
//         //                 .setDescription(client.language.fatal_error)
//         //                 .setFooter(message.author.username, message.author.avatarURL())
//         //         ]
//         //     });
//         //     webhookClient.send(
//         //         `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
//         //     );
//         //     try {
//         //         message.author
//         //             .send(
//         //                 "Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>"
//         //             )
//         //             .catch(e);
//         //     } catch (e) { }
//         // }
//     }
// };

// function trimArray(arr, maxLen = 10) {
//     if (arr.length > maxLen) {
//         const len = arr.length - maxLen;
//         arr = arr.slice(0, maxLen);
//         arr.push(`${len} more...`);
//     }
//     return arr;
// }
