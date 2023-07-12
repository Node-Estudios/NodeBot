import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
import { messageHelper } from '../../../handlers/messageHandler.js'
import Client from '../../../structures/Client.js'

import { EmbedBuilder } from 'discord.js'
import Command from '../../../structures/Command.js'
import Translator from '../../../utils/Translator.js'
import { keys } from '../../../utils/locales.js'

export default class stayinvoice extends Command {
    constructor() {
        super({
            name: '247',
            description: 'Stay 24/7 in a voice channel',
            description_localizations: {
                'es-ES': 'Mantente 24/7 en un canal de voz',
                'en-US': 'Stay 24/7 in a voice channel'
            },
            name_localizations: {
                'es-ES': '247',
                'en-US': '247'
            },
            cooldown: 5,
            dm_permission: false,
        })
    }
    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const msgs = [translate(keys.skip.messages[0]), translate(keys.skip.messages[1]), translate(keys.skip.messages[2])]
        const msgr = translate(msgs[Math.floor(Math.random()*msgs.length)])
        const message = new messageHelper(interaction)
        const player = client.music.players.get(interaction.guild.id)
        if (!player)
            return message.sendMessage(
                {
                    embeds: [
                        new EmbedBuilder().setColor(client.settings.color).setFooter({
                            text: msgr,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                },
            )
        if (player.stayInVc) {
            player.stayInVc = false
            const embed = new EmbedBuilder()
                .setColor(client.settings.color)
                .setFooter({ text: translate(keys[247].disabled), iconURL: interaction.user.displayAvatarURL() })
            return message.sendMessage({ embeds: [embed] })
        } else {
            player.stayInVc = true
            const embed = new EmbedBuilder()
                .setColor(client.settings.color)
                .setFooter({ text: translate(keys[247].enabled), iconURL: interaction.user.displayAvatarURL() })
            return message.sendMessage({ embeds: [embed] })
        }
    }
}
