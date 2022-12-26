import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js'
import Command from '../../../structures/Command.js'
import client from '../../../bot.js'

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

    override async run(interaction: CommandInteraction<'cached'>) {
        const args = interaction.options.getString('account', true)
        const account = await fetch(`https://api.github.com/users/${args[0]}`, {
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
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle(client.language.ERROREMBED)
                        .setDescription(client.language.INSTAGRAM[13])
                        .setFooter({
                            text: interaction.user.username + '#' + interaction.user.discriminator,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
            })

        const embed = new MessageEmbed()
            .setDescription('')
            .setColor(process.env.bot1Embed_Color as ColorResolvable)
            .setThumbnail(account.avatar_url)
        if (account.name)
            embed.addFields({ name: client.language.GITHUB[2].toString(), value: account.name.toString() })
        if (account.type)
            embed.addFields({ name: client.language.GITHUB[3].toString(), value: account.type.toString() })
        if (account.company)
            embed.addFields({ name: client.language.GITHUB[4].toString(), value: account.company.toString() })
        if (account.blog)
            embed.addFields({ name: client.language.GITHUB[5].toString(), value: account.blog.toString() })
        if (account.location)
            embed.addFields({ name: client.language.GITHUB[6].toString(), value: account.location.toString() })
        if (account.email)
            embed.addFields({ name: client.language.GITHUB[7].toString(), value: account.email.toString() })
        if (account.bio) embed.addFields({ name: client.language.GITHUB[8].toString(), value: account.bio.toString() })
        if (account.twitter_username)
            embed.addFields({ name: client.language.GITHUB[9].toString(), value: account.twitter_username.toString() })
        if (account.public_repos)
            embed.addFields({ name: client.language.GITHUB[10].toString(), value: account.public_repos.toString() })
        if (account.followers)
            embed.addFields({ name: client.language.GITHUB[11].toString(), value: account.followers.toString() })

        interaction.reply({
            embeds: [embed],
        })
    }
}
