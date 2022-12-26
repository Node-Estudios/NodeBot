// const { Client, CommandInteraction, MessageEmbed, Discord } = require('discord.js');
// import Command from '../../../structures/command';

// export default class support extends Command {
//     constructor(client) {
//         super(client, {
//             name: 'support',
//             description: 'Get the official server of Node Bot',
//             name_localizations: {
//                 'es-ES': 'soporte',
//             },
//             description_localizations: {
//                 'es-ES': 'Obtener el servidor oficial de Node Bot',
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
//         // try {
//         let embed = new MessageEmbed().setColor(process.env.bot1Embed_Color).setDescription(client.language.SUPPORT);
//         return interaction.editReply({
//             embeds: [embed],
//         });
//         //   } catch (e) {
//         //     console.error(e);
//         //     message.channel.send({
//         //       embeds: [
//         //         new Discord.MessageEmbed()
//         //         .setColor("RED")
//         //         .setTitle(client.language.ERROREMBED)
//         //         .setDescription(client.language.fatal_error)
//         //         .setFooter(message.author.username, message.author.avatarURL())
//         //       ]
//         //     });
//         //     webhookClient.send(
//         //       `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
//         //     );
//         //     try {
//         //       message.author
//         //         .send(
//         //           "Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>"
//         //         )
//         //         .catch(e);
//         //     } catch (e) {}
//         //   }
//     }
// };
