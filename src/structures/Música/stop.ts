import { Client, CommandInteraction, EmbedBuilder } from 'discord.js'
import simplestDiscordWebhook from 'simplest-discord-webhook'
import Command from '../../structures/command'
import getRandomPhrase from '../../utils/getRandomPhrase'
import getUsedBot from '../../utils/getUsedBot'
const webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL)
module.exports = class stop extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            description: 'Stop the current song.',
            name_localizations: {
                'es-ES': 'parar',
            },
            description_localizations: {
                'es-ES': 'Para la canción que se está reproduciendo.',
            },
            cooldown: 5,
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
                interaction.language.STOP[1],
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
                fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/stop`, {
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
                            'Error en el comando stop (1)',
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
                fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/stop`, {
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
                            'Error en el comando stop (2)',
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
                fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/stop`, {
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
                            'Error en el comando stop (3)',
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
                fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/stop`, {
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
                            'Error en el comando stop (4)',
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
