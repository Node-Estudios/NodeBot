import { ColorResolvable, EmbedBuilder as EmbedBuilder } from 'discord.js'
import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'

export default class github extends Command {
    constructor() {
        super({
            name: 'github',
            description: 'Show Information about a Github Account.',
            description_localizations: {
                'es-ES': 'Muestra información sobre una cuenta de Github.',
            },
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: 'account',
                    description: 'Account to show information about.',
                    name_localizations: {
                        'es-ES': 'cuenta',
                    },
                    description_localizations: {
                        'es-ES': 'Cuenta para mostrar la información.',
                    },
                    required: true,
                },
            ],
        })
    }
    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        const language = interaction.language
        const accountName = interaction.options.getString('account', true)
        const account = await fetch(`https://api.github.com/users/${accountName}`, {
            headers: {
                Accept: 'application/vnd.github.v3+json',
                scheme: 'https',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en,es-ES;q=0.9,es;q=0.8',
                'user-agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
            },
        })
            .then(r => r.json())
            .catch(() => null)

        if (!account?.id)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setTitle(language?.ERROREMBED)
                        .setDescription(language?.INSTAGRAM[13])
                        .setFooter({
                            text: interaction.user.username + '#' + interaction.user.discriminator,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
            })

        const embed = new EmbedBuilder().setThumbnail(account.avatar_url)
        if (account.name)
            embed.addFields({ name: `${language?.GITHUB[2]}`, value: account.name.toString(), inline: true })
        if (account.type)
            embed.addFields({ name: `${language?.GITHUB[3]}`, value: account.type.toString(), inline: true })
        if (account.company)
            embed.addFields({ name: `${language?.GITHUB[4]}`, value: account.company.toString(), inline: true })
        if (account.blog)
            embed.addFields({ name: `${language?.GITHUB[5]}`, value: account.blog.toString(), inline: true })
        if (account.location)
            embed.addFields({ name: `${language?.GITHUB[6]}`, value: account.location.toString(), inline: true })
        if (account.email)
            embed.addFields({ name: `${language?.GITHUB[7]}`, value: account.email.toString(), inline: true })
        if (account.public_repos)
            embed.addFields({ name: `${language?.GITHUB[10]}`, value: account.public_repos.toString(), inline: true })
        if (account.followers)
            embed.addFields({ name: `${language?.GITHUB[11]}`, value: account.followers.toString(), inline: true })
        if (account.twitter_username)
            embed.addFields({
                name: `${language?.GITHUB[9]}`,
                value: account.twitter_username.toString(),
                inline: true,
            })
        if (account.bio) embed.addFields({ name: `${language?.GITHUB[8]}`, value: account.bio.toString() })

        return interaction.reply({
            embeds: [embed],
        })
    }
}
