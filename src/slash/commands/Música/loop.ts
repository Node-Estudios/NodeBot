import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'
import Translator, { keys } from '../../../utils/Translator.js'
import logger from '../../../utils/logger.js'

export default class Loop extends Command {
    constructor () {
        super({
            name: 'loop',
            description: 'Loops the current queue',
            name_localizations: {
                'es-ES': 'loop',
                'en-US': 'repetir',
            },
            description_localizations: {
                'es-ES': 'Repite la cola/canción actual',
            },
            cooldown: 5,
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
        if (interaction.member.voice.channelId !== player.voiceChannel.id) {
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
        if (!player.trackRepeat) {
            player.setQueueRepeat(true)
            player.setTrackRepeat(false)
        }
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setFooter({
                        text: translate(keys.loop.song),
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
            ],
        })
    }
}
