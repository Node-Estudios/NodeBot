import autocomplete from '#cache/autocomplete.js'
import buttons from '#cache/buttons.js'
import commands from '#cache/commands.js'
import performanceMeters from '#cache/performanceMeters.js'
import Client from '#structures/Client.js'
import logger from '#utils/logger.js'
import { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, Interaction, ModalSubmitInteraction } from 'discord.js'
import { Timer as PerformanceMeter } from '../../handlers/performanceMeter.js'
import { BaseEvent } from '../../structures/Events.js'
import modals from '#cache/modals.js'

export class interactionCreate extends BaseEvent {
    async run (client: Client, interaction: Interaction) {
        if (process.env.TESTINGGUILD) {
            if (interaction.guild?.id !== process.env.TESTINGGUILD) return
        }
        if (interaction.member?.user.bot) return
        // return false if something went wrong, true if everything was okey
        if (client.settings.debug === 'true' && interaction.type !== 2) { logger.debug('Interaction, type: ' + interaction.type + ' | ' + interaction.guild?.name ?? 'No guild' + ' | ' + interaction.user.username) }
        if (!client.isReady()) return // <-- return statement here

        if (interaction.isChatInputCommand()) return await this.processChatImputCommand(interaction)
        else if (interaction.isButton()) return await this.processButtonInteraction(interaction)
        else if (interaction.isAutocomplete()) return await this.processAutocompleteInteraction(interaction)
        else if (interaction.isModalSubmit()) return await this.processModalSubmitInteraction(interaction)
    }

    async processChatImputCommand (interaction: ChatInputCommandInteraction) {
        try {
            performanceMeters.set('interaction_' + interaction.id, new PerformanceMeter())
            performanceMeters.get('interaction_' + interaction.id).start()
            const cmd = commands.getCache().find(c => c.name === interaction.commandName)
            if (!cmd) return
            if (interaction.guild && cmd?.only_dm) return // <-- return statement here

            logger.command(`Comando ${cmd.name} ejecutado | ${interaction.user.username}`)

            if (cmd.permissions) {
                // Check if the command is only for devs
                if (cmd.permissions.dev && !(interaction.client as Client).devs.includes(interaction.user.id)) {
                    return await interaction.reply({
                        content: 'Comando exclusivo para devs',
                        ephemeral: true,
                    })
                }
                // Check if the bot has the needed permissions to run the command
                if (cmd.permissions.botPermissions) {
                    const botMember = await interaction.guild?.members.fetchMe()
                    const missingPermissions = botMember?.permissions.missing(cmd.permissions.botPermissions)

                    // If there are missing permissions, return an error message
                    if (missingPermissions?.length) {
                        return await interaction.reply({
                            content: `No tengo los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(
                                ', ',
                            )}**`,
                            ephemeral: true,
                        })
                    }
                }

                // TODO: Add COOLDOWN functionality
            }
            await cmd.run(interaction).catch(e => {
                logger.error(e, '\x1b[33mCommand Info\x1b[0m', {
                    cmd: cmd.name,
                    options: JSON.stringify(interaction.options.data, (key, value) => {
                        if (key === 'client') return undefined
                        if (key === 'channel') return undefined
                        if (key === 'guild') return undefined
                        if (key === 'user') return undefined
                        if (key === 'member') return undefined
                        if (key === 'role') return undefined
                        return value
                    }),
                })
                interaction.reply({
                    content: 'Ha ocurrido un error al ejecutar el comando, por favor, intenta de nuevo más tarde',
                    ephemeral: true,
                })
            })
            await performanceMeters.get('interaction_' + interaction.id)?.stop() // the ping command stop the process
            return performanceMeters.delete('interaction_' + interaction.id)
        } catch (e) {
            return logger.error(e)
        }
    }

    async processButtonInteraction (interaction: ButtonInteraction) {
        logger.debug(`Button ${interaction.customId} pressed | ${interaction.user.username}`)
        buttons.getCache().filter(b => b.match(interaction.customId)).map(async i => await i.run(interaction).catch(logger.error))
    }

    async processAutocompleteInteraction (interaction: AutocompleteInteraction) {
        autocomplete.getCache().filter(b => b.match(interaction.commandName)).map(async i => await i.run(interaction).catch(logger.error))
    }

    async processModalSubmitInteraction (interaction: ModalSubmitInteraction) {
        modals.getCache().filter(b => b.match(interaction.customId)).map(async i => await i.run(interaction).catch(logger.error))
    }
}
