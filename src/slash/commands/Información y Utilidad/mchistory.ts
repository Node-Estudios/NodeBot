import { CommandInteraction, MessageEmbed } from 'discord.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'

export default class mchistory extends Command {
    constructor() {
        super({
            name: 'mchistory',
            description: 'Show the history of a Minecraft account.',
            description_localizations: {
                'es-ES': 'Muesrta el historial de una cuenta de Minecraft.',
            },
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: 'account',
                    description: 'The account to show the history of.',
                    name_localizations: {
                        'es-ES': 'cuenta',
                    },
                    description_localizations: {
                        'es-ES': 'La cuenta para mostrar el historial.',
                    },
                    required: true,
                },
            ],
        })
    }

    override async run(interaction: CommandInteraction<'cached'>) {
        const client = interaction.client as Client
        const res = await fetch(
            `https://mc-heads.net/minecraft/profile/${interaction.options.getString('account', true)}`,
        )
            .then(r => r.json())
            .catch(() => null)
        if (!res)
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle(client.language.ERROREMBED)
                        .setDescription(client.language.MCHISTORY[3])
                        .setFooter({
                            text: interaction.user.username + '#' + interaction.user.discriminator,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
            })

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(client.language.MCHISTORY[4])
                    .setColor(client.settings.color)
                    .setFields(
                        res['name_history'].map((i: any) => ({
                            name: i['changedToAt'] ? parserTimeStamp(i['changedToAt']) : client.language.MCHISTORY[5],
                            value: i['name'],
                        })),
                    )
                    .setTimestamp(),
            ],
        })
    }
}
function add_cero_day(numero: number) {
    if (numero < 10) return '0' + numero
    else return numero + ''
}

function parserTimeStamp(date: Date): string {
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
