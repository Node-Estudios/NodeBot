import { CommandInteraction } from 'discord.js';
import Client from '../../../structures/client';

import Command from '../../../structures/command';

export default class reboot extends Command {
    constructor(client: Client) {
        super(client, {
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
                    required: false,
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
        });
    }
    async run(client: Client, interaction: CommandInteraction, args: any) {
        if (!interaction.options.getString('choice') || interaction.options.getString('choice') == 'all') {
            await interaction.editReply({ content: 'Reiniciando todas las shards...', embeds: [] });
            client.cluster.send({ type: 'reboot', shard: 'all' });
        } else if (!interaction.options.getString('choice') || interaction.options.getString('choice') == 'shard') {
            await interaction.editReply({
                content: `Reinciando Shard ${interaction.options.getString('shard')}...`,
                embeds: [],
            });
            client.cluster.send({ type: 'reboot', shard: interaction.options.getNumber('shard') });
        } else {
            await interaction.reply('Invalid argument. Please specify a shard or "all".');
        }
    }
}
