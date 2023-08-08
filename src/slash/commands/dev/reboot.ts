import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js'
import Translator, { keys } from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import Client from '../../../structures/Client.js'

export default class reboot extends Command {
    constructor () {
        super({
            name: 'reboot',
            description: 'Reboot a shard or all shards.',
            permissions: {
                dev: true,
            },
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'choice',
                    description: 'Choice to reboot all shards or a shard.',
                    name_localizations: {
                        'es-ES': 'elección',
                        'en-US': 'choice',
                    },
                    description_localizations: {
                        'es-ES': 'Reiniciar una o todas las shards.',
                        'en-US': 'Reboot a shard or all shards.',
                    },
                    required: true,
                    choices: [
                        {
                            name: 'all',
                            name_localizations: {
                                'es-ES': 'todas',
                                'en-US': 'all',
                            },
                            value: 'all',
                        },
                        {
                            name: 'shard',
                            name_localizations: {
                                'es-ES': 'fragmento',
                                'en-US': 'shard',
                            },
                            value: 'shard',
                        },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: 'shard',
                    name_localizations: {
                        'es-ES': 'fragmento',
                        'en-US': 'shard',
                    },
                    description: 'The Shard to reboot',
                    description_localizations: {
                        'es-ES': 'El fragmento a reiniciar',
                        'en-US': 'The Shard to reboot',
                    },
                    required: false,
                },
            ],
        })
    }

    override async run (interaction: ChatInputCommandInteraction) {
        // TODO: Change reboot system
        const translate = Translator(interaction)
        const client = interaction.client as Client
        const choice = interaction.options.getString('choice', true)
        if (choice === 'all') {
            await interaction.reply(translate(keys.reboot.all))
            client.cluster.send({ type: 'reboot', shard: 'all' })
        } else if (choice === 'shard') {
            await interaction.reply(translate(keys.reboot.shard, {
                shard: interaction.options.getString('shard'),
            }))
            client.cluster.send({ type: 'reboot', shard: interaction.options.getNumber('shard') })
        }
    }
}
