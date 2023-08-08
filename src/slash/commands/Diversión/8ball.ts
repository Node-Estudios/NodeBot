import { ApplicationCommandOptionType, ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'
import Translator, { keys } from '../../../utils/Translator.js'

export default class ball extends Command {
    constructor () {
        super({
            name: '8ball',
            description: 'Ask the magic 8ball a question',
            cooldown: 5,
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'question',
                    description: 'The question to ask',
                    required: true,
                },
            ],
        })
    }

    override async run (interaction: ChatInputCommandInteraction) {
        const translate = Translator(interaction)
        const client = interaction.client as Client
        const question = interaction.options.getString('question', true)
        if (!question.endsWith('?')) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle(translate(keys.ERROREMBED) + ' <:error:897836005787308062>')
                        .setDescription(translate(keys.question_ball.no_question))
                        .setFooter({
                            text: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
                        }),
                ],
            })
        }

        return await interaction.reply({
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
