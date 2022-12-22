require("dotenv").config();
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require('discord.js');
const Logger = require('../../../utils/console');
require('dotenv').config()
module.exports = {
    name: "readMore",
    /**,
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction) => {
        try {

            let bots = await botsInServer(client, interaction)
            let onlineBot = await getOnlineBots()

            const embed = new MessageEmbed()
                .setColor(process.env.bot1Embed_Color)
                .setDescription(client.language.READMORE[1])
                .addField(
                    client.language.READMORE[2],
                    client.language.READMORE[3]
                )
                .addField(client.language.READMORE[4], client.language.READMORE[5])
                .addField(
                    client.language.READMORE[6],
                    client.language.READMORE[7] + bots[0] + onlineBot[0] + client.language.READMORE[8] + bots[1] + onlineBot[1] + client.language.READMORE[9] + bots[2] + onlineBot[2] + client.language.READMORE[10]
                )
                .setThumbnail(interaction.member.displayAvatarURL({
                    dynamic: true
                }))
                .setTitle(client.language.READMORE[11]);
            await interaction.update({
                embeds: [embed],
                components: []
            })

        } catch (e) {
            Logger.error(e);
        }
    },
};

async function botsInServer(client, interaction) {
    let bot2 = ''
    await interaction.guild.members.fetch(process.env.bot2id)
        .then(() => {
            bot2 = client.language.READMORE[12]
        })
        .catch(() => {})
    let bot3 = ''
    await interaction.guild.members.fetch(process.env.bot3id)
        .then(() => {
            bot3 = client.language.READMORE[12]
        })
        .catch(() => {})
    let bot4 = ''
    await interaction.guild.members.fetch(process.env.bot4id)
        .then(() => {
            bot4 = client.language.READMORE[12]
        })
        .catch(() => {})

    return [bot2, bot3, bot4]
}

async function getOnlineBots() {
    const axios = require('axios')

    let bot2Emoji = ''
    await axios.get(`http://${process.env.IP}:${process.env.bot2Port}`).then(res => {
        bot2Emoji = "<:botOn:894171595365560340>"
    }).catch(err => {
        bot2Emoji = "<:botOff:969759818569093172>"
    })

    let bot3Emoji = ''
    await axios.get(`http://${process.env.IP}:${process.env.bot3Port}`).then(res => {
        bot3Emoji = "<:botOn:894171595365560340>"
    }).catch(err => {
        bot3Emoji = "<:botOff:969759818569093172>"
    })

    let bot4Emoji = ''
    await axios.get(`http://${process.env.IP}:${process.env.bot4Port}`).then(res => {
        bot4Emoji = "<:botOn:894171595365560340>"
    }).catch(err => {
        bot4Emoji = "<:botOff:969759818569093172>"
    })

    return [bot2Emoji, bot3Emoji, bot4Emoji]
}