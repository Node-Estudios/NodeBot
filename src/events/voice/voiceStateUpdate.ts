// import { ColorResolvable, EmbedBuilder, VoiceState } from 'discord.js'
// import Client from '../../structures/Client.js'

// export default async function (oldState: VoiceState, newState: VoiceState) {
//     const client = oldState.client as Client
//     if (!client.music) return
//     const player = client.music.players.get(oldState.guild.id)

//     if (!player || player.stayInVoice) return
//     if (!newState.guild.me?.voice.channel || !oldState.guild.me?.voice.channel) return player.destroy(true)
//     if (newState.guild.me.voice.channel.members.filter(member => !member.user.bot).size >= 1) {
//         if (!player.waitingMessage && player.stayInVc) player.pause(false)
//         if (player.waitingMessage) {
//             player.waitingMessage.delete()
//             player.waitingMessage = null
//             player.pause(false)
//         }
//         return
//     }
//     if (player.waitingMessage) return
//     if (player.stayInVc) return player.pause(true)

//     const msg = await player.textChannel.send({
//         embeds: [
//             new EmbedBuilder()
//                 .setDescription(
//                     `${interaction.language.VOICESTATEUPDATE[1]}${oldState.guild.me.voice.channel.id}${interaction.language.VOICESTATEUPDATE[2]
//                     }${300000 / 60 / 1000}${interaction.language.VOICESTATEUPDATE[3]}`,
//                 )
//                 .setColor(process.env.bot1Embed_Color as ColorResolvable),
//         ],
//     })
//     player.waitingMessage = msg
//     player.previouslyPaused = player.paused
//     player.pause(true)

//     await new Promise(res => setTimeout(res, 300000))

//     if (!player.waitingMessage || !newState.guild.me.voice.channel) return
//     const voiceMembers = newState.guild.me.voice.channel.members.filter(member => !member.user.bot).size
//     if (voiceMembers) return msg.delete()
//     //TODO! Fix this
//     const newPlayer = await client.music.newPlayer(oldState.guild, oldState.guild.me.voice.channel, player.textChannel)
//     await newPlayer.connect()
//     newPlayer.destroy(false)

//     return msg.edit({
//         embeds: [
//             new EmbedBuilder()
//                 .setDescription(
//                     `${interaction.language.VOICESTATEUPDATE[4]}${oldState.guild.me.voice.channel.id}${interaction.language.VOICESTATEUPDATE[5]}`,
//                 )
//                 .setColor(process.env.bot1Embed_Color as ColorResolvable),
//         ],
//         content: null,
//     })
// }

import langFile from '../../lang/index.json' assert { type: 'json' }
import Client from '../../structures/Client.js'

// TODO: Remove (variable: any) in the code
// Interfaz de eventos
import { EmbedBuilder, VoiceChannel, VoiceState } from 'discord.js'
import { BaseEvent } from '../../structures/Events.js'
import logger from '../../utils/logger.js'
import Translator, { keys } from '../../utils/Translator'

export default class voiceStateUpdate extends BaseEvent {
    async run(client: Client, oldState: VoiceState, newState: VoiceState): Promise<any> {
        if (!client.music) return
        const translate = Translator(newState.guild)
        const player = client.music.players.get(oldState.guild.id)
        if (!player?.stayInVoice) return

        const newUserVoiceChannel = newState.guild.members.cache.get(client.user.id)?.voice.channel
        const oldUserVoiceChannel = oldState.guild.members.cache.get(client.user.id)?.voice.channel

        if (!newUserVoiceChannel || !oldUserVoiceChannel) return player.destroy()

        //Check if there are more than 1 user in the voice channel, if not, pause the music
        if (newUserVoiceChannel.members.filter(member => !member.user.bot).size >= 1) {
            if (!player.waitingMessage && player.stayInVc) return player.pause(false)
            if (player.waitingMessage) {
                player.waitingMessage.delete()
                player.waitingMessage = null
                player.pause(false)
            }
            return
        }
        if (!player || player.waitingMessage) return
        if (player.stayInVc == true) {
            player.pause(true)
            if (client.settings.debug == 'true')
                logger.debug(
                    'AutoPaused (24/7) | ' + player.guild.name + ' | ' + player.queue.current?.requester.displayName,
                )
        }
        if (player.stayInVc == false || !player.stayInVc) {
            const embed = new EmbedBuilder()
                .setDescription(
                    translate(keys.voice_update.leaving, {
                        channel: oldUserVoiceChannel.toString(),
                        time: 300000 / 60 / 1000,
                    }) + ' <:pepesad:967939851863343154>',
                )
                .setColor(client.settings.color)
            const msg = await player.textChannel.send({
                embeds: [embed],
            })
            player.waitingMessage = msg
            player.previouslyPaused = player.paused

            player.pause(true)
            if (client.settings.debug == 'true')
                logger.debug('AutoPaused | ' + player.guild.name + ' | ' + player.queue.current?.requester.displayName)
        }

        //delay 5 minutos
        await new Promise(res => setTimeout(res, 300000))

        if (!player.waitingMessage || !newUserVoiceChannel) {
            return
        }
        const voiceMembers = newUserVoiceChannel.members.filter(member => !member.user.bot).size
        if (!voiceMembers || voiceMembers < 1) {
            let newPlayer = client.music.players.get(newState.guild.id)
            if (player) {
                newPlayer?.destroy()
            } else {
                newPlayer = await client.music.createNewPlayer(
                    oldState.guild.members.cache.get(client.user.id)?.voice.channel! as VoiceChannel,
                    (player as any).textChannel, // TODO: player don't exist in this scope
                    oldState.guild,
                    100,
                )
                await newPlayer?.connect()
                newPlayer.destroy()
            }
            if (player.waitingMessage)
                player.waitingMessage.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                translate(keys.voice_update.alone, {
                                    channel: oldUserVoiceChannel.toString(),
                                }) + ' <:pepeupset:967939535050772500>',
                            )
                            .setColor(client.settings.color),
                    ],
                })
        }
    }
}
