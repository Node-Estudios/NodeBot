import { ChatInputCommandInteraction } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import Translator, { keys } from '#utils/Translator.js'
import formatTime from '#utils/formatTime.js'
import Command from '#structures/Command.js'
import Client from '#structures/Client.js'
import logger from '#utils/logger.js'

export default class Queue extends Command {
    constructor () {
        super({
            name: 'queue',
            description: 'Show the queue!',
            cooldown: 5,
            dm_permission: false,
        })
    }

    override async run (interaction: ChatInputCommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
        const player = client.music.players.get(interaction.guild.id)
        if (!player)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.settings.color)
                        .setFooter({
                            text: translate(keys.queue.no_queue),
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
                ephemeral: true,
            }).catch(logger.error)

        if (!player.queue.current)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.settings.color)
                        .setFooter({
                            text: translate(keys.queue.no_queue),
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
                ephemeral: true,
            })

        const { title } = player.queue.current
        const { queue } = player

        player.queue.retrieve(1)

        if (!player.queue[0] && player.queue.current)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(translate(keys.queue.no_queue))
                        .setDescription(
                            `🎧 ${translate(keys.queue.current)}\n[${title}](https://www.music.youtube.com/watch?v=${
                                player.queue.current.id
                            }) [<@${player.queue.current.requester.id}> - ${formatTime(
                                Math.trunc(player.queue.current.duration ?? 0),
                                false,
                            )} - ${player.queue.current.streams?.[0].bitrate.toString().slice(0, 3)}Kbps]`,
                        )
                        .setAuthor({
                            name: translate(keys.queue.queue, {
                                name: player.queue.current?.author ?? 'Unknown',
                            }),
                            iconURL: 'https://i.imgur.com/CCqeomm.gif',
                        })
                        .setColor(client.settings.color),
                ],
            })
                .catch(logger.error)

        const x = 10
        let i = -1
        let j = 0

        const queuelist = player.queue
            .slice(x - 10, x)
            .map(
                () =>
                    `**${++j}.** [${queue[++i].title}](https://www.music.youtube.com/watch?v=${queue[i].id}) [<@${
                        queue[i].requester.id
                    }> - ${formatTime(Math.trunc(queue[i].duration ?? 0), false)} - ${queue[i].streams?.[0].bitrate
                        .toString()
                        .slice(0, 3)}Kbps]`,
            )
            .join('\n')

        if (!queuelist)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.settings.color)
                        .setFooter({
                            text: translate(keys.queue.no_page),
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
            })
                .catch(logger.error)

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `🎧 ${translate(keys.queue.current)}\n [${title}](https://www.music.youtube.com/watch?v=${
                            player.queue.current.id
                        }) [<@${player.queue.current.requester.id}> - ${formatTime(
                            Math.trunc(player.queue.current.duration ?? 0),
                            false,
                        )} - ${player.queue.current.streams?.[0].bitrate.toString().slice(0, 3)}Kbps]\n__${
                            translate(keys.NEXT)
                        }__:\n${queuelist}`,
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setAuthor({
                        name: `${translate(keys.queue.queue, {
                            name: interaction.user.username,
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
            .catch(logger.error)
    }
}
