import { ApplicationCommandOptionType } from 'discord.js';
import EmbedBuilder from '#structures/EmbedBuilder.js';
import Command from '#structures/Command.js';
import Translator, { keys } from '#utils/Translator.js';
export default class avatar extends Command {
    constructor() {
        super({
            name: 'avatar',
            description: 'Send your avatar or the other user one!',
            cooldown: 5,
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: 'user',
                    description: 'The user to get the avatar of.',
                },
            ],
        });
    }
    async run(interaction) {
        const translate = Translator(interaction);
        const client = interaction.client;
        const member = interaction.options.getUser('user') ?? interaction.user;
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setImage(member.displayAvatarURL({ size: 4096 }))
                    .setFooter({ text: translate(keys.avatar, { user: member.toString() }) }),
            ],
        });
    }
}
//# sourceMappingURL=avatar.js.map