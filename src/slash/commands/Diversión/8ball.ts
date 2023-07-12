import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
import Translator from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'
import { keys } from '../../../utils/locales.js'
import { EmbedBuilder } from 'discord.js'

export default class ball extends Command {
    constructor() {
        super({
            name: '8ball',
            description: 'Ask the magic 8ball a question',
            name_localizations: {
                'es-ES': 'ball',
                'en-US': '8ball',
            },
            description_localizations: {
                'es-ES': 'Pregunta al poderoso 8ball una pregunta',
                'en-US': 'Ask the magic 8ball a question',
            },
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: 'question',
                    description: 'The question to ask',
                    name_localizations: {
                        'es-ES': 'pregunta',
                        'en-US': 'question',
                    },
                    description_localizations: {
                        'es-ES': 'La pregunta a preguntar',
                        'en-US': 'The question to ask',
                    },
                    required: true,
                },
            ],
        })
    }
    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        const translate = Translator(interaction)
        const client = interaction.client as Client
        let question = interaction.options.getString('question', true)
        if (!question.endsWith('?'))
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setTitle(translate(keys.ERROREMBED))
                        .setDescription(translate(keys.question_ball.no_question))
                        .setFooter({
                            text: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
                        }),
                ],
            })

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setFields(
                        {
                            name: translate(keys.question_ball.question),
                            value: question,
                        },
                        {
                            name: translate(keys.question_ball.response),
                            value: translate('question_ball.possibles.' + Math.floor(Math.random() * 13)),
                        },
                    )
                    .setColor(client.settings.color),
            ],
        })
    }
}
