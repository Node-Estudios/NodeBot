import { ApplicationCommandOptionType, Colors, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js'
import Translator, { keys } from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'

export default class github extends Command {
    constructor () {
        super({
            name: 'github',
            description: 'Show Information about a Github Account.',
            cooldown: 5,
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'account',
                    description: 'Account to show information about.',
                    name_localizations: {
                        'es-ES': 'cuenta',
                        'en-US': 'account',
                    },
                    description_localizations: {
                        'es-ES': 'Cuenta para mostrar la información.',
                        'en-US': 'Account to show information about.',
                    },
                    required: true,
                },
            ],
        })
    }

    override async run (interaction: ChatInputCommandInteraction) {
        const translate = Translator(interaction)
        const client = interaction.client as Client
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
            .then(async r => await r.json())
            .catch(() => null)

        if (!account?.id) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle(translate(keys.ERROREMBED) + ' <:error:897836005787308062>')
                        .setDescription(translate(keys.github.unknow))
                        .setFooter({
                            text: interaction.user.username + '#' + interaction.user.discriminator,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
            })
        }

        const embed = new EmbedBuilder().setThumbnail(account.avatar_url).setColor(client.settings.color)
        if (account.name) { embed.addFields({ name: `${translate(keys.github.name)}`, value: account.name.toString(), inline: true }) }
        if (account.type) { embed.addFields({ name: `${translate(keys.github.account)}`, value: account.type.toString(), inline: true }) }
        if (account.company) { embed.addFields({ name: `${translate(keys.github.organization)}`, value: account.company.toString(), inline: true }) }
        if (account.blog) { embed.addFields({ name: `${translate(keys.github.link)}`, value: account.blog.toString(), inline: true }) }
        if (account.location) { embed.addFields({ name: `${translate(keys.github.location)}`, value: account.location.toString(), inline: true }) }
        if (account.email) { embed.addFields({ name: `${translate(keys.github.email)}`, value: account.email.toString(), inline: true }) }
        if (account.public_repos) { embed.addFields({ name: `${translate(keys.github.repositories)}`, value: account.public_repos.toString(), inline: true }) }
        if (account.followers) { embed.addFields({ name: `${translate(keys.github.followers)}`, value: account.followers.toString(), inline: true }) }
        if (account.twitter_username) {
            embed.addFields({
                name: `${translate(keys.github.twitter)}`,
                value: account.twitter_username.toString(),
                inline: true,
            })
        }
        if (account.bio) embed.addFields({ name: `${translate(keys.github.biography)}`, value: account.bio.toString() })

        return await interaction.reply({
            embeds: [embed],
        })
    }
}
