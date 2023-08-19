import Command from '#structures/Command.js';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
export default class Eval extends Command {
    constructor() {
        super({
            name: 'eval',
            description: 'Evaluate code',
            permissions: {
                dev: true,
            },
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'code',
                    description: 'The code to evaluate',
                    required: true,
                },
            ],
        });
    }
    async run(interaction) {
        const client = interaction.client;
        if (!client.devs.includes(interaction.user.id))
            return await interaction.reply('Sorry, you are not a developer.');
        const code = interaction.options.getString('code', true);
        try {
            const evaled = await eval(code);
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Eval')
                        .setFields({
                        name: 'Input',
                        value: `\`\`\`js\n${code}\`\`\``,
                    })
                        .setDescription(`\`\`\`js\n${evaled}\`\`\``),
                ],
                ephemeral: true,
            });
        }
        catch (error) {
            return await interaction.reply({
                embeds: [new EmbedBuilder()
                        .setTitle('Eval')
                        .setFields({
                        name: 'Input',
                        value: `\`\`\`js\n${code}\`\`\``,
                    })
                        .setDescription(`\`\`\`js\n${error}\`\`\``)],
                ephemeral: true,
            });
        }
    }
}
//# sourceMappingURL=eval.js.map