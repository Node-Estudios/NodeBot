import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js'
import Translator, { keys } from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'
import logger from '../../../utils/logger.js'

export default class Resume extends Command {
    constructor () {
        super({
            name: 'resume',
            description: 'Resume the current song!',
            description_localizations: {
                'es-ES': '¡Resume la canción actual!',
                'en-US': 'Resume the current song!',
            },
            name_localizations: {
                'es-ES': 'resumir',
                'en-US': 'pause',
            },
            cooldown: 5,
            dm_permission: false,
        })
    }

    override async run (interaction: ChatInputCommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const player = client.music.players.get(interaction.guild.id)
        if (!player) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(client.settings.color).setFooter({
                        text: translate(keys.queue.no_queue),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
        }
        await interaction.deferReply()

        if (!interaction.member.voice) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(Colors.Red).setFooter({
                        text: translate(keys.skip.no_same),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
                .catch(e => logger.debug(e))
        }

        const vc = player.voiceChannel
        if (interaction.member.voice.channelId !== vc.id) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(Colors.Red).setFooter({
                        text: translate(keys.skip.no_same),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
                .catch(e => logger.debug(e))
        }

        if (!player.queue.current) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(client.settings.color).setFooter({
                        text: translate(keys.queue.no_queue),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
                ephemeral: true,
            })
        }
        player.pause(false)

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setTitle(translate(keys.SUCCESSEMBED))
                    .setDescription(
                        translate(keys.resumed),
                    )
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() }),
            ],
        }).catch(e => logger.debug(e))
        return player.skip()
    }
}
