import autocomplete from '#cache/autocompletes.js'
import buttons from '#cache/buttons.js'
import commands from '#cache/commands.js'
import cooldowns from '#cache/cooldowns.js'
import modals from '#cache/modals.js'
import performanceMeters from '#cache/performanceMeters.js'
import Client from '#structures/Client.js'
import logger from '#utils/logger.js'
import * as Sentry from '@sentry/node'
import {
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    Interaction,
    ModalSubmitInteraction,
} from 'discord.js'
import { PerformanceMeter } from '../../handlers/performanceMeter.js'
import { BaseEvent } from '../../structures/Events.js'

export class interactionCreate extends BaseEvent {
    async run(client: Client, interaction: Interaction) {
        if (process.env.TESTINGGUILD)
            if (interaction.guild?.id !== process.env.TESTINGGUILD) return

        if (interaction.member?.user.bot) return
        // return false if something went wrong, true if everything was okey
        if (client.settings.debug === 'true' && interaction.type !== 2)
            logger.debug(
                'Interaction, type: ' +
                    interaction.type +
                    ' | ' +
                    (interaction.guild?.name ?? 'No guild') +
                    ' | ' +
                    interaction.user.username,
            )
        if (!client.isReady()) return // <-- return statement here

        if (interaction.isChatInputCommand())
            return await this.processChatImputCommand(interaction)
        else if (interaction.isButton())
            return await this.processButtonInteraction(interaction)
        else if (interaction.isAutocomplete())
            return await this.processAutocompleteInteraction(interaction)
        else if (interaction.isModalSubmit())
            return await this.processModalSubmitInteraction(interaction)
    }

    async processChatImputCommand(interaction: ChatInputCommandInteraction) {
        try {
            performanceMeters.set(
                'interaction_' + interaction.id,
                new PerformanceMeter(),
            )
            performanceMeters.get('interaction_' + interaction.id)?.start()
            const cmd = commands.cache.find(
                c => c.name === interaction.commandName,
            )
            if (!cmd) return
            if (interaction.guild && cmd?.only_dm) return // <-- return statement here

            Sentry.setTag('command', interaction.isCommand() ? interaction.commandName : 'interaction')
            Sentry.setContext('interaction', {
                type: interaction.type,
                id: interaction.id,
                channelId: interaction.channelId,
                guildId: interaction.guildId,
            })
            
            Sentry.setContext('user', {
                id: interaction.user.id,
                username: interaction.user.username,
                discriminator: interaction.user.discriminator,
                bot: interaction.user.bot,
            })
            
            if (interaction.guild) {
                Sentry.setContext('guild', {
                    id: interaction.guild.id,
                    name: interaction.guild.name,
                    memberCount: interaction.guild.memberCount,
                    ownerId: interaction.guild.ownerId,
                })
            }

            logger.command(
                `Comando ${cmd.name} ejecutado | ${interaction.user.username}`,
            )

            if (cmd.permissions) {
                // Check if the command is only for devs
                if (
                    cmd.permissions.dev &&
                    !(interaction.client as Client).devs.includes(
                        interaction.user.id,
                    )
                )
                    return await interaction.reply({
                        content: 'Comando exclusivo para devs',
                        ephemeral: true,
                    })

                // Check if the bot has the needed permissions to run the command
                if (cmd.permissions.botPermissions) {
                    const botMember =
                        await interaction.guild?.members.fetchMe()
                    const missingPermissions =
                        botMember?.permissions.missing(
                            cmd.permissions.botPermissions,
                        )

                    // If there are missing permissions, return an error message
                    if (missingPermissions?.length)
                        return await interaction.reply({
                            content: `No tengo los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(
                                ', ',
                            )}**`,
                            ephemeral: true,
                        })
                }
            }
            if (!cooldowns.canProced(interaction.user.id, interaction.commandName)) {
                return await interaction.reply({
                    content: `Debes esperar ${Math.round(cooldowns.leftTime(interaction.user.id, interaction.commandName) / 1000)} segundos para volver a usar este comando`,
                    ephemeral: true
                });
            }

            try {
                await cmd.run(interaction);
            } catch (e) {
                logger.error(e, '\x1b[33mCommand Info\x1b[0m', {
                    cmd: cmd.name,
                    options: JSON.stringify(
                        interaction.options.data,
                        (key, value) =>
                            ![
                                'client',
                                'channel',
                                'guild',
                                'user',
                                'member',
                                'role',
                            ].includes(key)
                                ? value
                                : undefined,
                        4,
                    ),
                });
                Sentry.captureException(e);
            } finally {
                cooldowns.registerInteraction(
                    interaction.user.id,
                    interaction.commandName,
                );
                performanceMeters.get('interaction_' + interaction.id)?.stop();
                performanceMeters.delete('interaction_' + interaction.id);
            }
        } catch (e) {
            return logger.error(e)
        }
    }

    async processButtonInteraction(interaction: ButtonInteraction) {
        logger.debug(
            `Button ${interaction.customId} pressed | ${interaction.user.username}`,
        )
        await buttons.cache
            .find(b => b.match(interaction.customId))
            ?.run(interaction)
            .catch(logger.error)
    }

    async processAutocompleteInteraction(interaction: AutocompleteInteraction) {
        autocomplete.registerInteraction(interaction.user.id, interaction.id)
        const respond = await autocomplete.cache
            .find(b => b.match(interaction.commandName))
            ?.run(interaction)
            .catch(logger.error)
        if (respond) autocomplete.removeInteraction(interaction.user.id)
    }

    async processModalSubmitInteraction(interaction: ModalSubmitInteraction) {
        await modals.cache
            .find(b => b.match(interaction.customId))
            ?.run(interaction)
            .catch(logger.error)
    }
}
