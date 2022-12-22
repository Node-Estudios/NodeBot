const fetch = require("node-fetch");
require("dotenv").config();
const bot2missing = require("./bot2missing");
const bot3missing = require("./bot3missing");
const bot4missing = require("./bot4missing");
module.exports = async function bot1missing(client, interaction, data, reqEndpoint) {
    let bot2Availability;
    let addToQueue2;
    await interaction.guild.members
        .fetch(process.env.bot2id)
        .then((member) => {
            member.voice.channel ?
                (bot2Availability = false) :
                (bot2Availability = true);
            if (member.voice.channel && member.voice.channel != interaction.member.voice.channel) bot2Availability = false;
            if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) addToQueue2 = true;
        })
        .catch((e) => {
            bot2Availability = false;
        });

    if (bot2Availability || addToQueue2) {
        fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/${reqEndpoint}`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then((response) => response.json())
            .then((embed) => {
                interaction.editReply({
                    embeds: [embed]
                })
            })
            .catch(() => {
                bot2missing(client, interaction, data, reqEndpoint)
            })
    } else {
        bot2missing(client, interaction, data, reqEndpoint)
    }
}