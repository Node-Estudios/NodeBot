import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
import { messageHelper } from '../../../handlers/messageHandler.js'
import Client from '../../../structures/Client.js'

import { EmbedBuilder, GuildMember } from 'discord.js'
import Command from '../../../structures/Command.js'
import logger from '../../../utils/logger.js'

export default class skip extends Command {
    constructor() {
        super({
            name: 'skip',
            description: 'Skips the current song!',
            description_localizations: {
                'es-ES': '¡Salta la canción actual!',
            },
            cooldown: 5,
            // permissions: {
            //     userPermissions: ['ManageMessages'],
            // },
            // options: [
            //     {
            //         type: 4,
            //         name: 'amount',
            //         name_localizations: {
            //             'es-ES': 'cantidad',
            //         },
            //         description: 'Amount of songs to skip.',
            //         description_localizations: {
            //             'es-ES': 'Cantidad de canciones para saltar.',
            //         },
            //         required: false,
            //     }
            // ]
        })
    }
    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        const client = interaction.client as Client
        if (!interaction.inGuild()) return
        const message = new messageHelper(interaction)
        const player = client.music.players.get(interaction.guild!.id)
        if (!player)
            return message.sendMessage(
                {
                    embeds: [
                        new EmbedBuilder().setColor(15548997).setFooter({
                            text: interaction.language.QUEUE[1],
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                },
                false,
            )
        interaction.member = interaction.member as GuildMember
        const errorEmbed = new EmbedBuilder()
            .setColor(15548997)
            .setFooter({ text: interaction.language.QUEUE[10], iconURL: interaction.user.displayAvatarURL() })
        if (!interaction.member.voice)
            return message.sendMessage({ embeds: [errorEmbed] }, false).catch((e: any) => {
                logger.debug(e)
            })
        let vc = player?.voiceChannel
        if (interaction.member?.voice.channelId != vc?.id) {
            const errorembed = new EmbedBuilder().setColor(client.settings.color).setFooter({
                text: interaction.language.QUEUE[10],
                iconURL: interaction.user.displayAvatarURL(),
            })
            return message.sendMessage({ embeds: [errorembed] }, false).catch((e: any) => {
                logger.debug(e)
            })
        }

        // const player = client.music.players.get(interaction.guild!.id)
        if (!player?.queue.current) return

        if (player.trackRepeat) player.setTrackRepeat(false)
        if (player.queueRepeat) player.setQueueRepeat(false)

        // if(!interaction.options.get('amount')) {
        // const embed = new EmbedBuilder()
        //     .setColor(client.settings.color)
        //     .setTitle(interaction.language.SUCCESSEMBED)
        //     .setDescription(`${player.queue.current} ${interaction.language.SKIP[0]}`)
        //     .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        // message.sendMessage({ embeds: [embed] }, false)
        // return player.skip()
        // } else {

        // }
        const embed = new EmbedBuilder()
            .setColor(client.settings.color)
            .setTitle(interaction.language.SUCCESSEMBED)
            .setDescription(`${player.queue.current.title} ${interaction.language.SKIP[4]}`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        message.sendMessage({ embeds: [embed] }, false).catch((e: any) => {
            logger.debug(e)
        })
        // const { title } = player.queue.current;
        // logger.debug(player)
        return player.skip()
    }
}
