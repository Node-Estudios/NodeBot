const { Client, CommandInteraction, MessageEmbed, Discord } = require('discord.js');
const fetch = require('node-fetch');
const getUsedBot = require('../../../utils/getUsedBot');
import Command from '../../../structures/command';
const getRandomPhrase = require('../../../utils/getRandomPhrase');
const simplestDiscordWebhook = require('simplest-discord-webhook');
let webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL);
module.exports = class volume extends Command {
    constructor(client) {
        super(client, {
            name: 'volume',
            description: 'Set the song volume.',
            name_localizations: {
                'es-ES': 'volumen',
            },
            description_localizations: {
                'es-ES': 'Actualiza el volumen de la canción.',
            },
            cooldown: 5,
            options: [
                {
                    type: 10,
                    name: 'value',
                    description: 'Value for the volume.',
                    name_localizations: {
                        'es-ES': 'valor',
                    },
                    description_localizations: {
                        'es-ES': 'Valor del nuevo volumen.',
                    },
                    required: true,
                },
            ],
        });
    }
    /**,
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async run(client, interaction, args) {
        let usedBotID = await getUsedBot(interaction);

        if (!usedBotID) {
            const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                getRandomPhrase(client.language.SKIP[1]),
                interaction.member.displayAvatarURL({
                    dynamic: true,
                }),
            );
            return interaction.editReply({
                embeds: [errorembed],
                ephemeral: true,
            });
        }

        const data = [];

        data.push(interaction.member.voice);
        data.push(interaction.guild.id);
        data.push(args);
        data.push(interaction.member.user.username);
        data.push(interaction.member.user.discriminator);
        data.push(
            interaction.member.displayAvatarURL({
                dynamic: true,
            }),
        );
        data.push(interaction.guild.shardId);

        switch (usedBotID) {
            case process.env.bot1id:
                fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/volume`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: process.env.jwt,
                    },
                })
                    .then(response => response.json())
                    .then(embed => {
                        interaction.editReply({
                            embeds: [embed],
                        });
                    })
                    .catch(() => {
                        const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                            getRandomPhrase(client.language.INTERNALERROR),
                            interaction.member.displayAvatarURL({
                                dynamic: true,
                            }),
                        );
                        const errorembed2 = new MessageEmbed().setColor(15548997).setFooter(
                            'Error en el comando volume (1)',
                            client.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        );
                        webhookClient.send(errorembed2);
                        interaction.editReply({
                            embeds: [errorembed],
                        });
                    });
                break;
            case process.env.bot2id:
                fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/volume`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: process.env.jwt,
                    },
                })
                    .then(response => response.json())
                    .then(embed => {
                        interaction.editReply({
                            embeds: [embed],
                        });
                    })
                    .catch(() => {
                        const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                            getRandomPhrase(client.language.INTERNALERROR),
                            interaction.member.displayAvatarURL({
                                dynamic: true,
                            }),
                        );
                        const errorembed2 = new MessageEmbed().setColor(15548997).setFooter(
                            'Error en el comando volume (2)',
                            client.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        );
                        webhookClient.send(errorembed2);
                        interaction.editReply({
                            embeds: [errorembed],
                        });
                    });
                break;
            case process.env.bot3id:
                fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/volume`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: process.env.jwt,
                    },
                })
                    .then(response => response.json())
                    .then(embed => {
                        interaction.editReply({
                            embeds: [embed],
                        });
                    })
                    .catch(() => {
                        const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                            getRandomPhrase(client.language.INTERNALERROR),
                            interaction.member.displayAvatarURL({
                                dynamic: true,
                            }),
                        );
                        const errorembed2 = new MessageEmbed().setColor(15548997).setFooter(
                            'Error en el comando volume (3)',
                            client.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        );
                        webhookClient.send(errorembed2);
                        interaction.editReply({
                            embeds: [errorembed],
                        });
                    });
                break;
            case process.env.bot4id:
                fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/volume`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: process.env.jwt,
                    },
                })
                    .then(response => response.json())
                    .then(embed => {
                        interaction.editReply({
                            embeds: [embed],
                        });
                    })
                    .catch(() => {
                        const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                            getRandomPhrase(client.language.INTERNALERROR),
                            interaction.member.displayAvatarURL({
                                dynamic: true,
                            }),
                        );
                        const errorembed2 = new MessageEmbed().setColor(15548997).setFooter(
                            'Error en el comando volume (4)',
                            client.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        );
                        webhookClient.send(errorembed2);
                        interaction.editReply({
                            embeds: [errorembed],
                        });
                    });
                break;
        }
    }
};
