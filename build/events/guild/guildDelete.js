import { WebhookClient } from 'discord.js';
import EmbedBuilder from '#structures/EmbedBuilder.js';
import { BaseEvent } from '../../structures/Events.js';
export default class guildCreate extends BaseEvent {
    async run(client, guild) {
        if (!process.env.GUILDWEBHOOKURL)
            return;
        new WebhookClient({ url: process.env.GUILDWEBHOOKURL }).send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setDescription(`<a:redarrow:969932619229855754> **${guild.name}** (-${guild.memberCount})`),
            ],
        });
    }
}
//# sourceMappingURL=guildDelete.js.map