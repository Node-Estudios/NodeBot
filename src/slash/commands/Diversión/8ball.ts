import { MessageEmbed } from 'discord.js'
import { interactionCommandExtend } from '../../../events/client/interactionCreate.js'
import langFile from '../../../lang/index.json' assert { type: 'json' }
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'

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
    async run(interaction: interactionCommandExtend, args: any[]) {
        const language = await import('../lang/' + langFile.find(l => l.nombre == interaction.language)?.archivo, { assert: { type: "json" } })
        const client = interaction.client as Client
        let respuesta = language.QUESTIONBALL[4]
        let question = interaction.options.getString('question', true)
        if (!question.endsWith('?'))
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle(language.ERROREMBED)
                        .setDescription(language.QUESTIONBALL[3])
                        .setFooter({
                            text: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL({ format: 'png', dynamic: true }),
                        }),
                ],
            })

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setFields(
                        {
                            name: language.QUESTIONBALL[1],
                            value: question,
                        },
                        {
                            name: language.QUESTIONBALL[2],
                            value: respuesta[Math.floor(Math.random() * respuesta.length)],
                        },
                    )
                    .setColor(client.settings.color),
            ],
        }) //y que mande el embed
    }
}
