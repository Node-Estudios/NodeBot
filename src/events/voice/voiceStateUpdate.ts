import Client from '#structures/Client.js'
import Translator, { keys } from '#utils/Translator.js'
import logger from '#utils/logger.js'
import { VoiceState } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import { BaseEvent } from '../../structures/Events.js'

export default class VoiceStateUpdate extends BaseEvent {
    async run(
        client: Client,
        oldState: VoiceState,
        newState: VoiceState,
    ): Promise<void> {
        const player = client.music.players.get(oldState.guild.id)
        if (!player) return

        const botMember = newState.guild.members.me
        if (!botMember?.voice.channel) {
            // Si el bot no está en un canal de voz, destruimos el reproductor por si acaso.
            await player.destroy()
            return
        }

        const voiceChannel = botMember.voice.channel

        // Si no hay más miembros humanos en el canal, pausar o iniciar temporizador de salida.
        if (
            voiceChannel.members.filter(member => !member.user.bot).size === 0
        ) {
            if (player.stayInVc) {
                if (!player.paused) {
                    player.pause(true)
                    logger.debug(`AutoPausa (24/7) en ${player.guild.name}`)
                }
            } else {
                player.pause(true)
                const translate = Translator(newState.guild)
                const embed = new EmbedBuilder()
                    .setDescription(
                        translate(keys.voice_update.leaving, {
                            channel: voiceChannel.toString(),
                            time: 5, // 300000 ms = 5 minutos
                        }) + ' <:pepesad:967939851863343154>',
                    )
                    .setColor(client.settings.color)

                player.message?.delete().catch(() => {})
                const textChannel = await player.getTextChannel()
                player.waitingMessage = await textChannel?.send({
                    embeds: [embed],
                })

                // Iniciar temporizador para abandonar el canal
                player.leaveTimeout = setTimeout(async () => {
                    const currentVC = newState.guild.members.me?.voice.channel
                    if (
                        currentVC &&
                        currentVC.members.filter(m => !m.user.bot).size === 0
                    ) {
                        await player.destroy()
                        if (player.waitingMessage) {
                            await player.waitingMessage
                                .edit({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setDescription(
                                                translate(
                                                    keys.voice_update.alone,
                                                    {
                                                        channel:
                                                            voiceChannel.toString(),
                                                    },
                                                ) +
                                                    ' <:pepeupset:967939535050772500>',
                                            )
                                            .setColor(client.settings.color),
                                    ],
                                })
                                .catch(() => {})
                        }
                    }
                }, 300000) // 5 minutos
            }
        } else {
            // Si alguien entra, reanudar la música y cancelar el temporizador de salida.
            if (player.paused) {
                player.pause(false)
            }
            if (player.leaveTimeout) {
                clearTimeout(player.leaveTimeout)
                player.leaveTimeout = undefined
                player.waitingMessage?.delete().catch(() => {})
                player.waitingMessage = undefined
            }
        }
    }
}
