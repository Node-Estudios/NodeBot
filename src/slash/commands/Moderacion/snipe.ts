// import { interactionCommandExtend } from "../../../events/client/interactionCreate.js"
// import { messageHelper } from "../../../handlers/messageHandler.js"
// import Client from "../../../structures/Client.js"

// import { EmbedBuilder } from 'discord.js'
// import Command from '../../../structures/Command.js'

// export default class snipe extends Command {
//     constructor() {
//         super({
//             name: 'snipe',
//             description: 'Gets the latest message deleted!',
//             description_localizations: {
//                 'es-ES': '¡Obtiene el último mensaje eliminado!',
//             },
//             cooldown: 5,
//             permissions: {
//                 userPermissions: ['ManageMessages'],
//             },
//             options: [
//                 {
//                     type: 7,
//                     name: 'channel',
//                     description: 'The channel to get the message from.',
//                     description_localizations: {
//                         'es-ES': 'El canal para obtener el mensaje.',
//                     },
//                     required: false,
//                 }
//             ]
//         })
//     }
//     async run(client: Client, interaction: interactionCommandExtend) {
//         let message = new messageHelper(interaction)
//         const channel = interaction.options.getChannel('channel', false) || interaction.channel
//         const msg = client.snipes.get(channel.id)
//         if (!msg || !msg.delete) {
//             const errorembed = new EmbedBuilder()
//                 .setColor('Red')
//                 .setTitle(interaction.language.ERROREMBED)
//                 .setDescription(interaction.language.SNIPE[1])
//                 .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
//             // console.log(errorembed)
//             message.sendMessage({ embeds: [errorembed] }, false)
//         } else {
//             const main = new EmbedBuilder()
//                 .setColor(client.settings.color)
//                 .setAuthor({ name: `${interaction.language.SNIPE[2]} ${msg.member?.user.username}`, iconURL: msg.member?.displayAvatarURL() })
//                 .addFields({ name: interaction.language.SNIPE[3], value: `<#${msg.channelId}>` })
//             // .setTimestamp(' ')
//             if (msg.content) main.setDescription(msg.content)
//             if (msg.embeds) {
//                 message.sendMessage({ embeds: [msg.embeds, main] }, false)
//             } else {
//                 message.sendMessage({ embeds: [main] }, false)
//             }
//         }
//     }
// }
