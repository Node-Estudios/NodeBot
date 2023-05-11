import { EmbedBuilder } from 'discord.js'
import simplestDiscordWebhook from 'simplest-discord-webhook'
import Command from '../../structures/Command.js'
import getRandomPhrase from '../../utils/getRandomPhrase'
import getUsedBot from '../../utils/getUsedBot'
const webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL)

module.exports = class skip extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            description: 'Skip a song',
            name_localizations: {
                'es-ES': 'saltar',
                'en-US': 'skip',
            },
            description_localizations: {
                'es-ES': 'Salta una canción de la cola.',
                'en-US': 'Skip a song from the queue.',
            },
            cooldown: 5,
        })
    }
    async run(client, interaction, args) {
        let usedBotID = await getUsedBot(interaction)

        if (!usedBotID) {
            const errorembed = new EmbedBuilder().setColor(15548997).setFooter(
                getRandomPhrase(interaction.language.SKIP[1]),
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

        data.push(interaction.guild.id)
        data.push(interaction.member.user.username)
        data.push(interaction.member.user.discriminator)
        data.push(interaction.member.displayAvatarURL())
        data.push(interaction.member.voice.channelId)
        data.push(interaction.member.voice)
        data.push(interaction.guild.shardId)

        switch (usedBotID) {
            case process.env.bot1id:
                fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/skip_song`, {
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
                            'Error en el comando skip (1)',
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
                fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/skip_song`, {
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
                            'Error en el comando skip (2)',
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
                fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/skip_song`, {
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
                            'Error en el comando skip (3)',
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
                fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/skip_song`, {
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
                            'Error en el comando skip (4)',
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
