const fetch = require("node-fetch");
const bot4missing = require("./bot4missing");
require("dotenv").config();
module.exports = async function bot3missing(client, interaction, data, reqEndpoint) {
    let bot4Availability;
    let addToQueue4;
    await interaction.guild.members
        .fetch(process.env.bot4id)
        .then((member) => {
            member.voice.channel ?
                (bot4Availability = false) :
                (bot4Availability = true);
            if (
                member.voice.channel &&
                member.voice.channel != interaction.member.voice.channel
            )
                bot4Availability = false;
            if (member.voice.channel && member.voice.channel == interaction.member.voice.channel)
                addToQueue4 = true;
        })
        .catch((e) => {
            bot4Availability = false;
        });

    if (bot4Availability || addToQueue4) {
        fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/${reqEndpoint}`, {
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
            }).catch(() => {
                bot4missing(client, interaction, data, reqEndpoint)
            })
    } else {
        bot4missing(client, interaction, data, reqEndpoint)
    }
}