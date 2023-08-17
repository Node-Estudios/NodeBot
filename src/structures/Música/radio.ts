import {  Client, CommandInteraction } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'

import simplestDiscordWebhook from 'simplest-discord-webhook'
import Command from '#structures/Command.js'
import bot1missing from './functions/bot1missing.js'
import bot2missing from './functions/bot2missing.js'
import bot3missing from './functions/bot3missing.js'
import bot4missing from './functions/bot4missing.js'
const webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL)
module.exports = class radio extends Command {
    constructor(client) {
        super(client, {
            name: 'radio',
            description: 'Listen to any radio station in the world.',
            name_localizations: {
                'es-ES': 'radio',
            },
            description_localizations: {
                'es-ES': 'Escucha cualquier estación de radio del mundo.',
            },
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: 'station',
                    description: 'Name of the station.',
                    name_localizations: {
                        'es-ES': 'estación',
                    },
                    description_localizations: {
                        'es-ES': 'Nombre de la estación.',
                    },
                    required: true,
                },
            ],
        })
    }
    /**,
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async run(client, interaction, args) {
        if (!interaction.member.voice.channel) {
            const errorembed = new EmbedBuilder().setColor(15548997).setFooter(
                interaction.language.PLAY[1],
                interaction.member.displayAvatarURL({
                    dynamic: true,
                }),
            )
            return interaction.editReply({
                embeds: [errorembed],
                ephemeral: true,
            })
        }

        const data: any[] = []

        data.push(interaction.member.voice)
        data.push(interaction.guild.id)
        data.push(interaction.channel.id)
        data.push(interaction.member.user.username)
        data.push(interaction.member.user.discriminator)
        data.push(
            interaction.member.displayAvatarURL({
                dynamic: true,
            }),
        )
        data.push(interaction.member.voice.channelId)
        data.push(args)
        data.push(interaction.member)
        data.push(interaction.guild.shardId)

        let bot1Availability = false
        let addToQueue = false
        await interaction.guild.members
            .fetch(process.env.bot1id)
            .then(member => {
                if (member.voice.channel) {
                    member.voice.channel.members.forEach(listener => {
                        switch (listener.user.id) {
                            case process.env.bot2id:
                                fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/radio`, {
                                    method: 'POST',
                                    body: JSON.stringify(data),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: process.env.jwt as string,
                                    },
                                })
                                    .then(response => response.json())
                                    .then(embed => {
                                        interaction.editReply({
                                            embeds: [embed],
                                            ephemeral: false,
                                        })
                                    })
                                    .catch(() => {
                                        const errorembed = new EmbedBuilder().setColor(15548997).setFooter(
                                            'El bot2 ha dado error en la radio',
                                            client.user.displayAvatarURL({
                                                dynamic: true,
                                            }),
                                        )
                                        webhookClient.send(errorembed)
                                        bot2missing(client, interaction, data, 'radio')
                                    })
                                break

                            case process.env.bot3id:
                                fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/radio`, {
                                    method: 'POST',
                                    body: JSON.stringify(data),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: process.env.jwt as string,
                                    },
                                })
                                    .then(response => response.json())
                                    .then(embed => {
                                        interaction.editReply({
                                            embeds: [embed],
                                            ephemeral: false,
                                        })
                                    })
                                    .catch(() => {
                                        const errorembed = new EmbedBuilder().setColor(15548997).setFooter(
                                            'El bot3 ha dado error en la radio',
                                            client.user.displayAvatarURL({
                                                dynamic: true,
                                            }),
                                        )
                                        webhookClient.send(errorembed)
                                        bot3missing(client, interaction, data, 'radio')
                                    })
                                break
                            case process.env.bot4id:
                                fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/radio`, {
                                    method: 'POST',
                                    body: JSON.stringify(data),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: process.env.jwt as string,
                                    },
                                })
                                    .then(response => response.json())
                                    .then(embed => {
                                        interaction.editReply({
                                            embeds: [embed],
                                            ephemeral: false,
                                        })
                                    })
                                    .catch(() => {
                                        const errorembed = new EmbedBuilder().setColor(15548997).setFooter(
                                            'El bot4 ha dado error en la radio',
                                            client.user.displayAvatarURL({
                                                dynamic: true,
                                            }),
                                        )
                                        webhookClient.send(errorembed)
                                        bot4missing(client, interaction, data, 'radio')
                                    })
                                break
                        }
                    })
                    if (member.voice.channel && member.voice.channel == interaction.member.voice.channel)
                        addToQueue = true
                } else {
                    bot1Availability = true
                }
            })
            .catch(e => {
                const errorembed2 = new EmbedBuilder().setColor(15548997).setFooter(
                    'Error en el comando radio (1)',
                    client.user.displayAvatarURL({
                        dynamic: true,
                    }),
                )
                webhookClient.send(errorembed2)
                console.log(e)
            })
        if (bot1Availability || addToQueue) {
            fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/radio`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: process.env.jwt as string,
                },
            })
                .then(response => response.json())
                .then(embed => {
                    interaction.editReply({
                        embeds: [embed],
                        ephemeral: false,
                    })
                })
                .catch(e => {
                    console.log(e)
                    const errorembed2 = new EmbedBuilder().setColor(15548997).setFooter(
                        'Error en el comando radio (2)',
                        client.user.displayAvatarURL({
                            dynamic: true,
                        }),
                    )
                    webhookClient.send(errorembed2)
                    bot1missing(client, interaction, data, 'radio')
                })
        } else {
            let bot2Availability
            let addToQueue2
            await interaction.guild.members
                .fetch(process.env.bot2id)
                .then(member => {
                    member.voice.channel ? (bot2Availability = false) : (bot2Availability = true)
                    if (member.voice.channel && member.voice.channel != interaction.member.voice.channel)
                        bot2Availability = false
                    if (member.voice.channel && member.voice.channel == interaction.member.voice.channel)
                        addToQueue2 = true
                })
                .catch(e => {
                    bot2Availability = false
                })
            if (bot2Availability || addToQueue2) {
                fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/radio`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: process.env.jwt as string,
                    },
                })
                    .then(response => response.json())
                    .then(embed => {
                        interaction.editReply({
                            embeds: [embed],
                            ephemeral: false,
                        })
                    })
                    .catch(() => {
                        const errorembed2 = new EmbedBuilder().setColor(15548997).setFooter(
                            'Error en el comando radio (3)',
                            client.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        )
                        webhookClient.send(errorembed2)
                        bot2missing(client, interaction, data, 'radio')
                    })
            } else {
                let bot3Availability
                let addToQueue3
                await interaction.guild.members
                    .fetch(process.env.bot3id)
                    .then(member => {
                        member.voice.channel ? (bot3Availability = false) : (bot3Availability = true)
                        if (member.voice.channel && member.voice.channel != interaction.member.voice.channel)
                            bot3Availability = false
                        if (member.voice.channel && member.voice.channel == interaction.member.voice.channel)
                            addToQueue3 = true
                    })
                    .catch(e => {
                        bot3Availability = false
                    })

                if (bot3Availability || addToQueue3) {
                    fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/radio`, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: process.env.jwt as string,
                        },
                    })
                        .then(response => response.json())
                        .then(embed => {
                            interaction.editReply({
                                embeds: [embed],
                                ephemeral: false,
                            })
                        })
                        .catch(() => {
                            const errorembed2 = new EmbedBuilder().setColor(15548997).setFooter(
                                'Error en el comando radio (4)',
                                client.user.displayAvatarURL({
                                    dynamic: true,
                                }),
                            )
                            webhookClient.send(errorembed2)
                            bot3missing(client, interaction, data, 'radio')
                        })
                } else {
                    let bot4Availability
                    let addToQueue4
                    await interaction.guild.members
                        .fetch(process.env.bot4id)
                        .then(member => {
                            member.voice.channel ? (bot4Availability = false) : (bot4Availability = true)
                            if (member.voice.channel && member.voice.channel != interaction.member.voice.channel)
                                bot4Availability = false
                            if (member.voice.channel && member.voice.channel == interaction.member.voice.channel)
                                addToQueue4 = true
                        })
                        .catch(e => {
                            bot4Availability = false
                        })

                    if (bot4Availability || addToQueue4) {
                        fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/radio`, {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then(response => response.json())
                            .then(embed => {
                                interaction.editReply({
                                    embeds: [embed],
                                    ephemeral: false,
                                })
                            })
                            .catch(() => {
                                const errorembed2 = new EmbedBuilder().setColor(15548997).setFooter(
                                    'Error en el comando radio (5)',
                                    client.user.displayAvatarURL({
                                        dynamic: true,
                                    }),
                                )
                                webhookClient.send(errorembed2)
                                bot4missing(client, interaction, data, 'radio')
                            })
                    } else {
                        bot4missing(client, interaction, data, 'radio')
                    }
                }
            }
        }
    }
}
