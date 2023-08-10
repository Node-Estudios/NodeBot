import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import Client from '#structures/Client.js'
import Command from '#structures/Command.js'
import Translator, { keys } from '#utils/Translator.js'

export default class serverinfo extends Command {
    constructor () {
        super({
            name: 'serverinfo',
            description: 'Get information about the server.',
            cooldown: 5,
            dm_permission: false,
        })
    }

    override async run (interaction: ChatInputCommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const translate = Translator(interaction)
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
            0: translate(keys.serverinfo.verification.no),
            1: translate(keys.serverinfo.verification.low),
            2: translate(keys.serverinfo.verification.medium),
            3: translate(keys.serverinfo.verification.high),
            4: translate(keys.serverinfo.verification.extreme),
        }

        const explicitContent = {
            0: translate(keys.serverinfo.explicit.disabled),
            1: translate(keys.serverinfo.explicit.members_without_role),
            2: translate(keys.serverinfo.explicit.all_members),
        }
        const role = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString())
        const boost = interaction.guild.premiumTier
        const emojis = interaction.guild.emojis.cache
        const boostcount = interaction.guild.premiumSubscriptionCount
        const [category, others] = interaction.guild.channels.cache.partition((c: any) => c.type === 'GUILD_CATEGORY')
        const [text, voice] = others.partition((c: any) => c.type === 'GUILD_TEXT')
        const [regular, animated] = emojis.partition(emoji => !emoji.animated)
        const banner = interaction.guild.bannerURL({ extension: 'gif', size: 4096 })
        const iconURL = interaction.guild.iconURL()
        const embed = new EmbedBuilder()
            .setColor(client.settings.color)
            .setThumbnail(iconURL)
            .setTimestamp()
            .setFooter({ text: interaction.guild.name, iconURL: iconURL ?? undefined })
            .setTitle(interaction.guild.name)
            .setFields(
                {
                    name: `<:Badge_PartneredServerOwner:970394871414259732> ${translate(keys.OWNER)}`,
                    value: `<@${interaction.guild.ownerId}>`,
                },
                {
                    name: `${translate(keys.ID)}`,
                    value: '```' + `${interaction.guild.id}` + '```',
                    inline: true,
                },
                {
                    name: `<:Members:970395202219049030> ${translate(keys.MEMBERS)}`,
                    value: '```' + `${interaction.guild.memberCount}` + '```',
                    inline: true,
                },
                {
                    name: `😀 ${translate(keys.serverinfo.emoji_count)} [${emojis.size}]`,
                    value: `<:pepeblink:967941236029788160> ${translate(keys.REGULAR)}: ${
                        regular.size
                    }\n<a:DJPeepo:969757766744944700> ${translate(keys.ANIMATED)}: ${animated.size}`,
                    inline: true,
                },
                {
                    name: `<:ticketblurple:893490671615361024> ${translate(keys.ROLES)}`,
                    value: '```' + `${role.length}` + '```',
                    inline: true,
                },
                {
                    name: `<:plus:893553167709655091> ${translate(keys.CHANNELS)} [${
                        interaction.guild.channels.cache.size
                    }]`,
                    value: `<:List_Bottom_Large:970441521637769287> ${translate(keys.CATEGORIES)}: ${
                        category.size
                    }\n<:textchannelblurple:893490117451333632> ${translate(keys.TEXT)}: ${
                        text.size
                    }\n<:blurple_voicechannel:970441881144156190> ${translate(keys.VOICE)}: ${
                        voice.size
                    }`,
                    inline: true,
                },
                {
                    name: `📆 ${translate(keys.CREATED_AT)}`,
                    value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:d>`,
                    inline: true,
                },
                {
                    name: `<:boost:893553167499948135> ${translate(keys.BOOSTERS)}`,
                    value: '```' + `${boostcount}` + '```',
                    inline: true,
                },
                {
                    name: `<:money:893553167596421131> ${translate(keys.serverinfo.tier_level)}`,
                    value: '```' + (boost ? `${translate(keys.TIER)} ${boost}` : 'No') + '```',
                    inline: true,
                },
                {
                    name: `**${translate(keys.serverinfo.verification_level)}**`,
                    value: `${verification[interaction.guild?.verificationLevel]}`,
                },
                {
                    name: `**${translate(keys.serverinfo.explicit_filter)}**`,
                    value: '```' + explicitContent[interaction.guild?.explicitContentFilter] + '```',
                },
            )
            .setImage(banner)
        interaction.reply({
            embeds: [embed],
        })
    }
}
