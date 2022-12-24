import { Client, CommandInteraction, MessageEmbed, ColorResolvable } from 'discord.js';
import Command from '../../structures/command.js';
require('dotenv').config();
import getUsedBot from '../../utils/getUsedBot';
import bot1missing from './functions/bot1missing';
import bot2missing from './functions/bot2missing';
import bot3missing from './functions/bot3missing';
import bot4missing from './functions/bot4missing';
import getRandomPhrase from '../../utils/getRandomPhrase.js';
import simplestDiscordWebhook from 'simplest-discord-webhook';
let webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL);
module.exports = class automix extends Command {
    constructor(client) {
        super(client, {
            name: 'automix',
            description: 'Create a playlist from a random selection of tracks related to a song.',
            name_localizations: {
                'es-ES': 'mezcla',
            },
            description_localizations: {
                'es-ES': 'Crea una playlist relacionada a una canción.',
            },
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: 'song',
                    description: 'Name of the song that u want to listen.',
                    name_localizations: {
                        'es-ES': 'canción',
                    },
                    description_localizations: {
                        'es-ES': 'Nombre de la canción que deseas escuchas.',
                    },
                    required: true,
                },
            ],
        });
    }
    async run(client, interaction, args) {
        const embed = new MessageEmbed()
            .setDescription(client.language.AUTOMIX[2])
            .setColor(process.env.bot1Embed_Color as ColorResolvable)
            .setFooter(
                interaction.member.user.username + '#' + interaction.member.user.discriminator,
                interaction.member.displayAvatarURL({
                    dynamic: true,
                }),
            );
        await interaction.editReply({
            embeds: [embed],
        });
        if (!interaction.member.voice.channel) {
            const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                getRandomPhrase(client.language.AUTOMIX[1]),
                interaction.member.displayAvatarURL({
                    dynamic: true,
                }),
            );
            return interaction.editReply({
                embeds: [errorembed],
                ephemeral: true,
            });
        }

        const data: any[] = [];

        data.push(args);
        data.push(interaction.member.user.username);
        data.push(interaction.member.user.discriminator);
        data.push(
            interaction.member.displayAvatarURL({
                dynamic: true,
            }),
        );
        data.push(interaction.member.voice.channelId);
        data.push(interaction.guild.id);
        data.push(interaction.channel.id);
        data.push(interaction.member);
        data.push(interaction.member.voice);
        data.push(interaction.guild.shardId);

        let bot1Availability = false;
        let addToQueue = false;
        await interaction.guild.members
            .fetch(process.env.bot1id)
            .then(member => {
                if (member.voice.channel) {
                    member.voice.channel.members.forEach(listener => {
                        switch (listener.user.id) {
                            case process.env.bot2id:
                                fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/automix`, {
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
                                        });
                                    })
                                    .catch(() => {
                                        const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                                            'El bot2 ha dado error en el automix',
                                            client.user.displayAvatarURL({
                                                dynamic: true,
                                            }),
                                        );
                                        webhookClient.send(errorembed);
                                        bot2missing(client, interaction, data, 'automix');
                                    });

                            case process.env.bot3id:
                                fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/automix`, {
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
                                        });
                                    })
                                    .catch(() => {
                                        const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                                            'El bot3 ha dado error en el automix',
                                            client.user.displayAvatarURL({
                                                dynamic: true,
                                            }),
                                        );
                                        webhookClient.send(errorembed);
                                        bot3missing(client, interaction, data, 'automix');
                                    });
                            case process.env.bot4id:
                                fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/automix`, {
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
                                        });
                                    })
                                    .catch(() => {
                                        const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                                            'El bot4 ha dado error en el automix',
                                            client.user.displayAvatarURL({
                                                dynamic: true,
                                            }),
                                        );
                                        webhookClient.send(errorembed);
                                        bot4missing(client, interaction, data, 'automix');
                                    });
                        }
                    });
                    if (member.voice.channel && member.voice.channel == interaction.member.voice.channel)
                        addToQueue = true;
                } else {
                    bot1Availability = true;
                }
            })
            .catch(e => {});
        if (bot1Availability || addToQueue) {
            fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/automix`, {
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
                    });
                })
                .catch(() => {
                    const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                        'El bot1 ha dado error en el automix',
                        client.user.displayAvatarURL({
                            dynamic: true,
                        }),
                    );
                    webhookClient.send(errorembed);
                    bot1missing(client, interaction, data, 'automix');
                });
        } else {
            let bot2Availability;
            let addToQueue2;
            await interaction.guild.members
                .fetch(process.env.bot2id)
                .then(member => {
                    member.voice.channel ? (bot2Availability = false) : (bot2Availability = true);
                    if (member.voice.channel && member.voice.channel != interaction.member.voice.channel)
                        bot2Availability = false;
                    if (member.voice.channel && member.voice.channel == interaction.member.voice.channel)
                        addToQueue2 = true;
                })
                .catch(e => {
                    bot2Availability = false;
                });

            if (bot2Availability || addToQueue2) {
                fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/automix`, {
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
                        });
                    })
                    .catch(() => {
                        const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                            'El bot2 ha dado error en el automix',
                            client.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        );
                        webhookClient.send(errorembed);
                        bot2missing(client, interaction, data, 'automix');
                    });
            } else {
                let bot3Availability;
                let addToQueue3;
                await interaction.guild.members
                    .fetch(process.env.bot3id)
                    .then(member => {
                        member.voice.channel ? (bot3Availability = false) : (bot3Availability = true);
                        if (member.voice.channel && member.voice.channel != interaction.member.voice.channel)
                            bot3Availability = false;
                        if (member.voice.channel && member.voice.channel == interaction.member.voice.channel)
                            addToQueue3 = true;
                    })
                    .catch(e => {
                        bot3Availability = false;
                    });

                if (bot3Availability || addToQueue3) {
                    fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/automix`, {
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
                            });
                        })
                        .catch(() => {
                            const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                                'El bot3 ha dado error en el automix',
                                client.user.displayAvatarURL({
                                    dynamic: true,
                                }),
                            );
                            webhookClient.send(errorembed);
                            bot3missing(client, interaction, data, 'automix');
                        });
                } else {
                    let bot4Availability;
                    let addToQueue4;
                    await interaction.guild.members
                        .fetch(process.env.bot4id)
                        .then(member => {
                            member.voice.channel ? (bot4Availability = false) : (bot4Availability = true);
                            if (member.voice.channel && member.voice.channel != interaction.member.voice.channel)
                                bot4Availability = false;
                            if (member.voice.channel && member.voice.channel == interaction.member.voice.channel)
                                addToQueue4 = true;
                        })
                        .catch(e => {
                            bot4Availability = false;
                        });

                    if (bot4Availability || addToQueue4) {
                        fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/automix`, {
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
                                });
                            })
                            .catch(() => {
                                const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                                    'El bot4 ha dado error en el automix',
                                    client.user.displayAvatarURL({
                                        dynamic: true,
                                    }),
                                );
                                webhookClient.send(errorembed);
                                bot4missing(client, interaction, data, 'automix');
                            });
                    } else {
                        const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                            'El bot4 ha dado error en el automix',
                            client.user.displayAvatarURL({
                                dynamic: true,
                            }),
                        );
                        webhookClient.send(errorembed);
                        bot4missing(client, interaction, data, 'automix');
                    }
                }
            }
        }
    }
};
