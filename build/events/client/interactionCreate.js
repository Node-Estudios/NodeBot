import autocomplete from '#cache/autocompletes.js';
import buttons from '#cache/buttons.js';
import commands from '#cache/commands.js';
import cooldowns from '#cache/cooldowns.js';
import modals from '#cache/modals.js';
import performanceMeters from '#cache/performanceMeters.js';
import logger from '#utils/logger.js';
import * as Sentry from '@sentry/node';
import { PerformanceMeter } from '../../handlers/performanceMeter.js';
import { BaseEvent } from '../../structures/Events.js';
export class interactionCreate extends BaseEvent {
    async run(client, interaction) {
        if (process.env.TESTINGGUILD)
            if (interaction.guild?.id !== process.env.TESTINGGUILD)
                return;
        if (interaction.member?.user.bot)
            return;
        if (client.settings.debug === 'true' && interaction.type !== 2)
            logger.debug('Interaction, type: ' +
                interaction.type +
                ' | ' +
                interaction.guild?.name ??
                'No guild' + ' | ' + interaction.user.username);
        if (!client.isReady())
            return;
        if (interaction.isChatInputCommand())
            return await this.processChatImputCommand(interaction);
        else if (interaction.isButton())
            return await this.processButtonInteraction(interaction);
        else if (interaction.isAutocomplete())
            return await this.processAutocompleteInteraction(interaction);
        else if (interaction.isModalSubmit())
            return await this.processModalSubmitInteraction(interaction);
    }
    async processChatImputCommand(interaction) {
        try {
            performanceMeters.set('interaction_' + interaction.id, new PerformanceMeter());
            performanceMeters.get('interaction_' + interaction.id)?.start();
            const cmd = commands.cache.find(c => c.name === interaction.commandName);
            if (!cmd)
                return;
            if (interaction.guild && cmd?.only_dm)
                return;
            const transaction = Sentry.startTransaction({
                op: cmd.name,
                name: 'Executed /' + cmd.name,
            });
            Sentry.setContext('user', interaction.user);
            Sentry.setContext('guild', interaction.guild);
            logger.command(`Comando ${cmd.name} ejecutado | ${interaction.user.username}`);
            if (cmd.permissions) {
                if (cmd.permissions.dev &&
                    !interaction.client.devs.includes(interaction.user.id))
                    return await interaction.reply({
                        content: 'Comando exclusivo para devs',
                        ephemeral: true,
                    });
                if (cmd.permissions.botPermissions) {
                    const botMember = await interaction.guild?.members.fetchMe();
                    const missingPermissions = botMember?.permissions.missing(cmd.permissions.botPermissions);
                    if (missingPermissions?.length)
                        return await interaction.reply({
                            content: `No tengo los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(', ')}**`,
                            ephemeral: true,
                        });
                }
            }
            if (!cooldowns.canProced(interaction.user.id, interaction.commandName))
                return await interaction.reply({
                    content: `Debes esperar ${Math.round(cooldowns.leftTime(interaction.user.id, interaction.commandName) / 1000)} segundos para volver a ejecutar este comando`,
                });
            return await cmd
                .run(interaction)
                .catch(e => {
                logger.error(e, '\x1b[33mCommand Info\x1b[0m', {
                    cmd: cmd.name,
                    options: JSON.stringify(interaction.options.data, (key, value) => ![
                        'client',
                        'channel',
                        'guild',
                        'user',
                        'member',
                        'role',
                    ].includes(key)
                        ? value
                        : undefined, 4),
                });
            })
                .finally(() => {
                transaction.finish();
                cooldowns.registerInteraction(interaction.user.id, interaction.commandName);
                performanceMeters
                    .get('interaction_' + interaction.id)
                    ?.stop();
                performanceMeters.delete('interaction_' + interaction.id);
            });
        }
        catch (e) {
            return logger.error(e);
        }
    }
    async processButtonInteraction(interaction) {
        logger.debug(`Button ${interaction.customId} pressed | ${interaction.user.username}`);
        await buttons.cache
            .find(b => b.match(interaction.customId))
            ?.run(interaction)
            .catch(logger.error);
    }
    async processAutocompleteInteraction(interaction) {
        autocomplete.registerInteraction(interaction.user.id, interaction.id);
        const respond = await autocomplete.cache
            .find(b => b.match(interaction.commandName))
            ?.run(interaction)
            .catch(logger.error);
        if (respond)
            autocomplete.removeInteraction(interaction.user.id);
    }
    async processModalSubmitInteraction(interaction) {
        await modals.cache
            .find(b => b.match(interaction.customId))
            ?.run(interaction)
            .catch(logger.error);
    }
}
//# sourceMappingURL=interactionCreate.js.map