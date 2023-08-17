import { ButtonInteraction  } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import Translator, { keys } from '#utils/Translator.js'
import Client from '#structures/Client.js'
import Button from '#structures/Button.js'

import logger from '#utils/logger.js'

export default class Skip extends Button {
    constructor () {
        super('shuffleMusic')
    }

    override async run (interaction: ButtonInteraction) {
        try {
            if (!interaction.inCachedGuild()) return
            const client = interaction.client as Client
            const translate = Translator(interaction)
            const player = client.music.players.get(interaction.guild.id)

            if (!player?.queue.current) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor(client.settings.color).setFooter({
                            text: translate(keys.queue.no_queue),
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                })
            }

            if (interaction.member.voice.channelId !== (player.voiceChannel.id ?? '')) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor(client.settings.color).setFooter({
                            text: translate(keys.skip.no_same),
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                })
            }

            if (!player.queue.current) return
            player.queue.shuffle()

            return await interaction.deferUpdate()
        } catch (e) {
            logger.error(e)
        }
        return true
    }
}
