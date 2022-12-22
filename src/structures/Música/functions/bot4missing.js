require("dotenv").config();
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
} = require('discord.js');
module.exports = async function bot4missing(client, interaction, data, reqEndpoint) {
    const embed = new MessageEmbed()
        .setColor(process.env.bot1Embed_Color)

    const desc = client.language.NOMUSICBOTS
    const row = new MessageActionRow().addComponents(
        new MessageButton()
        .setStyle("PRIMARY")
        .setLabel(`Leer más`)
        .setCustomId("readMore"),
    );

    new Promise((resolve, reject) => {
        interaction.guild.members.fetch(process.env.bot2id)
            .then(() => {
                interaction.guild.members.fetch(process.env.bot3id)
                    .then(() => {
                        interaction.guild.members.fetch(process.env.bot4id)
                            .then(() => {
                                embed.setDescription(desc)
                                resolve(embed)
                            })
                            .catch(() => {
                                embed.setDescription(desc + '[Node4 <:logonodeazul:968094477866659850>](https://discord.com/api/oauth2/authorize?client_id=853888393917497384&permissions=137475966272&scope=bot)')
                                resolve(embed)
                            })
                    }).catch(() => {
                        interaction.guild.members.fetch(process.env.bot4id)
                            .then(() => {
                                embed.setDescription(desc + '[Node3 <:logonodenaranja:968094477019402292>](https://discord.com/api/oauth2/authorize?client_id=963954741837201540&permissions=137475966272&scope=bot)')
                                resolve(embed)
                            })
                            .catch(() => {
                                embed.setDescription(desc + '[Node3 <:logonodenaranja:968094477019402292>](https://discord.com/api/oauth2/authorize?client_id=963954741837201540&permissions=137475966272&scope=bot)\n\n[Node4 <:logonodeazul:968094477866659850>](https://discord.com/api/oauth2/authorize?client_id=853888393917497384&permissions=137475966272&scope=bot)')
                                resolve(embed)
                            })
                    })
            })
            .catch(() => {
                interaction.guild.members.fetch(process.env.bot3id)
                    .then(() => {
                        interaction.guild.members.fetch(process.env.bot4id)
                            .then(() => {
                                embed.setDescription(desc + '[Node2 <:logonodemorado:968094477480771584>](https://discord.com/api/oauth2/authorize?client_id=963496530818506802&permissions=137475966272&scope=bot)')
                                resolve(embed)
                            })
                            .catch(() => {
                                embed.setDescription(desc + '[Node2 <:logonodemorado:968094477480771584>](https://discord.com/api/oauth2/authorize?client_id=963496530818506802&permissions=137475966272&scope=bot)\n\n[Node4 <:logonodeazul:968094477866659850>](https://discord.com/api/oauth2/authorize?client_id=853888393917497384&permissions=137475966272&scope=bot)')
                                resolve(embed)
                            })
                    })
                    .catch(() => {
                        interaction.guild.members.fetch(process.env.bot4id)
                            .then(() => {
                                embed.setDescription(desc + '[Node2 <:logonodemorado:968094477480771584>](https://discord.com/api/oauth2/authorize?client_id=963496530818506802&permissions=137475966272&scope=bot)\n\n[Node3 <:logonodenaranja:968094477019402292>](https://discord.com/api/oauth2/authorize?client_id=963954741837201540&permissions=137475966272&scope=bot)')
                                resolve(embed)
                            })
                            .catch(() => {
                                embed.setDescription(desc + '[Node2 <:logonodemorado:968094477480771584>](https://discord.com/api/oauth2/authorize?client_id=963496530818506802&permissions=137475966272&scope=bot)\n\n[Node3 <:logonodenaranja:968094477019402292>](https://discord.com/api/oauth2/authorize?client_id=963954741837201540&permissions=137475966272&scope=bot)\n\n[Node4 <:logonodeazul:968094477866659850>](https://discord.com/api/oauth2/authorize?client_id=853888393917497384&permissions=137475966272&scope=bot)')
                                resolve(embed)
                            })
                    })
            })
    }).then(resEmbed => {
        interaction.editReply({
            embeds: [resEmbed],
            components: [row]
        })
    })
}