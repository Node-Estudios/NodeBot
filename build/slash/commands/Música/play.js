import { ApplicationCommandOptionType, EmbedBuilder, Colors, } from 'discord.js';
import performanceMeters from '#cache/performanceMeters.js';
import Translator, { keys } from '#utils/Translator.js';
import formatTime from '#utils/formatTime.js';
import Command from '#structures/Command.js';
import { randomInt } from 'node:crypto';
import logger from '#utils/logger.js';
export default class play extends Command {
    constructor() {
        super({
            name: 'play',
            description: 'Play the song that you want with the name or a youtube/spotify link',
            dm_permission: false,
            cooldown: 5,
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'song',
                    description: 'Name of the song that u want to listen.',
                    autocomplete: true,
                    required: false,
                },
            ],
        });
    }
    async run(interaction) {
        if (!interaction.inCachedGuild())
            return;
        const client = interaction.client;
        try {
            await interaction.deferReply();
        }
        catch (error) {
            logger.error(error);
            return client.errorHandler.captureException(error);
        }
        const translate = Translator(interaction);
        if (!interaction.member.voice.channelId)
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder().setColor(Colors.Red).setFooter({
                        text: translate(keys.play.not_voice),
                        iconURL: client.user?.displayAvatarURL(),
                    }),
                ],
            });
        let player = client.music.players.get(interaction.guildId);
        if (!player) {
            player = await client.music.createNewPlayer(interaction.member.voice.channel, interaction.channelId);
            try {
                await player.connect();
            }
            catch (error) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(Colors.Red).setFooter({
                            text: translate(keys.play.cant_join),
                            iconURL: client.user?.displayAvatarURL(),
                        }),
                    ],
                });
            }
        }
        if (player.voiceChannel.id !== interaction.member.voice.channelId)
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder().setColor(Colors.Red).setFooter({
                        text: translate(keys.play.same),
                        iconURL: client.user?.displayAvatarURL(),
                    }),
                ],
            }).catch(logger.error);
        player.textChannelId = interaction.channelId;
        try {
            const song = interaction.options.getString('song', false);
            const search = !song
                ? await this.getRecomended(player, interaction.user)
                    .then(t => {
                    if (!t) {
                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(Colors.Red)
                                    .setFooter({
                                    text: translate(keys.play.not_reproducible),
                                    iconURL: client.user?.displayAvatarURL(),
                                }),
                            ],
                        }).catch(logger.error);
                        return undefined;
                    }
                    return t;
                })
                    .catch(logger.error)
                : await client.music.search(song, interaction.user, 'Youtube')
                    .then(t => {
                    if (!t) {
                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(Colors.Red)
                                    .setFooter({
                                    text: translate(keys.play.not_reproducible),
                                    iconURL: client.user?.displayAvatarURL(),
                                }),
                            ],
                        }).catch(logger.error);
                        return undefined;
                    }
                    return t;
                })
                    .catch(async (e) => {
                    logger.error(e);
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setFooter({
                                text: translate(keys.play.not_reproducible),
                                iconURL: client.user?.displayAvatarURL(),
                            }),
                        ],
                    }).catch(logger.error);
                    return undefined;
                });
            if (!search)
                return;
            if (search.streams?.live)
                return await interaction.editReply({
                    content: 'We are currently working on supporting Live Streaming videos. :D',
                }).catch(logger.error);
            player.queue.add(search);
            if (!player.playing || player.paused)
                player.play();
            const embed = new EmbedBuilder()
                .setColor(client.settings.color)
                .addFields({
                name: translate(keys.AUTHOR),
                value: search.author ?? 'unknown',
                inline: true,
            })
                .addFields({
                name: translate(keys.REQUESTER),
                value: `${interaction.user}`,
                inline: true,
            });
            const duration = formatTime(Math.trunc(search.duration ?? 0), false);
            if (duration)
                embed.addFields({
                    name: translate(keys.DURATION),
                    value: duration,
                    inline: true,
                });
            if (client.settings.mode === 'development') {
                const execution = performanceMeters.get('interaction_' + interaction.id);
                const executionTime = execution?.stop();
                const finaltext = 'Internal execution time: ' + executionTime + 'ms';
                embed.setFooter({ text: finaltext });
            }
            embed.setThumbnail(`https://img.youtube.com/vi/${search.id}/maxresdefault.jpg`);
            embed.setDescription(`**${translate(keys.play.added, {
                song: `[${search.title}](https://www.youtube.com/watch?v=${search.id})`,
            })}** <:pepeblink:967941236029788160>`);
            await interaction.editReply({ embeds: [embed] }).catch(logger.error);
        }
        catch (e) {
            logger.error(e);
            if (e.errors)
                logger.error(e.errors);
            interaction.editReply({
                content: translate(keys.GENERICERROR, {
                    inviteURL: client.officialServerURL,
                }),
            });
        }
        return true;
    }
    async getRecomended(player, user) {
        const client = player.guild.client;
        try {
            const home = await player.youtubei.music.getHomeFeed();
            const songs = home.sections?.[0];
            const song = songs.contents?.[randomInt(songs.contents.length)];
            return await client.music.search(song.name ?? 'music', user, 'Youtube');
        }
        catch (error) {
            logger.error(error);
            client.errorHandler.captureException(error);
            return undefined;
        }
    }
}
//# sourceMappingURL=play.js.map