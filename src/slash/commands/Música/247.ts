import { MessageHelper } from '../../../handlers/messageHandler.js'
import Translator, { keys, randomMessage } from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'

import { EmbedBuilder, ChatInputCommandInteraction } from 'discord.js'

export default class stayinvoice extends Command {
    constructor () {
        super({
            name: '247',
            description: 'Stay 24/7 in a voice channel',
            description_localizations: {
                'es-ES': 'Mantente 24/7 en un canal de voz',
                'en-US': 'Stay 24/7 in a voice channel',
            },
            name_localizations: {
                'es-ES': '247',
                'en-US': '247',
            },
            cooldown: 5,
            dm_permission: false,
        })
    }

    override async run (interaction: ChatInputCommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const msgr = randomMessage(translate, keys.skip.messages)
        const message = new MessageHelper(interaction)
        const player = client.music.players.get(interaction.guild.id)
        if (!player) {
            return await message.sendMessage(
                {
                    embeds: [
                        new EmbedBuilder().setColor(client.settings.color).setFooter({
                            text: msgr,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                },
            )
        }
        if (player.stayInVc) {
            player.stayInVc = false
            const embed = new EmbedBuilder()
                .setColor(client.settings.color)
                .setFooter({ text: translate(keys[247].disabled), iconURL: interaction.user.displayAvatarURL() })
            return await message.sendMessage({ embeds: [embed] })
        } else {
            player.stayInVc = true
            const embed = new EmbedBuilder()
                .setColor(client.settings.color)
                .setFooter({ text: translate(keys[247].enabled), iconURL: interaction.user.displayAvatarURL() })
            return await message.sendMessage({ embeds: [embed] })
        }
    }
}
