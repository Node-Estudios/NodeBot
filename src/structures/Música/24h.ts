import { CommandInteraction, MessageEmbed } from 'discord.js';
import Command from '../../structures/command.js';
import getUsedBot from '../../utils/getUsedBot';
import getRandomPhrase from '../../utils/getRandomPhrase.js';
import simplestDiscordWebhook from 'simplest-discord-webhook';
let webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL);

module.exports = class stayinvoice extends Command {
    constructor(client) {
        super(client, {
            name: '247',
            description: 'Stay 24/7 in a voice channel',
            options: [
                {
                    type: 3,
                    name: 'bot',
                    description: 'Bot to consult.',
                    name_localizations: {
                        'es-ES': 'bot',
                    },
                    description_localizations: {
                        'es-ES': 'Bot a consultar.',
                    },
                    choices: [
                        {
                            name: '🤖 Node',
                            value: process.env.bot1id,
                        },
                        {
                            name: '🤖 Node 2',
                            value: process.env.bot2id,
                        },
                        {
                            name: '🤖 Node 3',
                            value: process.env.bot3id,
                        },
                        {
                            name: '🤖 Node 4',
                            value: process.env.bot4id,
                        },
                    ],
                },
            ],
            cooldown: 5,
        });
    }
    /**,
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async run(client: any, interaction: CommandInteraction<'cached'>, args) {
        let usedBotID;
        let option = interaction.options.getString('bot');
        if (option) {
            usedBotID = option;
        } else {
            usedBotID = await getUsedBot(interaction);
        }

        if (!usedBotID) {
            const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                client.language.NOWPLAYING[2],
                interaction.member.displayAvatarURL({
                    dynamic: true,
                }),
            );
            return interaction.editReply({
                embeds: [errorembed],
            });
        }

        const data: any[] = [];

        data.push(interaction.member.voice);
        data.push(interaction.guild.id);
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
                fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/247`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: process.env.jwt as string,
                    },
                })
                    .then(r => r.json())
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
                            'Error en el comando 247 (1)',
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
                fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/247`, {
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
                            'Error en el comando 247 (2)',
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
                fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/247`, {
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
                            'Error en el comando 247 (3)',
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
                fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/247`, {
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
                            'Error en el comando 247 (4)',
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
