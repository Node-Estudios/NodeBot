import EmbedBuilder from '#structures/EmbedBuilder.js';
import Command from '#structures/Command.js';
import Translator, { keys } from '#utils/Translator.js';
export default class help extends Command {
    constructor() {
        super({
            name: 'help',
            description: 'Show information about me.',
            cooldown: 5,
        });
    }
    async run(interaction) {
        const translate = Translator(interaction);
        const client = interaction.client;
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setDescription(translate(keys.help.presentation))
                    .addFields({
                    name: translate(keys.help.how_use),
                    value: `${translate(keys.help.how_use_answer)} \`/${interaction.commandName}\`.`,
                })
                    .addFields({
                    name: translate(keys.help.need_support),
                    value: translate(keys.help.need_support_answer, {
                        inviteURL: client.officialServerURL,
                    }),
                })
                    .addFields({
                    name: translate(keys.help.how_vote),
                    value: translate(keys.help.how_vote_answer),
                })
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTitle(translate(keys.help.title)),
            ],
        });
    }
}
//# sourceMappingURL=help.js.map