import Translator, { keys, randomMessage } from '#utils/Translator.js'
import { ChatInputCommandInteraction } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import Command from '#structures/Command.js'
import Client from '#structures/Client.js'
import logger from '#utils/logger.js'

export default class stayinvoice extends Command {
    constructor () {
        super({
            name: '247',
            description: 'Stay 24/7 in a voice channel',
            cooldown: 5,
            dm_permission: false,
        })
    }

    override async run (interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild()) return
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const msgr = randomMessage(translate, keys.skip.messages)
        const player = client.music.players.get(interaction.guild.id)
        if (!player)
            return await interaction.reply(
                {
                    embeds: [
                        new EmbedBuilder().setColor(client.settings.color).setFooter({
                            text: msgr,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                    ephemeral: true,
                },
            )
                .catch(logger.error)

        if (player.stayInVc) {
            player.stayInVc = false
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.settings.color)
                        .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.displayName })
                        .setTitle(translate(keys[247].disabled)),
                ],
            })
                .catch(logger.error)
        } else {
            player.stayInVc = true
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.settings.color)
                        .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.displayName })
                        .setTitle(translate(keys[247].enabled)),
                ],
            })
                .catch(logger.error)
        }
    }
}
