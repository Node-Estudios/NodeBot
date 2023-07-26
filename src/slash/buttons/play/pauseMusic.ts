import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder } from 'discord.js'
import Translator, { keys } from '../../../utils/Translator.js'
import Client from '../../../structures/Client.js'
import Button from '../../../structures/Button.js'

export default class Pause extends Button {
    constructor () {
        super('pauseMusic')
    }

    override async run (interaction: ButtonInteraction) {
        if (!interaction.inCachedGuild()) return await interaction.deferUpdate()
        const client = interaction.client as Client
        const translate = Translator(interaction)

        const player = client.music.players.get(interaction.guild.id)
        if (!player?.queue.current) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(15548997).setFooter({
                        text: translate(keys.queue.no_queue),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
            })
        }

        return await client.music.trackPause(player, interaction)
    }
}
