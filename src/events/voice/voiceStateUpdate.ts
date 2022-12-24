import { ColorResolvable, MessageEmbed, TextChannel } from 'discord.js';
import client from '../../bot.js';
import { Events } from '../../structures/event.js';

module.exports = class voiceStateUpdate extends Events {
    constructor(file: any, options: any) {
        super(file, options);
    }
    async run(oldState, newState) {
        if ((client as any).manager) {
            const player = (client as any).manager.players.get(oldState.guild.id);

            if (!player || player.stayInVoice) return;
            if (!newState.guild.me.voice.channel || !oldState.guild.me.voice.channel) return player.destroy(true);
            if (newState.guild.me.voice.channel.members.filter(member => !member.user.bot).size >= 1) {
                if (!player.waitingMessage && player.stayInVc) player.pause(false);
                if (player.waitingMessage) {
                    player.waitingMessage.delete();
                    player.waitingMessage = null;
                    player.pause(false);
                }
                return;
            }
            if (!player || player.waitingMessage) return;
            if (player.stayInVc == true) {
                player.pause(true);
            }
            if (player.stayInVc == false || !player.stayInVc) {
                const embed = new MessageEmbed()
                    .setDescription(
                        `${client.language.VOICESTATEUPDATE[1]}${oldState.guild.me.voice.channel.id}${
                            client.language.VOICESTATEUPDATE[2]
                        }${300000 / 60 / 1000}${client.language.VOICESTATEUPDATE[3]}`,
                    )
                    .setColor(process.env.bot1Embed_Color as ColorResolvable);
                const msg = await (client.channels.cache.get(player.textChannel) as TextChannel).send({
                    embeds: [embed],
                });
                player.waitingMessage = msg;
                player.previouslyPaused = player.paused;
                player.pause(true);

                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(300000);

                if (!player.waitingMessage) return;
                if (!newState.guild.me.voice.channel) return;
                const voiceMembers = newState.guild.me.voice.channel.members.filter(member => !member.user.bot).size;
                if (!voiceMembers || voiceMembers == 0) {
                    let newPlayer = (client as any).manager.players.get(newState.guild.id);
                    if (player) {
                        newPlayer.destroy(false);
                    } else {
                        newPlayer = await (client as any).manager.newPlayer(
                            oldState.guild,
                            oldState.guild.me.voice.channel,
                            player.textChannel,
                        );
                        await newPlayer.connect();
                        newPlayer.destroy(false);
                    }

                    const embed2 = new MessageEmbed()
                        .setDescription(
                            `${client.language.VOICESTATEUPDATE[4]}${oldState.guild.me.voice.channel.id}${client.language.VOICESTATEUPDATE[5]}`,
                        )
                        .setColor(process.env.bot1Embed_Color as ColorResolvable);
                    if (msg) {
                        return msg.edit({
                            embeds: [embed2],
                            content: null,
                        });
                    }
                } else return msg.delete();
            }
        }
    }
};
