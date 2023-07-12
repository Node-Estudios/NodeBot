import { ButtonInteraction, ChatInputCommandInteraction, Interaction } from 'discord.js'
import { Timer as performanceMeter } from '../../handlers/performanceMeter.js'
import performanceMeters from '../../cache/performanceMeters.js'
import { BaseEvent } from '../../structures/Events.js'
import Client from '../../structures/Client.js'
import commands from '../../cache/commands.js'
import buttons from '../../cache/buttons.js'
import logger from '../../utils/logger.js'

export class interactionCreate extends BaseEvent {
    
    async run(client: Client, interaction: Interaction) {
        if (interaction.member?.user.bot) return
        performanceMeters.set('interaction_' + interaction.id, new performanceMeter())
        performanceMeters.get('interaction_' + interaction.id).start()

        // return false if something went wrong, true if everything was okey
        if (client.settings.debug == 'true')
            logger.debug('Interaction Executed | ' + interaction.guild?.name ?? 'No guild' + ' | ' + interaction.user.username)
        if (!client.isReady()) return // <-- return statement here

        if (interaction.isChatInputCommand()) return this.processChatImputCommand(interaction)
        else if (interaction.isButton()) return this.processButtonInteraction(interaction)
    }

    async processChatImputCommand(interaction: ChatInputCommandInteraction) {
        try {
            const cmd = commands.getCache().find(c => c.name === interaction.commandName)
            if (!cmd) return
            if (interaction.guild && cmd?.only_dm) return // <-- return statement here

            logger.debug(`Comando ${cmd.name} ejecutado | ${interaction.user.username}`)
            
            if (cmd.permissions) {
                // Check if the command is only for devs
                if (cmd.permissions.dev && !(interaction.client as Client).devs.includes(interaction.user.id))
                    return interaction.reply({
                        content: 'Comando exclusivo para devs',
                        ephemeral: true,
                    })
                // Check if the bot has the needed permissions to run the command
                if (cmd.permissions.botPermissions) {
                    const botMember = await interaction.guild?.members.fetchMe()
                    const missingPermissions = botMember?.permissions.missing(cmd.permissions.botPermissions)

                    // If there are missing permissions, return an error message
                    if (missingPermissions?.length)
                        return interaction.reply({
                            content: `No tengo los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(
                                ', ',
                            )}**`,
                            ephemeral: true,
                        })
                }

                //TODO: Add COOLDOWN functionality
            }
            await cmd.run(interaction)
            await performanceMeters.get('interaction_' + interaction.id)?.stop() // the ping command stop the process
            performanceMeters.delete('interaction_' + interaction.id)
        } catch (e) {
            logger.debug(e)
        }
        return
    }

    async processButtonInteraction(interaction: ButtonInteraction) {
        logger.debug(`Button ${interaction.customId} pressed | ${interaction.user.username}`)
        buttons.getCache().filter(b => b.match(interaction.customId)).map(i => i.run(interaction))
    }
}
