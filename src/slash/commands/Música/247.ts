import { MessageHelper } from '../../../handlers/messageHandler.js'
import Client from '#structures/Client.js'
import Command from '#structures/Command.js'
import Translator, { keys, randomMessage } from '../../../utils/Translator.js'

import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'

export default class stayinvoice extends Command {
    constructor () {
        super({
            name: '247',
            description: 'Stay 24/7 in a voice channel',
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
                .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.displayName })
                .setTitle(translate(keys[247].disabled))
            return await message.sendMessage({ embeds: [embed] })
        } else {
            player.stayInVc = true
            const embed = new EmbedBuilder()
                .setColor(client.settings.color)
                .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.displayName })
                .setTitle(translate(keys[247].enabled))
            return await message.sendMessage({ embeds: [embed] })
        }
    }
}
