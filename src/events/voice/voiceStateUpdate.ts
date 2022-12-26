import { ColorResolvable, MessageEmbed, TextChannel } from 'discord.js'
import client from '../../bot.js'

export default async function (oldState, newState) {
    //TODO? add type
    if (!(client as any).manager) return
    const player = (client as any).manager.players.get(oldState.guild.id)

    if (!player || player.stayInVoice) return
    if (!newState.guild.me.voice.channel || !oldState.guild.me.voice.channel) return player.destroy(true)
    if (newState.guild.me.voice.channel.members.filter(member => !member.user.bot).size >= 1) {
        if (!player.waitingMessage && player.stayInVc) player.pause(false)
        if (player.waitingMessage) {
            player.waitingMessage.delete()
            player.waitingMessage = null
            player.pause(false)
        }
        return
    }
    if (player.waitingMessage) return
    if (player.stayInVc) return player.pause(true)

    const msg = await (client.channels.cache.get(player.textChannel) as TextChannel).send({
        embeds: [
            new MessageEmbed()
                .setDescription(
                    `${client.language.VOICESTATEUPDATE[1]}${oldState.guild.me.voice.channel.id}${
                        client.language.VOICESTATEUPDATE[2]
                    }${300000 / 60 / 1000}${client.language.VOICESTATEUPDATE[3]}`,
                )
                .setColor(process.env.bot1Embed_Color as ColorResolvable),
        ],
    })
    player.waitingMessage = msg
    player.previouslyPaused = player.paused
    player.pause(true)

    await new Promise(res => setTimeout(res, 300000))

    if (!player.waitingMessage || !newState.guild.me.voice.channel) return
    const voiceMembers = newState.guild.me.voice.channel.members.filter(member => !member.user.bot).size
    if (voiceMembers.length) return msg.delete()
    const newPlayer = await (client as any).manager.newPlayer(
        oldState.guild,
        oldState.guild.me.voice.channel,
        player.textChannel,
    )
    await newPlayer.connect()
    newPlayer.destroy(false)

    return msg.edit({
        embeds: [
            new MessageEmbed()
                .setDescription(
                    `${client.language.VOICESTATEUPDATE[4]}${oldState.guild.me.voice.channel.id}${client.language.VOICESTATEUPDATE[5]}`,
                )
                .setColor(process.env.bot1Embed_Color as ColorResolvable),
        ],
        content: null,
    })
}
