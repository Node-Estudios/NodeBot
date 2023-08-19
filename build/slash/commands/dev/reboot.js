import { ApplicationCommandOptionType } from 'discord.js';
import Command from '#structures/Command.js';
import Translator, { keys } from '#utils/Translator.js';
import logger from '#utils/logger.js';
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
                    type: ApplicationCommandOptionType.Integer,
                    name: 'shard',
                    description: 'The Shard to reboot',
                    required: false,
                },
            ],
        });
    }
    async run(interaction) {
        const client = interaction.client;
        try {
            const translate = Translator(interaction);
            const shard = interaction.options.getNumber('shard');
            if (!shard) {
                await interaction.reply(translate(keys.reboot.all));
                return await client.cluster.send({ type: 'reboot', shard: 'all' });
            }
            await interaction.reply(translate(keys.reboot.shard, { shard }));
            await client.cluster.send({ type: 'reboot', shard });
        }
        catch (error) {
            logger.error(error);
            client.errorHandler.captureException(error);
        }
    }
}
//# sourceMappingURL=reboot.js.map