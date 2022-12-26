import { MessageEmbed, ButtonInteraction } from 'discord.js'
import logger from '../../../utils/logger.js'
import client from '../../../bot.js'
export default {
    name: 'readMore',
    run: async (interaction: ButtonInteraction<'cached'>) => {
        try {
            let bots = await botsInServer(interaction)
            let onlineBot = await getOnlineBots()

            const embed = new MessageEmbed()
                .setColor(client.settings.color)
                .setDescription(client.language.READMORE[1])
                .setFields(
                    {
                        name: client.language.READMORE[2],
                        value: client.language.READMORE[3],
                    },
                    {
                        name: client.language.READMORE[4],
                        value: client.language.READMORE[5],
                    },
                    {
                        name: client.language.READMORE[6],
                        value:
                            client.language.READMORE[7] +
                            bots[0] +
                            onlineBot[0] +
                            client.language.READMORE[8] +
                            bots[1] +
                            onlineBot[1] +
                            client.language.READMORE[9] +
                            bots[2] +
                            onlineBot[2] +
                            client.language.READMORE[10],
                    },
                )
                .setThumbnail(
                    interaction.member.displayAvatarURL({
                        dynamic: true,
                    }),
                )
                .setTitle(client.language.READMORE[11])
            await interaction.update({
                embeds: [embed],
                components: [],
            })
        } catch (e) {
            logger.error(e)
        }
    },
}

async function botsInServer(interaction: ButtonInteraction<'cached'>) {
    let bot2 = ''
    await interaction.guild.members
        .fetch(process.env.bot2id as string)
        .then(() => {
            bot2 = client.language.READMORE[12]
        })
        .catch(() => null)
    let bot3 = ''
    await interaction.guild.members
        .fetch(process.env.bot3id as string)
        .then(() => {
            bot3 = client.language.READMORE[12]
        })
        .catch(() => null)
    let bot4 = ''
    await interaction.guild.members
        .fetch(process.env.bot4id as string)
        .then(() => {
            bot4 = client.language.READMORE[12]
        })
        .catch(() => null)

    return [bot2, bot3, bot4]
}

async function getOnlineBots() {
    let bot2Emoji = ''
    await fetch(`http://${process.env.IP}:${process.env.bot2Port}`)
        .then(() => {
            bot2Emoji = '<:botOn:894171595365560340>'
        })
        .catch(() => {
            bot2Emoji = '<:botOff:969759818569093172>'
        })

    let bot3Emoji = ''
    await fetch(`http://${process.env.IP}:${process.env.bot3Port}`)
        .then(() => {
            bot3Emoji = '<:botOn:894171595365560340>'
        })
        .catch(() => {
            bot3Emoji = '<:botOff:969759818569093172>'
        })

    let bot4Emoji = ''
    await fetch(`http://${process.env.IP}:${process.env.bot4Port}`)
        .then(() => {
            bot4Emoji = '<:botOn:894171595365560340>'
        })
        .catch(() => {
            bot4Emoji = '<:botOff:969759818569093172>'
        })

    return [bot2Emoji, bot3Emoji, bot4Emoji]
}
