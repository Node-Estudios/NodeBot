import { CommandInteraction } from 'discord.js';
module.exports = function getUsedBot(interaction: CommandInteraction<'cached'>) {
    return new Promise((resolve, reject) => {
        interaction.guild.members
            .fetch(process.env.bot1id as string)
            .then(member => {
                if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
                    resolve(process.env.bot1id as string);
                } else {
                    interaction.guild.members
                        .fetch(process.env.bot2id as string)
                        .then(member => {
                            if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
                                resolve(process.env.bot2id as string);
                            } else {
                                interaction.guild.members
                                    .fetch(process.env.bot3id as string)
                                    .then(member => {
                                        if (
                                            member.voice.channel &&
                                            member.voice.channel == interaction.member.voice.channel
                                        ) {
                                            resolve(process.env.bot3id as string);
                                        } else {
                                            interaction.guild.members
                                                .fetch(process.env.bot4id as string)
                                                .then(member => {
                                                    if (
                                                        member.voice.channel &&
                                                        member.voice.channel == interaction.member.voice.channel
                                                    ) {
                                                        resolve(process.env.bot4id as string);
                                                    } else {
                                                        resolve(0);
                                                    }
                                                })
                                                .catch(() => resolve(0));
                                        }
                                    })
                                    .catch(() => {
                                        interaction.guild.members
                                            .fetch(process.env.bot4id as string)
                                            .then(member => {
                                                if (
                                                    member.voice.channel &&
                                                    member.voice.channel == interaction.member.voice.channel
                                                ) {
                                                    resolve(process.env.bot4id as string);
                                                } else {
                                                    resolve(0);
                                                }
                                            })
                                            .catch(() => resolve(0));
                                    });
                            }
                        })
                        .catch(() => {
                            interaction.guild.members
                                .fetch(process.env.bot3id as string)
                                .then(member => {
                                    if (
                                        member.voice.channel &&
                                        member.voice.channel == interaction.member.voice.channel
                                    ) {
                                        resolve(process.env.bot3id as string);
                                    } else {
                                        interaction.guild.members
                                            .fetch(process.env.bot4id as string)
                                            .then(member => {
                                                if (
                                                    member.voice.channel &&
                                                    member.voice.channel == interaction.member.voice.channel
                                                ) {
                                                    resolve(process.env.bot4id as string);
                                                } else {
                                                    resolve(0);
                                                }
                                            })
                                            .catch(() => resolve(0));
                                    }
                                })
                                .catch(() => {
                                    interaction.guild.members
                                        .fetch(process.env.bot4id as string)
                                        .then(member => {
                                            if (
                                                member.voice.channel &&
                                                member.voice.channel == interaction.member.voice.channel
                                            ) {
                                                resolve(process.env.bot4id as string);
                                            } else {
                                                resolve(0);
                                            }
                                        })
                                        .catch(() => resolve(0));
                                });
                        });
                }
            })
            .catch(() => {
                interaction.guild.members
                    .fetch(process.env.bot2id as string)
                    .then(member => {
                        if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
                            resolve(process.env.bot2id as string);
                        } else {
                            interaction.guild.members
                                .fetch(process.env.bot3id as string)
                                .then(member => {
                                    if (
                                        member.voice.channel &&
                                        member.voice.channel == interaction.member.voice.channel
                                    ) {
                                        resolve(process.env.bot3id as string);
                                    } else {
                                        interaction.guild.members
                                            .fetch(process.env.bot4id as string)
                                            .then(member => {
                                                if (
                                                    member.voice.channel &&
                                                    member.voice.channel == interaction.member.voice.channel
                                                ) {
                                                    resolve(process.env.bot4id as string);
                                                } else {
                                                    resolve(0);
                                                }
                                            })
                                            .catch(() => resolve(0));
                                    }
                                })
                                .catch(() => {
                                    interaction.guild.members
                                        .fetch(process.env.bot4id as string)
                                        .then(member => {
                                            if (
                                                member.voice.channel &&
                                                member.voice.channel == interaction.member.voice.channel
                                            ) {
                                                resolve(process.env.bot4id as string);
                                            } else {
                                                resolve(0);
                                            }
                                        })
                                        .catch(() => resolve(0));
                                });
                        }
                    })
                    .catch(() => {
                        interaction.guild.members
                            .fetch(process.env.bot3id as string)
                            .then(member => {
                                if (member.voice.channel && member.voice.channel == interaction.member.voice.channel) {
                                    resolve(process.env.bot3id as string);
                                } else {
                                    interaction.guild.members
                                        .fetch(process.env.bot4id as string)
                                        .then(member => {
                                            if (
                                                member.voice.channel &&
                                                member.voice.channel == interaction.member.voice.channel
                                            ) {
                                                resolve(process.env.bot4id as string);
                                            } else {
                                                resolve(0);
                                            }
                                        })
                                        .catch(() => resolve(0));
                                }
                            })
                            .catch(() => {
                                interaction.guild.members
                                    .fetch(process.env.bot4id as string)
                                    .then(member => {
                                        if (
                                            member.voice.channel &&
                                            member.voice.channel == interaction.member.voice.channel
                                        ) {
                                            resolve(process.env.bot4id as string);
                                        } else {
                                            resolve(0);
                                        }
                                    })
                                    .catch(() => resolve(0));
                            });
                    });
            });
    });
};
