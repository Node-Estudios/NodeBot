// import { ColorResolvable, MessageEmbed, VoiceState } from 'discord.js'
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
//             new MessageEmbed()
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
//             new MessageEmbed()
//                 .setDescription(
//                     `${interaction.language.VOICESTATEUPDATE[4]}${oldState.guild.me.voice.channel.id}${interaction.language.VOICESTATEUPDATE[5]}`,
//                 )
//                 .setColor(process.env.bot1Embed_Color as ColorResolvable),
//         ],
//         content: null,
//     })
// }

//TODO? use global client?
import cacheLang from '../../cache/idioms.js'
import langFile from '../../lang/index.json' assert { type: 'json' }
import Client from '../../structures/Client.js'

// TODO: Remove (variable: any) in the code
// Interfaz de eventos
import { EmbedBuilder, VoiceChannel, VoiceState } from 'discord.js'
import { BaseEvent } from '../../structures/Events.js'

export default class voiceStateUpdate extends BaseEvent {
    async run(client: Client, oldState: VoiceState, newState: VoiceState): Promise<any> {
        // console.log('voiceStateUpdate executed');
        if (!client.music) return

        const defaultLanguage = langFile.find(l => l.default)!
        const language = await cacheLang.get(defaultLanguage.nombre).default
        const player = client.music.players.get(oldState.guild.id) as any
        // console.log(language)
        if (!player || player.stayInVoice) return

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
        if (player.stayInVc == true) player.pause(true)
        if (player.stayInVc == false || !player.stayInVc) {
            const embed = new EmbedBuilder()
                .setDescription(
                    `${language.VOICESTATEUPDATE[1]}${oldUserVoiceChannel.id}${language.VOICESTATEUPDATE[2]}${
                        300000 / 60 / 1000
                    }${language.VOICESTATEUPDATE[3]}`,
                )
                .setColor(client.settings.color)
            const msg = await player.textChannel.send({
                embeds: [embed],
            })
            player.waitingMessage = msg
            player.previouslyPaused = player.paused
            player.pause(true)

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
                        (player as any).textChannel,
                        oldState.guild,
                        100,
                    )
                    await newPlayer?.connect()
                    newPlayer.destroy()
                }
                if (msg)
                    msg.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    `${language.VOICESTATEUPDATE[4]} ${oldUserVoiceChannel.id} ${language.VOICESTATEUPDATE[5]}`,
                                )
                                .setColor(client.settings.color),
                        ],
                        content: null,
                    })
            }
        }

        return
    }
}
