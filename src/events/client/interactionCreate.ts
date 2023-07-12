import { ButtonInteraction, CacheType, ChatInputCommandInteraction, Interaction } from 'discord.js'

import Client from '../../structures/Client.js'
import logger from '../../utils/logger.js'
// const UserModel = require('../../models/user');
import Discord from 'discord.js'
import commands from '../../cache/commands.js'
import performanceMeters from '../../cache/performanceMeters.js'
import { Timer as performanceMeter } from '../../handlers/performanceMeter.js'
import languageImport from '../../lang/index.json' assert { type: 'json' }
import { BaseEvent } from '../../structures/Events.js'
import retrieveUserLang from '../../utils/db/retrieveUserLang.js'
//TODO: Finish cooldowns and move them to cache folder
import buttons from '../../cache/buttons.js'
const cooldowns = new Discord.Collection()
const permissionHelpMessage = `Hey! Tienes problemas? Entra en nuestro servidor.`
// Define an interface for the JSON objects inside the array
interface Language {
    nombre: string // The name of the language
    nombreCompleto: string // The full name of the language
    archivo: string // The name of the file containing translations for this language
    default: boolean // Whether this language is the default language
}
// Define a type that includes all the values of the "name" field from the "Language" interface
type Languages = Language['nombre']

// Define a function that takes a list of "Language" objects and returns a type that includes all the values of the "name" field
function getLanguages(languages: Language[]): Languages {
    // Use the "map()" function to create a list of the "name" values, and use the "join()" function to combine them into a single string
    return languages.map(language => language.nombre).join(' | ')
}

// Import the list of language objects from the "index.json" file
const languages: Language[] = languageImport

//Create an object for saving the contents of every language file
import contenidoIdiomas from '../../cache/idioms.js'
for (const archivo of languages) {
    // Import the contents of the file and add it to the "contenidoIdiomas" array
    const respuesta = await import(`../../lang/${archivo.archivo}`, { assert: { type: 'json' } })
    contenidoIdiomas.set(archivo.nombre, respuesta) // {es_ES: {...}, en_US: {...}}
    if (archivo.default) contenidoIdiomas.set('default', respuesta)
}

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
