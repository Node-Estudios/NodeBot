import { MessageEmbed, ButtonInteraction, ColorResolvable } from 'discord.js'
import Logger from '../../../utils/logger.js'
export default {
    name: 'readMore',
    /**,
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client: any, interaction: ButtonInteraction<'cached'>) => {
        try {
            let bots = await botsInServer(client, interaction)
            let onlineBot = await getOnlineBots()

            const embed = new MessageEmbed()
                .setColor(process.env.bot1Embed_Color as ColorResolvable)
                .setDescription(client.language.READMORE[1])
                .addField(client.language.READMORE[2], client.language.READMORE[3])
                .addField(client.language.READMORE[4], client.language.READMORE[5])
                .addField(
                    client.language.READMORE[6],
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
            Logger.error(e)
        }
    },
}

async function botsInServer(client: any, interaction: ButtonInteraction<'cached'>) {
    let bot2 = ''
    await interaction.guild.members
        .fetch(process.env.bot2id as string)
        .then(() => {
            bot2 = client.language.READMORE[12]
        })
        .catch(() => {})
    let bot3 = ''
    await interaction.guild.members
        .fetch(process.env.bot3id as string)
        .then(() => {
            bot3 = client.language.READMORE[12]
        })
        .catch(() => {})
    let bot4 = ''
    await interaction.guild.members
        .fetch(process.env.bot4id as string)
        .then(() => {
            bot4 = client.language.READMORE[12]
        })
        .catch(() => {})

    return [bot2, bot3, bot4]
}

async function getOnlineBots() {
    const axios = require('axios')

    let bot2Emoji = ''
    await axios
        .get(`http://${process.env.IP}:${process.env.bot2Port}`)
        .then(() => {
            bot2Emoji = '<:botOn:894171595365560340>'
        })
        .catch(() => {
            bot2Emoji = '<:botOff:969759818569093172>'
        })

    let bot3Emoji = ''
    await axios
        .get(`http://${process.env.IP}:${process.env.bot3Port}`)
        .then(() => {
            bot3Emoji = '<:botOn:894171595365560340>'
        })
        .catch(() => {
            bot3Emoji = '<:botOff:969759818569093172>'
        })

    let bot4Emoji = ''
    await axios
        .get(`http://${process.env.IP}:${process.env.bot4Port}`)
        .then(() => {
            bot4Emoji = '<:botOn:894171595365560340>'
        })
        .catch(() => {
            bot4Emoji = '<:botOff:969759818569093172>'
        })

    return [bot2Emoji, bot3Emoji, bot4Emoji]
}
