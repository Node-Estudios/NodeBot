import { CommandInteraction, Interaction, GuildMember } from 'discord.js';

import Client from '../../structures/client';
// const UserModel = require('../../models/user');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const getRandomPhrase = require('../../utils/getRandomPhrase');
const Statcord = require('statcord.js');
const cooldowns = new Discord.Collection();

export default class interactionCreate {
    constructor() { }
    async run(interaction: Interaction, client: Client) {
        if (!client.user) return;
        if (!interaction.guild) return;
        // console.log(client.commands);
        if (interaction.isCommand()) {
            let commandName = interaction.commandName;
            let desc =
                client.language.NODETHINKING[
                Math.floor(Math.random() * (Object.keys(client.language.NODETHINKING).length + 1) + 1)
                ];
            if (!desc) desc = client.language.NODETHINKING[1];

            const loadingEmbed = new MessageEmbed().setColor(process.env.bot1Embed_Color).setDescription(desc);

            await interaction
                .reply({
                    embeds: [loadingEmbed],
                })
                .catch(e => {
                    client.logger.error(e);
                });
            const cmd = client.commands.find((cmd2: any) => cmd2.name === interaction.commandName);

            if (cmd) {
                client.logger.info(`Comando ${cmd.name} ejecutado`);

                const args = [];
                for (let option of interaction.options.data) {
                    if (option.type === 'SUB_COMMAND') {
                        if (option.name) args.push(option.name);
                        option.options?.forEach(x => {
                            if (x.value) args.push(x.value);
                        });
                    } else if (option.value) args.push(option.value);
                }
                // interaction.member = interaction.guild!.members.cache.get(
                //   interaction.user.id
                // );
                // fetchUser(client);

                // async function fetchUser(client2: Client) {
                //     return await new Promise(resolve => {
                //         client2.users.fetch(interaction.user.id).then(() => {
                //             UserModel.findOne({
                //                 USERID: interaction.user.id.toString(),
                //             }).then(async (s: typeof UserModel, err: Error) => {
                //                 if (err) {
                //                     client.logger.error(err);
                //                 }
                //                 if (s) {
                //                     s.COMMANDS_EXECUTED = s.COMMANDS_EXECUTED + 1;
                //                     s.save().catch((err: Error) => {
                //                         client.logger.error(err);
                //                     });
                //                 }
                //                 if (!s) {
                //                     client.logger.debug(interaction.user.id.toString());
                //                     const user = new UserModel({
                //                         USERID: interaction.user.id.toString(),
                //                         LANG: 'es_ES',
                //                         COMMANDS_EXECUTED: 0,
                //                         BANNED: false,
                //                         Roles: {
                //                             Developer: {
                //                                 Enabled: false,
                //                                 Date: null,
                //                             },
                //                             Tester: {
                //                                 Enabled: false,
                //                                 Date: null,
                //                             },
                //                         },
                //                         // Interacciones: {
                //                         //     Enviadas: {},
                //                         //     Recibidas: {},
                //                         // },
                //                     });
                //                     user.save().catch((err: Error) => client.logger.error(err));
                //                     resolve(user);
                //                 }
                //             });
                //         });
                //     });
                // }
                //CHECK PERMISSIONS *COPIADO DE OTRO BOT XD
                const permissionHelpMessage = `Hey! Tienes problemas? Entra en nuestro servidor.`;
                if (cmd.permissions) {
                    cmd.permissions.botPermissions.concat(['SEND_MESSAGES', 'EMBED_LINKS']);
                    if (cmd.permissions.botPermissions.length > 0) {
                        const missingPermissions = cmd.permissions.botPermissions.filter(
                            (perm: any) => !interaction.guild!.me!.permissions.has(perm),
                        );
                        if (missingPermissions.length > 0) {
                            if (missingPermissions.includes('SEND_MESSAGES')) {
                                const user = client.users.cache.get('id');
                                if (!user) return;
                                else if (!user.dmChannel) await user.createDM();
                                await user.dmChannel!.send(
                                    `No tengo los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(
                                        ', ',
                                    )}**\n${permissionHelpMessage}`,
                                );
                            }
                            return interaction.editReply({
                                content: `No tengo los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(
                                    ', ',
                                )}**\n${permissionHelpMessage}`,
                                embeds: [],
                            });
                        }
                    }

                    if (cmd.permissions.userPermissions.length > 0) {
                        const missingPermissions = cmd.permissions.userPermissions.filter(
                            (perm: any) => !(interaction.member as GuildMember).permissions.has(perm),
                        );
                        if (missingPermissions.length > 0) {
                            return interaction.editReply({
                                content: `No tienes los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(
                                    ', ',
                                )}**`,
                                embeds: [],
                            });
                        }
                    }
                    if (
                        cmd.permissions.botPermissions.includes(Discord.Permissions.CONNECT) &&
                        !(interaction.member as GuildMember)!
                            .voice!.channel!.permissionsFor(client.user)!
                            .has(Discord.Permissions.CONNECT)
                    )
                        return interaction.editReply({
                            content: 'No tengo permisos de conectarme al canal de voz donde estás',
                            embeds: [],
                        });
                    if (
                        cmd.permissions.botPermissions.includes(Discord.Permissions.SPEAK) &&
                        !(interaction.member as GuildMember)!
                            .voice!.channel!.permissionsFor(client.user)!
                            .has(Discord.Permissions.SPEAK)
                    )
                        return interaction.editReply({
                            content: 'No tengo permisos de hablar en el canal de voz donde estás',
                            embeds: [],
                        });
                    //CHECK PERMISSION
                    if (cmd.permissions.dev === true && !client.devs.includes(interaction.user.id))
                        return interaction.editReply({
                            content: 'Comando exclusivo para devs',
                            embeds: [],
                        });
                }

                //COOLDOWN, TAMBIÉN COPIADO DE OTRO BOT EKISDEEEEE
                if (!client.devs.includes(interaction.user.id)) {
                    if (!cooldowns.has(commandName)) {
                        cooldowns.set(commandName, new Discord.Collection());
                    }
                    const now = Date.now();
                    const timestamps = cooldowns.get(commandName);
                    const cooldownAmount = Math.floor(cmd.cooldown || 5) * 1000;
                    if (!timestamps.has(interaction.user.id)) {
                        timestamps.set(interaction.user.id, now);
                        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
                    } else {
                        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                        const timeLeft = (expirationTime - now) / 1000;
                        if (now < expirationTime && timeLeft > 0.9) {
                            return interaction.editReply({
                                content: `Heyy! Ejecutas los coamndos demasiado rápido! Espera ${timeLeft.toFixed(
                                    1,
                                )} segundos para ejecutar \`${commandName}\``,
                                embeds: [],
                            });
                        }
                        timestamps.set(interaction.user.id, now);
                        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
                    }
                }
                //COOLDOWN
                cmd.run(client, interaction, args);
                if (process.env.NODE_ENV == 'production')
                    Statcord.ShardingClient.postCommand(cmd.name, (interaction.member as GuildMember).id, client);
            } else {

                if (!cmd)
                    return interaction.editReply({
                        content: 'No se encontró el comando',
                        embeds: [],
                        components: [],
                        files: [],
                    });

                interaction.editReply({
                    content: cmd.response,
                });
            }
        } else if (interaction.isSelectMenu()) {
            const menu = client.selectMenu.get(interaction.customId);
            if (menu) menu.run(client, interaction);
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (button) button.run(client, interaction);
        }
    }
}
