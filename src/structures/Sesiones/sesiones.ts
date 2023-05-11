import { DiscordTogether } from 'discord-together'
import { ColorResolvable, EmbedBuilder } from 'discord.js'
import Command from '../../structures/Command.js'
module.exports = class sesions extends Command {
    constructor(client) {
        super(client, {
            name: 'sesions',
            description: 'Starts a youtube/poker/fishing/chess/betrayal sesion together with the bot',
            name_localizations: {
                'es-ES': 'sesiones',
            },
            description_localizations: {
                'es-ES': 'Inicia una sesión de youtube/poker/fishing/chess/betrayal junto con el bot',
            },
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: 'game',
                    description: 'make the choice between the games',
                    name_localizations: {
                        'es-ES': 'selección',
                    },
                    description_localizations: {
                        'es-ES': 'Selecciona entre los juegos',
                    },
                    choices: [
                        {
                            name: 'YouTube',
                            value: 'youtube',
                        },
                        {
                            name: 'Betrayal',
                            value: 'betrayal',
                        },
                        {
                            name: 'Poker',
                            value: 'poker',
                        },
                        {
                            name: 'Fishing',
                            name_localizations: {
                                'es-ES': 'Pesca',
                            },
                            value: 'fishing',
                        },
                        {
                            name: 'Chess',
                            name_localizations: {
                                'es-ES': 'Ajedrez',
                            },
                            value: 'chess',
                        },
                    ],
                    required: true,
                },
            ],
        })
    }
    async run(client, interaction, args) {
        // try {

        client.discordTogether = new DiscordTogether(client)
        const Guild = await client.guilds.fetch(interaction.guild.id) // Getting the guild.
        await Guild.members.fetch(interaction.member.id).then(async Member => {
            const channel = await Member.voice.channel
            if (!Guild) return
            if (!Member) return
            if (!channel) {
                const errorembed = new EmbedBuilder()
                    .setColor('RED')
                    .setTitle(interaction.language.ERROREMBED)
                    .setDescription(interaction.language.BETRAYAL[2])
                    .setFooter(
                        interaction.member.user.username + '#' + interaction.member.user.discriminator,
                        interaction.member.displayAvatarURL(),
                    )
                return interaction.editReply({
                    embeds: [errorembed],
                    ephemeral: true,
                })
            }
            if (args[0]) {
                switch (args[0]) {
                    case 'youtube':
                        client.discordTogether.createTogetherCode(channel.id, 'youtube', 0).then(async invite => {
                            if (invite.code === 50013) {
                                const errorembed = new EmbedBuilder()
                                    .setColor('RED')
                                    .setTitle(interaction.language.ERROREMBED)
                                    .setDescription(interaction.language.CREATEINVITEPERMS)
                                    .setFooter(
                                        interaction.member.user.username + '#' + interaction.member.user.discriminator,
                                        interaction.member.displayAvatarURL(),
                                    )
                                return interaction.editReply({
                                    embeds: [errorembed],
                                    ephemeral: true,
                                })
                            }
                            const embed = new EmbedBuilder()
                            if (!invite.code) {
                                const errorembed = new EmbedBuilder()
                                    .setColor('RED')
                                    .setTitle(interaction.language.ERROREMBED)
                                    .setDescription(interaction.language.BETRAYAL[2])
                                    .setFooter(
                                        interaction.member.user.username + '#' + interaction.member.user.discriminator,
                                        interaction.member.displayAvatarURL(),
                                    )
                                return interaction.editReply({
                                    embeds: [errorembed],
                                    ephemeral: true,
                                })
                            }
                            embed.setColor(process.env.bot1Embed_Color as ColorResolvable)
                            embed.setDescription(
                                `<a:arrowright:970388686816550912> **${interaction.language.BETRAYAL[1]}(${invite.code} 'Enlace de Youtube') <a:arrowleft:893553168108093560>**`,
                            )
                            return interaction.editReply({
                                embeds: [embed],
                            })
                        })
                    case 'betrayal':
                        client.discordTogether.createTogetherCode(channel.id, 'betrayal', 0).then(async invite => {
                            if (invite.code === 50013) {
                                const errorembed = new EmbedBuilder()
                                    .setColor('RED')
                                    .setTitle(interaction.language.ERROREMBED)
                                    .setDescription(interaction.language.CREATEINVITEPERMS)
                                    .setFooter(
                                        interaction.member.user.username + '#' + interaction.member.user.discriminator,
                                        interaction.member.displayAvatarURL(),
                                    )
                                return interaction.editReply({
                                    embeds: [errorembed],
                                    ephemeral: true,
                                })
                            }
                            const embed = new EmbedBuilder()
                            if (!invite.code) {
                                const errorembed = new EmbedBuilder()
                                    .setColor('RED')
                                    .setTitle(interaction.language.ERROREMBED)
                                    .setDescription(interaction.language.BETRAYAL[2])
                                    .setFooter(
                                        interaction.member.user.username + '#' + interaction.member.user.discriminator,
                                        interaction.member.displayAvatarURL(),
                                    )
                                return interaction.editReply({
                                    embeds: [errorembed],
                                    ephemeral: true,
                                })
                            }
                            embed.setColor(process.env.bot1Embed_Color as ColorResolvable)
                            embed.setDescription(
                                `<a:arrowright:970388686816550912> **${interaction.language.BETRAYAL[1]}(${invite.code} 'Enlace de Youtube') <a:arrowleft:893553168108093560>**`,
                            )
                            return interaction.editReply({
                                embeds: [embed],
                            })
                        })
                    case 'poker':
                        client.discordTogether.createTogetherCode(channel.id, 'poker', 0).then(async invite => {
                            if (invite.code === 50013) {
                                const errorembed = new EmbedBuilder()
                                    .setColor('RED')
                                    .setTitle(interaction.language.ERROREMBED)
                                    .setDescription(interaction.language.CREATEINVITEPERMS)
                                    .setFooter(
                                        interaction.member.user.username + '#' + interaction.member.user.discriminator,
                                        interaction.member.displayAvatarURL(),
                                    )
                                return interaction.reply({
                                    embeds: [errorembed],
                                    ephemeral: true,
                                })
                            }
                            const embed = new EmbedBuilder()
                            if (!invite.code) {
                                const errorembed = new EmbedBuilder()
                                    .setColor('RED')
                                    .setTitle(interaction.language.ERROREMBED)
                                    .setDescription(interaction.language.BETRAYAL[2])
                                    .setFooter(
                                        interaction.member.user.username + '#' + interaction.member.user.discriminator,
                                        interaction.member.displayAvatarURL(),
                                    )
                                return interaction.editReply({
                                    embeds: [errorembed],
                                    ephemeral: true,
                                })
                            }
                            embed.setColor(process.env.bot1Embed_Color as ColorResolvable)
                            embed.setDescription(
                                `<a:arrowright:970388686816550912> **${interaction.language.BETRAYAL[1]}(${invite.code} 'Enlace de Youtube') <a:arrowleft:893553168108093560>**`,
                            )
                            return interaction.editReply({
                                embeds: [embed],
                            })
                        })
                    case 'fishing':
                        client.discordTogether.createTogetherCode(channel.id, 'fishing', 0).then(async invite => {
                            if (invite.code === 50013) {
                                const errorembed = new EmbedBuilder()
                                    .setColor('RED')
                                    .setTitle(interaction.language.ERROREMBED)
                                    .setDescription(interaction.language.CREATEINVITEPERMS)
                                    .setFooter(
                                        interaction.member.user.username + '#' + interaction.member.user.discriminator,
                                        interaction.member.displayAvatarURL(),
                                    )
                                return interaction.editReply({
                                    embeds: [errorembed],
                                    ephemeral: true,
                                })
                            }
                            const embed = new EmbedBuilder()
                            if (!invite.code) {
                                const errorembed = new EmbedBuilder()
                                    .setColor('RED')
                                    .setTitle(interaction.language.ERROREMBED)
                                    .setDescription(interaction.language.BETRAYAL[2])
                                    .setFooter(
                                        interaction.member.user.username + '#' + interaction.member.user.discriminator,
                                        interaction.member.displayAvatarURL(),
                                    )
                                return interaction.editReply({
                                    embeds: [errorembed],
                                    ephemeral: true,
                                })
                            }
                            embed.setColor(process.env.bot1Embed_Color as ColorResolvable)
                            embed.setDescription(
                                `<a:arrowright:970388686816550912> **${interaction.language.BETRAYAL[1]}(${invite.code} 'Enlace de Youtube') <a:arrowleft:893553168108093560>**`,
                            )
                            return interaction.editReply({
                                embeds: [embed],
                            })
                        })
                    case 'chess':
                        client.discordTogether.createTogetherCode(channel.id, 'chess', 0).then(async invite => {
                            if (invite.code === 50013) {
                                const errorembed = new EmbedBuilder()
                                    .setColor('RED')
                                    .setTitle(interaction.language.ERROREMBED)
                                    .setDescription(interaction.language.CREATEINVITEPERMS)
                                    .setFooter(
                                        interaction.member.user.username + '#' + interaction.member.user.discriminator,
                                        interaction.member.displayAvatarURL(),
                                    )
                                return interaction.editReply({
                                    embeds: [errorembed],
                                    ephemeral: true,
                                })
                            }
                            const embed = new EmbedBuilder()
                            if (!invite.code) {
                                const errorembed = new EmbedBuilder()
                                    .setColor('RED')
                                    .setTitle(interaction.language.ERROREMBED)
                                    .setDescription(interaction.language.BETRAYAL[2])
                                    .setFooter(
                                        interaction.member.user.username + '#' + interaction.member.user.discriminator,
                                        interaction.member.displayAvatarURL(),
                                    )
                                return interaction.editReply({
                                    embeds: [errorembed],
                                    ephemeral: true,
                                })
                            }
                            embed.setColor(process.env.bot1Embed_Color as ColorResolvable)
                            embed.setDescription(
                                `<a:arrowright:970388686816550912> **${interaction.language.BETRAYAL[1]}(${invite.code} 'Enlace de Youtube') <a:arrowleft:893553168108093560>**`,
                            )
                            return interaction.editReply({
                                embeds: [embed],
                            })
                        })
                }
            }

            // } catch (e) {
            //   console.error(e);
            //   message.channel.send({
            //     embeds: [
            //       new Discord.EmbedBuilder()
            //         .setColor("RED")
            //         .setTitle(interaction.language.ERROREMBED)
            //         .setDescription(interaction.language.fatal_error)
            //         .setFooter(message.author.username, message.author.avatarURL())
            //     ]
            //   });
            //   webhookClient.send(
            //     `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
            //   );
            //   try {
            //     message.author
            //       .send(
            //         "Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>"
            //       )
            //       .catch(e);
            //   } catch (e) { }
            // }
        })
    }
}
