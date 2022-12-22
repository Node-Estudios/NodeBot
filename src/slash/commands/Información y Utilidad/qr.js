// const { Client, CommandInteraction, MessageEmbed, Discord, MessageAttachment } = require('discord.js');
// import Command from '../../../structures/command';
// const QRCode = require("easyqrcodejs-nodejs");

// module.exports = class qr extends Command {
//     constructor(client) {
//        super(client, {
//         name: 'qr',
//         description: 'Send a QR code.',
//         description_localizations: {
//            'es-ES': 'Envía un código QR.',
//         },
//         cooldown: 5,
//         options: [{
//            type: 3,
//            name: 'input',
//            description: 'Url/Text to encode to QR code.',
//            name_localizations: {
//               'es-ES': 'entrada'
//            },
//            description_localizations: {
//               'es-ES': 'Url/Texto a codificar en un código QR.'
//            },
//            required: true
//          },
//             {
//               type: 11,
//                 name: 'image',
//                 description: 'Image to decorate the QR code.',
//                 name_localizations: {
//                      'es-ES': 'imagen'
//                 },
//                 description_localizations: {
//                     'es-ES': 'Imagen para decorar el código QR.'
//                 },
//                 required: false
//             }
//         ]
//      });
//     }
//     /**,
// * @param {Client} client
// * @param {CommandInteraction} interaction
// * @param {String[]} args
// */
// async run(client, interaction, args) {
//     // try {
//         if (!interaction.channel.permissionsFor(interaction.guild.me).has("MANAGE_MESSAGES")) {
//             interaction.reply({ content: `${client.language.MESSAGE[1]} \`"MANAGE_MESSAGES"\``})
//           }
//         for (let index in args) {
//             if (args[index].length > 500) {
//                 const errorembed = new MessageEmbed()
//                     .setColor("RED")
//                     .setTitle(client.language.ERROREMBED)
//                     .setDescription(client.language.VOICEKICK[1])
//                     .setFooter(interaction.member.user.username + "#" + interaction.member.user.discriminator, interaction.member.displayAvatarURL());
//                 return interaction.reply({ embeds: [errorembed], ephemeral: true });
//             }
//         }
//         var options = {
//             // ====== Basic
//             text: "", //PARAMETRO 0
//             width: 256,
//             height: 256,
//             colorDark: `#000000`, //PARAMETRO 1
//             colorLight: `#ffffff`, //PARAMETRO 2
//             correctLevel: QRCode.CorrectLevel.H, // L, M, Q, H
//             dotScale: 1,

//             // ====== Logo
//             /*logoWidth: width/3.5, / / fixed logo width.default is `width/3.5`
//                     logoHeight: heigth/3.5, // fixed logo height. default is `heigth/3.5`
//                     logoMaxWidth: undefined, // Maximum logo width. if set will ignore `logoWidth` value
//                     logoMaxHeight: undefined, // Maximum logo height. if set will ignore `logoHeight` value
//                     logoBackgroundColor: '#fffff', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
//                     logoBackgroundTransparent: false, // Whether use transparent image, default is false

//                     // ====== Backgroud Image
//                     /*
//                     backgroundImage: '', // Background Image
//                     backgroundImageAlpha: 1, // Background image transparency, value between 0 and 1. default is 1.
//                     autoColor: false, // Automatic color adjustment(for data block)
//                     autoColorDark: "rgba(0, 0, 0, .6)", // Automatic color: dark CSS color
//                     autoColorLight: "rgba(255, 255, 255, .7)", // Automatic color: light CSS color
//                     */
//         };
//         let count = 0;
//         let count2 = 0;
//         let argumentos = [];
//         const embed = new MessageEmbed();
//         for (let index in args) {
//             if (isUrl(args[index])) {
//                 count += 1;
//                 options.text = args[index];
//             } else if (
//                 (args[index] == "--transparent" ||
//                     args[index] == "--logotransparent") &&
//                 count2 < 1
//             ) {
//                 count2 += 1;
//             } else if (args[index].startsWith("#") && args[index].length == 7) {
//                 options.colorDark = args[index];
//             } else {
//                 argumentos.push(args[index]);
//             }
//         }
//         if (count > 1)
//             return interaction.reply(
//                 "Solo puedes insertar un URL para el código QR."
//             );
//         if (count == 0) {
//             options.text = args[0]
//             argumentos = [];
//         }
//         if (args[1]) {
//             var qrcode = new QRCode(options);
//             //  Save PNG Images to file
//             qrcode
//                 .saveImage({
//                     path: "./temp/qr.png", // file path
//                 })
//                 .then(() => {
//                     const cap = new MessageAttachment("./temp/qr.png");
//                     embed.setColor("#1DC44F");
//                     embed.setImage("attachment://qr.png");
//                     embed.setFooter(interaction.member.user.username + "#" + interaction.member.user.discriminator, interaction.member.displayAvatarURL());

//                     if (argumentos[0]) embed.addField(argumentos.join(" "), "\u200b");
//                     interaction.reply({ embeds: [embed], files: [cap] }).then(() => {
//                         const fs = require("fs");
//                         // delete a file
//                         fs.unlink("./temp/qr.png", (err) => {
//                             if (err) {
//                                 throw err;
//                             }
//                         });
//                     });
//                 });
//         }
//         Array.from(message.attachments, ([key, value]) => {
//             if (
//                 value &&
//                 value.attachment
//             )
//                 options.logo = value.attachment;
//             if (args && args.length > 1) {
//                 if (
//                     count2 &&
//                     value &&
//                     value.attachment
//                 ) {
//                     options.logoBackgroundTransparent = true;
//                 } else if (count2 && !value) {
//                     const errorembed = new MessageEmbed()
//                         .setColor("RED")
//                         .setTitle(client.language.ERROREMBED)
//                         .setDescription(client.language.QR[5])
//                         .setFooter(interaction.member.user.username + "#" + interaction.member.user.discriminator, interaction.member.displayAvatarURL());
//                     return interaction.reply({ embeds: [errorembed], ephemeral: true });
//                 }
//             }
//             var qrcode = new QRCode(options);
//             //  Save PNG Images to file
//             qrcode
//                 .saveImage({
//                     path: "./temp/qr.png", // file path
//                 })
//                 .then(() => {
//                     const cap = new MessageAttachment("./temp/qr.png");
//                     embed.setColor("#1DC44F");
//                     embed.setImage("attachment://qr.png");
//                     embed.setFooter(interaction.member.user.username + "#" + interaction.member.user.discriminator, interaction.member.displayAvatarURL());

//                     if (argumentos[0]) embed.addField(argumentos.join(" "), "\u200b");
//                     interaction.reply({ embeds: [embed], files: [cap] }).then(() => {
//                         const fs = require("fs");
//                         // delete a file
//                         fs.unlink("./temp/qr.png", (err) => {
//                             if (err) {
//                                 throw err;
//                             }
//                         });
//                     });
//                 });
//         })
//     // } catch (e) {
//     //     console.error(e);
//     //     message.channel.send({
//     //         embeds: [
//     //             new Discord.MessageEmbed()
//     //                 .setColor("RED")
//     //                 .setTitle(client.language.ERROREMBED)
//     //                 .setDescription(client.language.fatal_error)
//     //                 .setFooter(message.author.username, message.author.avatarURL())
//     //         ]
//     //     });
//     //     webhookClient.send(
//     //         `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
//     //     );
//     //     try {
//     //         message.author
//     //             .send(
//     //                 "Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>"
//     //             )
//     //             .catch(e);
//     //     } catch (e) { }
//     // }
//  }
// }
// function isUrl(s) {
// 	var regexp =
// 		/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
// 	return regexp.test(s);
// }
