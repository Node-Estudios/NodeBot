import { AttachmentBuilder, GuildMember, TextChannel } from 'discord.js'
import { Canvas, loadImage } from 'canvas'

export default async function (member: GuildMember) {
    const canvas = new Canvas(1772, 633)
    const ctx = canvas.getContext('2d')
    const background = await loadImage('./files/welcome.png')
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#f2f2f2'
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    const textString3 = `${member.user.username}`
    if (textString3.length >= 14) {
        ctx.font = 'bold 100px Genta'
        ctx.fillStyle = '#f2f2f2'
        ctx.fillText(textString3, 720, canvas.height / 2 + 20)
    } else {
        ctx.font = 'bold 150px Genta'
        ctx.fillStyle = '#f2f2f2'
        ctx.fillText(textString3, 720, canvas.height / 2 + 20)
    }
    const textString2 = `#${member.user.discriminator}`
    ctx.font = 'bold 40px Genta'
    ctx.fillStyle = '#f2f2f2'
    ctx.fillText(textString2, 730, canvas.height / 2 + 58)
    // define the Member count
    const textString4 = `Member #${member.guild.memberCount}`
    ctx.font = 'bold 60px Genta'
    ctx.fillStyle = '#f2f2f2'
    ctx.fillText(textString4, 750, canvas.height / 2 + 125)
    // get the Guild Name
    const textString5 = `${member.guild.name}`
    ctx.font = 'bold 60px Genta'
    ctx.fillStyle = '#f2f2f2'
    ctx.fillText(textString5, 700, canvas.height / 2 - 150)
    ctx.beginPath()
    ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true) // position of img
    ctx.closePath()
    ctx.clip()
    const avatar = await loadImage(
        member.user.displayAvatarURL({
            extension: 'jpg',
        }),
    )
    ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500)
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: 'welcome-image.png',
    })
    // TODO: implement this in a database
    const channel = await member.guild.channels.fetch('964522476396748831') as TextChannel
    channel.send({ files: [attachment], content: 'Welcome to the server!' })
}
