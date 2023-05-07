import { interactionCommandExtend } from '../../../events/client/interactionCreate.js'
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'

export default class reboot extends Command {
    constructor() {
        super({
            name: 'reboot',
            description: 'Reboot a shard or all shards.',
            permissions: {
                dev: true,
            },
            options: [
                {
                    type: 3,
                    name: 'choice',
                    description: 'Choice to reboot all shards or a shard.',
                    name_localizations: {
                        'es-ES': 'elección',
                    },
                    description_localizations: {
                        'es-ES': 'Reiniciar una o todas las shards.',
                    },
                    required: true,
                    choices: [
                        {
                            name: 'all',
                            value: 'all',
                        },
                        {
                            name: 'shard',
                            value: 'shard',
                        },
                    ],
                },
                {
                    type: 10,
                    name: 'shard',
                    description: 'The Shard to reboot',
                    required: false,
                },
            ],
        })
    }
    override async run(interaction: interactionCommandExtend) {
        //TODO: Change reboot system
        const client = interaction.client as Client
        const choice = interaction.options.getString('choice', true)
        if (choice === 'all') {
            await interaction.reply('Reiniciando todas las shards...')
            client.cluster.send({ type: 'reboot', shard: 'all' })
        } else if (choice === 'shard') {
            await interaction.reply(`Reinciando Shard ${interaction.options.getString('shard')}...`)
            // TODO: Revisar si shard es opcional en el send
            client.cluster.send({ type: 'reboot', shard: interaction.options.getNumber('shard') })
        }
    }
}
