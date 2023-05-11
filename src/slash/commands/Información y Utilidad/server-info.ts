import { EmbedBuilder as EmbedBuilder } from 'discord.js'
import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'

export default class serverinfo extends Command {
    constructor() {
        super({
            name: 'serverinfo',
            description: 'Get information about the server.',
            name_localizations: {
                'es-ES': 'serverinfo',
            },
            description_localizations: {
                'es-ES': 'Obtener información sobre el servidor.',
            },
            cooldown: 5,
        })
    }

    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        const client = interaction.client as Client
        // try {
        // let region = {
        //     europe: 'Europa',
        //     brazil: 'Brasil',
        //     hongkong: 'Hong Kong',
        //     japan: 'Japón',
        //     russia: 'Rusia',
        //     singapore: 'Singapur',
        //     southafrica: 'Sudáfrica',
        //     sydney: 'Sydney',
        //     'us-central': 'Central US',
        //     'us-east': 'Este US',
        //     'us-south': 'Sur US',
        //     'us-west': 'Oeste US',
        //     'vip-us-east': 'VIP US Este',
        //     'eu-central': 'Europa Central',
        //     'eu-west': 'Europa Oeste',
        //     london: 'London',
        //     amsterdam: 'Amsterdam',
        //     india: 'India',
        // }

        const verification = {
            NONE: interaction.language.SERVERINFO[1],
            LOW: interaction.language.SERVERINFO[2],
            MEDIUM: interaction.language.SERVERINFO[3],
            HIGH: interaction.language.SERVERINFO[4],
            VERY_HIGH: interaction.language.SERVERINFO[5],
        }

        const explicitContent = {
            DISABLED: interaction.language.SERVERINFO[6],
            MEMBERS_WITHOUT_ROLES: interaction.language.SERVERINFO[7],
            ALL_MEMBERS: interaction.language.SERVERINFO[8],
        }
        // const channel = interaction.guild.channels.cache
        //   .sort((a, b) => b.position - a.position)
        //   .map((role) => role.toString())
        //   .slice(0, -1);
        const role = interaction.guild.roles.cache
            .sort((a: { position: number }, b: { position: number }) => b.position - a.position)
            .map((role: any) => role.toString())
        const boost = interaction.guild.premiumTier
        const emojis = interaction.guild.emojis.cache
        const boostcount = interaction.guild.premiumSubscriptionCount
        const [category, others] = interaction.guild.channels.cache.partition((c: any) => c.type === 'GUILD_CATEGORY')
        const [text, voice] = others.partition((c: any) => c.type === 'GUILD_TEXT')
        // const [bots, humans] = interaction.guild.members.cache.partition(m => m.user.bot)
        // const banner = interaction.guild.banner

        const iconURL = interaction.guild.iconURL() ?? ''
        const embed = new EmbedBuilder()
            .setColor(client.settings.color)
            .setThumbnail(iconURL)
            .setTimestamp()
            .setFooter({ text: interaction.guild.name, iconURL })
            .setTitle(interaction.guild.name)
            .setFields(
                {
                    name: `<:Badge_PartneredServerOwner:970394871414259732> ${interaction.language.SERVERINFO[9]}`,
                    value: `<@${interaction.guild.ownerId}>`,
                },
                {
                    name: interaction.language.SERVERINFO[10],
                    value: '```' + `${interaction.guild.id}` + '```',
                    inline: true,
                },
                {
                    name: `<:Members:970395202219049030> ${interaction.language.SERVERINFO[11]}`,
                    value: '```' + `${interaction.guild.memberCount}` + '```',
                    inline: true,
                },
                {
                    name: `😀 ${interaction.language.SERVERINFO[12]} [${emojis.size}]`,
                    value: `<:pepeblink:967941236029788160> ${interaction.language.SERVERINFO[13]}: ${
                        emojis.filter((emoji: any) => !emoji.animated).size
                    }\n<a:DJPeepo:969757766744944700> ${interaction.language.SERVERINFO[14]}: ${
                        emojis.filter((emoji: any) => (emoji.animated ? true : false)).size
                    }`,
                    inline: true,
                },
                {
                    name: `<:ticketblurple:893490671615361024> ${interaction.language.SERVERINFO[15]}`,
                    value: '```' + `${role.length}` + '```',
                    inline: true,
                },
                {
                    name: `<:plus:893553167709655091> ${interaction.language.SERVERINFO[16]} [${interaction.guild.channels.cache.size}]`,
                    value: `<:List_Bottom_Large:970441521637769287> ${interaction.language.SERVERINFO[17]}: ${category.size}\n<:textchannelblurple:893490117451333632> ${interaction.language.SERVERINFO[18]}: ${text.size}\n<:blurple_voicechannel:970441881144156190> ${interaction.language.SERVERINFO[19]}: ${voice.size}`,
                    inline: true,
                },
                {
                    name: `📆 ${interaction.language.SERVERINFO[20]}`,
                    value: '```' + `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:d>` + '```',
                    inline: true,
                },
                {
                    name: `<:boost:893553167499948135> ${interaction.language.SERVERINFO[21]}`,
                    value: '```' + `${boostcount}` + '```',
                    inline: true,
                },
                {
                    name: `<:money:893553167596421131> ${interaction.language.SERVERINFO[22]}`,
                    value: '```' + (boost ? `${interaction.language.SERVERINFO[23]} ${boost}` : 'No') + '```',
                    inline: true,
                },
                {
                    name: `**${interaction.language.SERVERINFO[25]}**`,
                    // @ts-ignore
                    value: `${verification[interaction.guild?.verificationLevel]}`,
                },
                {
                    name: `**${interaction.language.SERVERINFO[26]}**`,
                    //@ts-ignore
                    value: '```' + explicitContent[interaction.guild?.explicitContentFilter] + '```',
                },
            )
            .setImage(iconURL)
        interaction.reply({
            embeds: [embed],
        })
    }
}
