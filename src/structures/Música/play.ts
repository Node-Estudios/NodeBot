import fetch from 'node-fetch';
const bot1missing = require('./functions/bot1missing.js');
const bot2missing = require('./functions/bot2missing.js');
const bot3missing = require('./functions/bot3missing.js');
const bot4missing = require('./functions/bot4missing.js');
require('dotenv').config();
const getRandomPhrase = require('../../../utils/getRandomPhrase');
const simplestDiscordWebhook = require('simplest-discord-webhook');
let webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL);
import { CommandInteraction, Guild, GuildMember, MessageEmbed } from 'discord.js';
import Client from '../../structures/client';

import Command from '../../structures/command';

export default class play extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'play',
            description: 'Reproduce música en el canal de voz que te encuentres',
            name_localizations: {
                'es-ES': 'reproducir',
            },
            description_localizations: {
                'es-ES': 'Reproduce la canción que desees con su nombre o un link de youtube/spotify',
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
    async run(client: Client, interaction: CommandInteraction, args: any) {
        if (!(interaction.member as GuildMember).voice.channel) {
            const errorembed = new MessageEmbed().setColor(15548997).setFooter(
                client.language.PLAY[1],
                (interaction.member as GuildMember).displayAvatarURL({
                    dynamic: true,
                }),
            );
            return interaction.editReply({
                embeds: [errorembed],
            });
        }

        const data: Array<any> = [];

        data.push((interaction.member as GuildMember).voice);
        data.push((interaction.member as GuildMember).user.username);
        data.push((interaction.member as GuildMember).user.discriminator);
        data.push(
            (interaction.member as GuildMember).displayAvatarURL({
                dynamic: true,
            }),
        );
        data.push((interaction.guild as Guild).id);
        data.push(interaction.channelId);
        data.push(interaction.member);
        data.push(args);
        data.push((interaction.guild as Guild).name);
        data.push((interaction.member as GuildMember).voice);

        let bot1Availability = false;
        let addToQueue = false;
        await (interaction.guild as Guild).members
            .fetch(process.env.bot1id!)
            .then(member => {
                console.log(member.voice.channel);
                if (member.voice.channel) {
                    member.voice.channel.members.forEach(listener => {
                        switch (listener.user.id) {
                            case process.env.bot2id:
                                fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/new_player`, {
                                    method: 'POST',
                                    body: JSON.stringify(data),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: process.env.jwt!,
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
                                            (interaction.member as GuildMember).displayAvatarURL({
                                                dynamic: true,
                                            }),
                                        );
                                        const errorembed2 = new MessageEmbed().setColor(15548997).setFooter(
                                            'Error en el comando play (1)',
                                            client.user!.displayAvatarURL({
                                                dynamic: true,
                                            }),
                                        );
                                        webhookClient.send(errorembed2);
                                        interaction.editReply({
                                            embeds: [errorembed],
                                        });
                                    });

                            case process.env.bot3id:
                                fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/new_player`, {
                                    method: 'POST',
                                    body: JSON.stringify(data),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: process.env.jwt!,
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
                                            (interaction.member as GuildMember).displayAvatarURL({
                                                dynamic: true,
                                            }),
                                        );
                                        const errorembed2 = new MessageEmbed().setColor(15548997).setFooter(
                                            'Error en el comando play (2)',
                                            client.user!.displayAvatarURL({
                                                dynamic: true,
                                            }),
                                        );
                                        webhookClient.send(errorembed2);
                                        interaction.editReply({
                                            embeds: [errorembed],
                                        });
                                    });
                            case process.env.bot4id:
                                fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/new_player`, {
                                    method: 'POST',
                                    body: JSON.stringify(data),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: process.env.jwt!,
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
                                            (interaction.member as GuildMember).displayAvatarURL({
                                                dynamic: true,
                                            }),
                                        );
                                        const errorembed2 = new MessageEmbed().setColor(15548997).setFooter(
                                            'Error en el comando play ()',
                                            client.user!.displayAvatarURL({
                                                dynamic: true,
                                            }),
                                        );
                                        webhookClient.send(errorembed2);
                                        interaction.editReply({
                                            embeds: [errorembed],
                                        });
                                    });
                        }
                    });
                    if (
                        member.voice.channel &&
                        member.voice.channel == (interaction.member as GuildMember).voice.channel
                    )
                        addToQueue = true;
                } else {
                    console.log('b');
                    bot1Availability = true;
                }
            })
            .catch(e => {
                const errorembed2 = new MessageEmbed().setColor(15548997).setFooter(
                    'Error en el comando play (4)',
                    client.user!.displayAvatarURL({
                        dynamic: true,
                    }),
                );
                webhookClient.send(errorembed2);
                console.log(e);
            });
        console.log('bot1Availability', bot1Availability);
        if (bot1Availability || addToQueue) {
            fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/new_player`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: process.env.jwt!,
                },
            })
                .then(response => response.json())
                .then(embed => {
                    interaction.editReply({
                        embeds: [embed],
                    });
                })
                .catch(e => {
                    fetch(`http://${process.env.IP}:${process.env.bot1Port}/api/v1/new_player`, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: process.env.jwt!,
                        },
                    })
                        .then(response => response.json())
                        .then(embed => {
                            interaction.editReply({
                                embeds: [embed],
                            });
                        })
                        .catch(e => {
                            const errorembed2 = new MessageEmbed().setColor(15548997).setFooter(
                                'Error en el comando play (5)',
                                client.user!.displayAvatarURL({
                                    dynamic: true,
                                }),
                            );
                            bot1missing(client, interaction, data, 'new_player');
                            webhookClient.send(errorembed2);
                        });
                });
        } else {
            let bot2Availability;
            let addToQueue2;
            await (interaction.guild as Guild).members
                .fetch(process.env.bot2id!)
                .then(member => {
                    member.voice.channel ? (bot2Availability = false) : (bot2Availability = true);
                    if (
                        member.voice.channel &&
                        member.voice.channel != (interaction.member as GuildMember).voice.channel
                    )
                        bot2Availability = false;
                    if (
                        member.voice.channel &&
                        member.voice.channel == (interaction.member as GuildMember).voice.channel
                    )
                        addToQueue2 = true;
                })
                .catch(e => {
                    bot2Availability = false;
                });
            if (bot2Availability || addToQueue2) {
                // console.log('test');
                fetch(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/new_player`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: process.env.jwt!,
                    },
                })
                    .then(response => response.json())
                    .then(embed => {
                        // console.log(`http://${process.env.IP}:${process.env.bot2Port}/api/v1/new_player`);
                        interaction.editReply({
                            embeds: [embed],
                        });
                    })
                    .catch(() => {
                        const errorembed2 = new MessageEmbed().setColor(15548997).setFooter(
                            'Error en el comando play (6)',
                            client.user!.displayAvatarURL({
                                dynamic: true,
                            }),
                        );
                        bot2missing(client, interaction, data, 'new_player');
                        webhookClient.send(errorembed2);
                    });
            } else {
                let bot3Availability;
                let addToQueue3;
                await (interaction.guild as Guild).members
                    .fetch(process.env.bot3id!)
                    .then((member: GuildMember) => {
                        member.voice.channel ? (bot3Availability = false) : (bot3Availability = true);
                        if (
                            member.voice.channel &&
                            member.voice.channel != (interaction.member as GuildMember).voice.channel
                        )
                            bot3Availability = false;
                        if (
                            member.voice.channel &&
                            member.voice.channel == (interaction.member as GuildMember).voice.channel
                        )
                            addToQueue3 = true;
                    })
                    .catch(e => {
                        bot3Availability = false;
                    });

                if (bot3Availability || addToQueue3) {
                    fetch(`http://${process.env.IP}:${process.env.bot3Port}/api/v1/new_player`, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: process.env.jwt!,
                        },
                    })
                        .then(response => response.json())
                        .then(embed => {
                            interaction.editReply({
                                embeds: [embed],
                            });
                        })
                        .catch(() => {
                            const errorembed2 = new MessageEmbed().setColor(15548997).setFooter(
                                'Error en el comando play (7)',
                                client.user!.displayAvatarURL({
                                    dynamic: true,
                                }),
                            );
                            bot3missing(client, interaction, data, 'new_player');
                            webhookClient.send(errorembed2);
                        });
                } else {
                    let bot4Availability;
                    let addToQueue4;
                    await (interaction.guild as Guild).members
                        .fetch(process.env.bot4id!)
                        .then(member => {
                            member.voice.channel ? (bot4Availability = false) : (bot4Availability = true);
                            if (
                                member.voice.channel &&
                                member.voice.channel != (interaction.member as GuildMember).voice.channel
                            )
                                bot4Availability = false;
                            if (
                                member.voice.channel &&
                                member.voice.channel == (interaction.member as GuildMember).voice.channel
                            )
                                addToQueue4 = true;
                        })
                        .catch(e => {
                            bot4Availability = false;
                        });

                    if (bot4Availability || addToQueue4) {
                        fetch(`http://${process.env.IP}:${process.env.bot4Port}/api/v1/new_player`, {
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
                                });
                            })
                            .catch(() => {
                                const errorembed2 = new MessageEmbed().setColor(15548997).setFooter(
                                    'Error en el comando play (8)',
                                    client.user!.displayAvatarURL({
                                        dynamic: true,
                                    }),
                                );
                                bot4missing(client, interaction, data, 'new_player');
                                webhookClient.send(errorembed2);
                            });
                    } else {
                        bot4missing(client, interaction, data, 'new_player');
                    }
                }
            }
        }
    }
}

function formatTime(ms: number) {
    const time = {
        d: 0,
        h: 0,
        m: 0,
        s: 0,
    };
    time.s = Math.floor(ms / 1000);
    time.m = Math.floor(time.s / 60);
    time.s %= 60;
    time.h = Math.floor(time.m / 60);
    time.m %= 60;
    time.d = Math.floor(time.h / 24);
    time.h %= 24;

    const res = [];
    for (const [k, v] of Object.entries(time)) {
        let first = false;
        if (v < 1 && !first) continue;

        res.push(v < 10 ? `0${v}` : `${v}`);
        first = true;
    }
    return res.join(':');
}
