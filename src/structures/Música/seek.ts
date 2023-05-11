import { Client, CommandInteraction, EmbedBuilder } from 'discord.js'

import simplestDiscordWebhook from 'simplest-discord-webhook'
import Command from '../../structures/command'
import getRandomPhrase from '../../utils/getRandomPhrase'
import getUsedBot from '../../utils/getUsedBot'
let webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL)
module.exports = class seek extends Command {
    constructor(client) {
        super(client, {
            name: 'seek',
            description: 'Seek the current song a number of seconds.',
            name_localizations: {
                'es-ES': 'seek',
            },
            description_localizations: {
                'es-ES': 'Salta tiempo en la canción actual.',
            },
            cooldown: 5,
            options: [
                {
                    type: 10,
                    name: 'seconds',
                    description: 'Seconds you skip the song',
                    name_localizations: {
                        'es-ES': 'segundos',
                    },
                    description_localizations: {
                        'es-ES': 'Segundos que saltas la canción',
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
        let usedBotID = await getUsedBot(interaction)

        if (!usedBotID) {
            const errorembed = new EmbedBuilder().setColor(15548997).setFooter(
                interaction.language.SKP[1],
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
        data.push(args)
        data.push(interaction.member.user.username)
        data.push(interaction.member.user.discriminator)
        data.push(
            interaction.member.displayAvatarURL({
                dynamic: true,
            }),
        )
        data.push(interaction.guild.shardId)

        switch (usedBotID) {
            case process.env.bot1id:
                fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/seek`, {
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
                        })
                    })
                    .catch(() => {
                        const errorembed = new EmbedBuilder().setColor(15548997).setFooter(
                            getRandomPhrase(interaction.language.INTERNALERROR),
                            interaction.member.displayAvatarURL({
                                dynamic: true,
                            }),
                        )
                        const errorembed2 = new EmbedBuilder().setColor(15548997).setFooter(
                            'Error en el comando seek (1)',
                            client.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        )
                        webhookClient.send(errorembed2)
                        interaction.editReply({
                            embeds: [errorembed],
                        })
                    })
                break
            case process.env.bot2id:
                fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/seek`, {
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
                        })
                    })
                    .catch(() => {
                        const errorembed = new EmbedBuilder().setColor(15548997).setFooter(
                            getRandomPhrase(interaction.language.INTERNALERROR),
                            interaction.member.displayAvatarURL({
                                dynamic: true,
                            }),
                        )
                        const errorembed2 = new EmbedBuilder().setColor(15548997).setFooter(
                            'Error en el comando seek (2)',
                            client.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        )
                        webhookClient.send(errorembed2)
                        interaction.editReply({
                            embeds: [errorembed],
                        })
                    })
                break
            case process.env.bot3id:
                fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/seek`, {
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
                        })
                    })
                    .catch(() => {
                        const errorembed = new EmbedBuilder().setColor(15548997).setFooter(
                            getRandomPhrase(interaction.language.INTERNALERROR),
                            interaction.member.displayAvatarURL({
                                dynamic: true,
                            }),
                        )
                        const errorembed2 = new EmbedBuilder().setColor(15548997).setFooter(
                            'Error en el comando seek (3)',
                            client.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        )
                        webhookClient.send(errorembed2)
                        interaction.editReply({
                            embeds: [errorembed],
                        })
                    })
                break
            case process.env.bot4id:
                fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/seek`, {
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
                        })
                    })
                    .catch(() => {
                        const errorembed = new EmbedBuilder().setColor(15548997).setFooter(
                            getRandomPhrase(interaction.language.INTERNALERROR),
                            interaction.member.displayAvatarURL({
                                dynamic: true,
                            }),
                        )
                        const errorembed2 = new EmbedBuilder().setColor(15548997).setFooter(
                            'Error en el comando seek (4)',
                            client.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        )
                        webhookClient.send(errorembed2)
                        interaction.editReply({
                            embeds: [errorembed],
                        })
                    })
                break
        }
    }
}
