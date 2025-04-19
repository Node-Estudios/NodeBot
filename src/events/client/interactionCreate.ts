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
    // Added space after run
    async run (client: Client, interaction: Interaction) {
        if (process.env.TESTINGGUILD)
            if (interaction.guild?.id !== process.env.TESTINGGUILD) return

        if (interaction.member?.user.bot) return
        // return false if something went wrong, true if everything was okey
        if (client.settings.debug === 'true' && interaction.type !== 2)
            // Corrected logger.debug call with parentheses for ?? and proper default
            logger.debug(
                'Interaction, type: ' +
                interaction.type +
                ' | ' +
                (interaction.guild?.name ?? 'DM') + // Correct: Use parentheses and a default
                ' | ' +
                interaction.user.username,
            ) // End of logger.debug call

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

    // Added space after processChatImputCommand
    async processChatImputCommand (interaction: ChatInputCommandInteraction) {
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
            const transaction = Sentry.startTransaction({
                op: cmd.name,
                name: 'Executed /' + cmd.name,
            })
            Sentry.setContext('user', interaction.user)
            Sentry.setContext('guild', interaction.guild)

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
                    const botMember = await interaction.guild?.members.fetchMe()
                    const missingPermissions = botMember?.permissions.missing(
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
            if (
                !cooldowns.canProced(
                    interaction.user.id,
                    interaction.commandName,
                )
            )
                return await interaction.reply({
                    content: `Debes esperar ${Math.round(
                        cooldowns.leftTime(
                            interaction.user.id,
                            interaction.commandName,
                        ) / 1000,
                    )} segundos para volver a ejecutar este comando`,
                })
            return await cmd
                .run(interaction)
                .catch(e => {
                    // Note: Consider adding the comma-dangle fix here if needed
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
                        ), // Consider adding trailing comma here if your eslint rule requires it
                    })
                })
                .finally(() => {
                    transaction.finish()
                    cooldowns.registerInteraction(
                        interaction.user.id,
                        interaction.commandName,
                    )
                    performanceMeters
                        .get('interaction_' + interaction.id)
                        ?.stop()
                    performanceMeters.delete('interaction_' + interaction.id)
                })
        } catch (e) {
            return logger.error(e)
        }
    }

    // Added space after processButtonInteraction
    async processButtonInteraction (interaction: ButtonInteraction) {
        logger.debug(
            `Button ${interaction.customId} pressed | ${interaction.user.username}`,
        )
        await buttons.cache
            .find(b => b.match(interaction.customId))
            ?.run(interaction)
            .catch(logger.error)
    }

    // Added space after processAutocompleteInteraction
    async processAutocompleteInteraction (interaction: AutocompleteInteraction) {
        autocomplete.registerInteraction(interaction.user.id, interaction.id)
        const respond = await autocomplete.cache
            .find(b => b.match(interaction.commandName))
            ?.run(interaction)
            .catch(logger.error)
        if (respond) autocomplete.removeInteraction(interaction.user.id)
    }

    // Added space after processModalSubmitInteraction
    async processModalSubmitInteraction (interaction: ModalSubmitInteraction) {
        await modals.cache
            .find(b => b.match(interaction.customId))
            ?.run(interaction)
            .catch(logger.error)
    }
}
