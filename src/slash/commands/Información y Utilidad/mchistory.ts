import { ApplicationCommandOptionType, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js'
import Translator, { keys } from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'

export default class mchistory extends Command {
    constructor () {
        super({
            name: 'mchistory',
            description: 'Show the history of a Minecraft account.',
            description_localizations: {
                'es-ES': 'Muesrta el historial de una cuenta de Minecraft.',
                'en-US': 'Show the history of a Minecraft account.',
            },
            cooldown: 5,
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'account',
                    description: 'The account to show the history of.',
                    name_localizations: {
                        'es-ES': 'cuenta',
                        'en-US': 'account',
                    },
                    description_localizations: {
                        'es-ES': 'La cuenta para mostrar el historial.',
                        'en-US': 'The account to show the history of.',
                    },
                    required: true,
                },
            ],
        })
    }

    override async run (interaction: ChatInputCommandInteraction) {
        const translate = Translator(interaction)
        const client = interaction.client as Client
        const res = await fetch(
            `https://mc-heads.net/minecraft/profile/${interaction.options.getString('account', true)}`,
        )
            .then(async r => await r.json())
            .catch(() => null)
        if (!res) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setTitle(translate(keys.ERROREMBED) + ' <:error:897836005787308062>')
                        .setDescription(translate(keys.mchistory.dont))
                        .setFooter({
                            text: interaction.user.username + '#' + interaction.user.discriminator,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
            })
        }

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(translate(keys.mchistory.names))
                    .setColor(client.settings.color)
                    .setFields(
                        res.name_history?.map((i: any) => ({
                            name: i.changedToAt ? parserTimeStamp(i.changedToAt) : translate(keys.mchistory.first),
                            value: i.name,
                        })) ?? [
                            {
                                name: translate(keys.mchistory.first),
                                value: res.name,
                            },
                        ],
                    )
                    .setTimestamp(),
            ],
        })
    }
}
function add_cero_day (numero: number) {
    if (numero < 10) return '0' + numero
    else return numero + ''
}

function parserTimeStamp (date: Date): string {
    date = new Date(date)
    return (
        add_cero_day(date.getDate()) +
        '-' +
        add_cero_day(date.getMonth() + 1) +
        '-' +
        add_cero_day(date.getFullYear()) +
        '  ' +
        add_cero_day(date.getHours()) +
        ':' +
        add_cero_day(date.getMinutes()) +
        ':' +
        add_cero_day(date.getSeconds())
    )
}
