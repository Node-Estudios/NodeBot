import { interactionCommandExtended } from "../../../events/client/interactionCreate.js"
import { messageHelper } from "../../../handlers/messageHandler.js"
import Client from "../../../structures/Client.js"

import { EmbedBuilder } from 'discord.js'
import Command from '../../../structures/Command.js'

export default class stayinvoice extends Command {
    constructor() {
        super({
            name: '247',
            description: 'Stay 24/7 in a voice channel',
            description_localizations: {
                'es-ES': 'Mantente 24/7 en un canal de voz',
            },
            cooldown: 5,
            // permissions: {
            //     userPermissions: ['ManageMessages'],
            // },
            // options: [
            //     {
            //         type: 4,
            //         name: 'amount',
            //         name_localizations: {
            //             'es-ES': 'cantidad',
            //         },
            //         description: 'Amount of songs to skip.',
            //         description_localizations: {
            //             'es-ES': 'Cantidad de canciones para saltar.',
            //         },
            //         required: false,
            //     }
            // ]
        })
    }
    async run(client: Client, interaction: interactionCommandExtended): Promise<any> {
        if (!interaction.inGuild()) return;
        const message = new messageHelper(interaction)
        const player = client.music.players.get(interaction.guild!.id)
        if (!player) return message.sendMessage({
            embeds: [new EmbedBuilder().setColor(15548997).setFooter({
                text: interaction.language.SKIP[1][1],
                iconURL: interaction.user.displayAvatarURL()
            })]
        }, false)
        if (player.stayInVc) {
            player.stayInVc = false
            const embed = new EmbedBuilder()
                .setColor(client.settings.color)
                .setFooter({ text: interaction.language["247DISABLED"], iconURL: interaction.user.displayAvatarURL() });
            message.sendMessage({ embeds: [embed] }, false)
        } else {
            player.stayInVc = true
            const embed = new EmbedBuilder()
                .setColor(client.settings.color)
                .setFooter({ text: interaction.language["247ENABLED"], iconURL: interaction.user.displayAvatarURL() });
            message.sendMessage({ embeds: [embed] }, false)
        }

    }
}
