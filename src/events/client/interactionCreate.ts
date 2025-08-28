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
        if (client.settings.debug === 'true' && interaction.type !== 2)
            logger.debug(
                'Interaction, type: ' +
                    interaction.type +
                    ' | ' +
                    (interaction.guild?.name ?? 'No guild') +
                    ' | ' +
                    interaction.user.username,
            )
        if (!client.isReady()) return

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
            if (interaction.guild && cmd?.only_dm) return

            await Sentry.startSpan(
                {
                    op: cmd.name,
                    name: `Executed /${cmd.name}`,
                },
                async () => {
                    Sentry.setContext('user', {
                        id: interaction.user.id,
                        username: interaction.user.username,
                    })
                    Sentry.setContext('guild', {
                        id: interaction.guild?.id,
                        name: interaction.guild?.name,
                    })

                    logger.command(
                        `Comando ${cmd.name} ejecutado | ${interaction.user.username}`,
                    )

                    if (cmd.permissions) {
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

                        if (cmd.permissions.botPermissions) {
                            const botMember =
                                await interaction.guild?.members.fetchMe()
                            const missingPermissions =
                                botMember?.permissions.missing(
                                    cmd.permissions.botPermissions,
                                )

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

                    const result = await cmd
                        .run(interaction)
                        .catch(e => {
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
                            })
                        })
                        .finally(() => {
                            cooldowns.registerInteraction(
                                interaction.user.id,
                                interaction.commandName,
                            )
                            performanceMeters
                                .get('interaction_' + interaction.id)
                                ?.stop()
                            performanceMeters.delete(
                                'interaction_' + interaction.id,
                            )
                        })
                    return result
                },
            )
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

        // CAMBIO: Se busca un manejador que tenga una función 'match' y que coincida con el nombre del comando.
        // Esto evita que se ejecute un manejador de comandos por error.
        const handler = autocomplete.cache.find(
            b =>
                typeof b.match === 'function' &&
                b.match(interaction.commandName),
        )

        if (handler) {
            const respond = await handler.run(interaction).catch(logger.error)
            if (respond) autocomplete.removeInteraction(interaction.user.id)
        } else {
            // Si no se encuentra un manejador válido, respondemos con un array vacío para que la interacción no falle.
            if (!interaction.responded) {
                await interaction.respond([]).catch(() => {})
            }
        }
    }

    async processModalSubmitInteraction(interaction: ModalSubmitInteraction) {
        await modals.cache
            .find(b => b.match(interaction.customId))
            ?.run(interaction)
            .catch(logger.error)
    }
}
