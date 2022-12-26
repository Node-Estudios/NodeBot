import { CommandInteraction, MessageEmbed } from 'discord.js'
import Command from '../../../structures/Command.js'
import client from '../../../bot.js'

export default class ball extends Command {
    constructor() {
        super({
            name: '8ball',
            description: 'Ask the magic 8ball a question',
            name_localizations: {
                'es-ES': 'ball',
            },
            description_localizations: {
                'es-ES': 'Pregunta al poderoso 8ball una pregunta',
            },
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: 'question',
                    description: 'The question to ask',
                    name_localizations: {
                        'es-ES': 'pregunta',
                    },
                    description_localizations: {
                        'es-ES': 'La pregunta a preguntar',
                    },
                    required: true,
                },
            ],
        })
    }
    override async run(interaction: CommandInteraction<'cached'>) {
        let respuesta = client.language.QUESTIONBALL[4]
        let question = interaction.options.getString('question', true)
        if (!question.endsWith('?'))
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle(client.language.ERROREMBED)
                        .setDescription(client.language.QUESTIONBALL[3])
                        .setFooter({
                            text: interaction.member.user.tag,
                            iconURL: interaction.member.displayAvatarURL({ format: 'png', dynamic: true }),
                        }),
                ],
            })

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setFields(
                        {
                            name: client.language.QUESTIONBALL[1],
                            value: question,
                        },
                        {
                            name: client.language.QUESTIONBALL[2],
                            value: respuesta[Math.floor(Math.random() * respuesta.length)],
                        },
                    )
                    .setColor(client.settings.color),
            ],
        }) //y que mande el embed
    }
}
