import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js';
import Command from '../../../structures/command';
import Client from '../../../structures/client';
import moment from 'moment';

export default class serverinfo extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'serverinfo',
            description: 'Get information about the server.',
            name_localizations: {
                'es-ES': 'serverinfo',
            },
            description_localizations: {
                'es-ES': 'Obtener información sobre el servidor.',
            },
            cooldown: 5,
        });
    }
    /**,
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async run(client: Client, interaction: CommandInteraction, args: any) {
        // try {
        let region = {
            europe: 'Europa',
            brazil: 'Brasil',
            hongkong: 'Hong Kong',
            japan: 'Japón',
            russia: 'Rusia',
            singapore: 'Singapur',
            southafrica: 'Sudáfrica',
            sydney: 'Sydney',
            'us-central': 'Central US',
            'us-east': 'Este US',
            'us-south': 'Sur US',
            'us-west': 'Oeste US',
            'vip-us-east': 'VIP US Este',
            'eu-central': 'Europa Central',
            'eu-west': 'Europa Oeste',
            london: 'London',
            amsterdam: 'Amsterdam',
            india: 'India',
        };

        let verification = {
            NONE: client.language.SERVERINFO[1],
            LOW: client.language.SERVERINFO[2],
            MEDIUM: client.language.SERVERINFO[3],
            HIGH: client.language.SERVERINFO[4],
            VERY_HIGH: client.language.SERVERINFO[5],
        };

        let explicitContent = {
            DISABLED: client.language.SERVERINFO[6],
            MEMBERS_WITHOUT_ROLES: client.language.SERVERINFO[7],
            ALL_MEMBERS: client.language.SERVERINFO[8],
        };
        const guild = interaction.guild!;
        // const channel = guild.channels.cache
        //   .sort((a, b) => b.position - a.position)
        //   .map((role) => role.toString())
        //   .slice(0, -1);
        const members = guild.members.cache;
        const role = guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);
        const boost = guild.premiumTier;
        const emojis = interaction.guild!.emojis.cache;
        const boostcount = guild.premiumSubscriptionCount;
        const bots = members.filter(member => member.user.bot).size;
        const humans = members.filter(member => !member.user.bot).size;
        const create = moment(interaction.guild!.createdTimestamp).format('DD-MM-YYYY');
        const banner = guild.banner;

        let iconURL = guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : undefined;
        let embed = new MessageEmbed().setColor(process.env.bot1Embed_Color as ColorResolvable);
        if (iconURL) embed.setThumbnail(iconURL).setTimestamp();
        if (iconURL)
            embed
                .setFooter(guild.name, iconURL)
                .setTitle(guild.name)
                .addField(
                    `<:Badge_PartneredServerOwner:970394871414259732> ${client.language.SERVERINFO[9]}`,
                    `<@${guild.ownerId}>`,
                )
                .addField(client.language.SERVERINFO[10], '```' + `${guild.id}` + '```', true)
                .addField(
                    `<:Members:970395202219049030> ${client.language.SERVERINFO[11]}`,
                    '```' + `${guild.memberCount}` + '```',
                    true,
                )
                .addField(
                    `😀 ${client.language.SERVERINFO[12]} [${emojis.size}]`,
                    `<:pepeblink:967941236029788160> ${client.language.SERVERINFO[13]}: ${
                        emojis.filter(emoji => !emoji.animated).size
                    }\n<a:DJPeepo:969757766744944700> ${client.language.SERVERINFO[14]}: ${
                        emojis.filter(emoji => (emoji.animated ? true : false)).size
                    }`,
                    true,
                )
                .addField(
                    `<:ticketblurple:893490671615361024> ${client.language.SERVERINFO[15]}`,
                    '```' + `${role.length}` + '```',
                    true,
                )
                .addField(
                    `<:plus:893553167709655091> ${client.language.SERVERINFO[16]} [${guild.channels.cache.size}]`,
                    `<:List_Bottom_Large:970441521637769287> ${client.language.SERVERINFO[17]}: ${
                        guild.channels.cache.filter(x => x.type === 'GUILD_CATEGORY').size
                    }\n<:textchannelblurple:893490117451333632> ${client.language.SERVERINFO[18]}: ${
                        guild.channels.cache.filter(x => x.type === 'GUILD_TEXT').size
                    }\n<:blurple_voicechannel:970441881144156190> ${client.language.SERVERINFO[19]}: ${
                        guild.channels.cache.filter(x => x.type === 'GUILD_VOICE').size
                    }`,
                    true,
                )
                .addField(`📆 ${client.language.SERVERINFO[20]}`, '```' + `${create}` + '```', true)
                .addField(
                    `<:boost:893553167499948135> ${client.language.SERVERINFO[21]}`,
                    '```' + `${boostcount}` + '```',
                    true,
                )
                .addField(
                    `<:money:893553167596421131> ${client.language.SERVERINFO[22]}`,
                    `${boost ? '```' + `${client.language.SERVERINFO[23]} ${boost}` + '```' : '```' + `No` + '```'}`,
                    true,
                )
                .addField(`**${client.language.SERVERINFO[25]}**`, `${verification[guild.verificationLevel]}`)
                .addField(
                    `**${client.language.SERVERINFO[26]}**`,
                    '```' + `${explicitContent[guild.explicitContentFilter]}` + '```',
                );
        if (iconURL) embed.setImage(iconURL);
        interaction.editReply({
            embeds: [embed],
        });
        //   } catch (e) {
        //     console.error(e);
        //     message.channel.send({
        //       embeds: [
        //         new Discord.MessageEmbed()
        //         .setColor("RED")
        //         .setTitle(client.language.ERROREMBED)
        //         .setDescription(client.language.fatal_error)
        //         .setFooter(message.author.username, message.author.avatarURL())
        //       ]
        //     });
        //     webhookClient.send(
        //       `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
        //     );
        //     try {
        //       message.author
        //         .send(
        //           "Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>"
        //         )
        //         .catch(e);
        //     } catch (e) { }
        //   }
    }
}

function trimArray(arr: Array<any>, maxLen = 10) {
    if (arr.length > maxLen) {
        const len = arr.length - maxLen;
        arr = arr.slice(0, maxLen);
        arr.push(`${len} more...`);
    }
    return arr;
}
