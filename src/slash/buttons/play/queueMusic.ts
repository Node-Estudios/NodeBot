import Translator, { keys } from '../../../utils/Translator.js'
import { ButtonInteraction, EmbedBuilder } from 'discord.js'
import formatTime from '../../../utils/formatTime.js'
import Client from '../../../structures/Client.js'
import Button from '../../../structures/Button.js'
import logger from '../../../utils/logger.js'

export default class Queue extends Button {
    constructor () {
        super('queueMusic')
    }

    override async run (interaction: ButtonInteraction) {
        try {
            if (!interaction.inCachedGuild()) return await interaction.deferUpdate()
            const translate = Translator(interaction)
            const client = interaction.client as Client
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

            const { title } = player.queue.current
            const { queue } = player

            player.queue.retrieve(1)

            if (!player.queue[0] && player.queue.current) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(translate(keys.queue.no_queue))
                            .setDescription(
                                `🎧 ${translate(keys.queue.current)}\n[${title}](https://www.music.youtube.com/watch?v=${
                                    player.queue.current.id
                                }) [<@${player.queue.current.requester.id}> - ${formatTime(
                                    Math.trunc(player.queue.current.duration),
                                    false,
                                )} - ${player.queue.current.streams?.[0].bitrate.toString().slice(0, 3)}Kbps]`,
                            )
                            .setAuthor({
                                name: `${translate(keys.queue.queue, {
                                    name: interaction.user.username ?? 'Unknown',
                                })}`,
                                iconURL: 'https://i.imgur.com/CCqeomm.gif',
                            })
                            .setColor(client.settings.color),
                    ],
                })
            }

            const x = 10
            let i = -1
            let j = 0

            const queuelist = player.queue
                .slice(x - 10, x)
                .map(
                    () =>
                        `**${++j}.** [${queue[++i].title}](https://www.music.youtube.com/watch?v=${queue[i].id}) [<@${
                            queue[i].requester.id
                        }> - ${formatTime(Math.trunc(queue[i].duration), false)} - ${queue[i].streams?.[0].bitrate
                            .toString()
                            .slice(0, 3)}Kbps]`,
                )
                .join('\n')

            if (!queuelist) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor(client.settings.color).setFooter({
                            text: translate(keys.queue.no_page),
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                })
            }

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `🎧 ${translate(keys.queue.current)}\n [${title}](https://www.music.youtube.com/watch?v=${
                                player.queue.current.id
                            }) [<@${player.queue.current.requester.id}> - ${formatTime(
                                Math.trunc(player.queue.current.duration),
                                false,
                            )} - ${player.queue.current.streams?.[0].bitrate.toString().slice(0, 3)}Kbps]\n__${
                                translate(keys.NEXT)
                            }__:\n${queuelist}`,
                        )
                        .setThumbnail(client.user.displayAvatarURL())
                        .setAuthor({
                            name: `${translate(keys.queue.queue, {
                                name: interaction.user.username ?? 'Unknown',
                            })} (${Math.floor(x / 10)} / ${Math.floor((player.queue.slice(1).length + 10) / 10)})`,
                            iconURL: 'https://i.imgur.com/CCqeomm.gif',
                        })
                        .setFooter({
                            text: `${translate(keys.queue.total)} ${player.queue.length}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        })
                        .setColor(client.settings.color),
                ],
            })
        } catch (e) {
            return logger.error(e)
        }
    }
}
