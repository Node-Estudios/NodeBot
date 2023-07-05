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

// Call the "getLanguages()" function, passing in the list of language objects, to get a type that includes all the language names
const languagesType: Languages = getLanguages(languages)

// Define an interface that extends the "CommandInteraction" interface, adding a "language" field of type "Languages"
//TODO: Remove any and add types from the O¡Collection.set() function
export type ChatInputCommandInteractionExtended<T extends CacheType> = ChatInputCommandInteraction<T> & {
    language: any
}
export type InteractionExtend<T extends CacheType> = Interaction<T> & {
    language: any
}
export type ButtonInteractionExtend<T extends CacheType> = ButtonInteraction<T> & {
    language: any
}
export class interactionCreate extends BaseEvent {
    async run(client: Client, interaction: InteractionExtend<'cached'>): Promise<void> {
        if (interaction.member?.user.bot) return
        performanceMeters.set('interaction_' + interaction.id, new performanceMeter())
        performanceMeters.get('interaction_' + interaction.id).start()

        // return false if something went wrong, true if everything was okey
        // logger.debug(`Interaction ${interaction.id} created`)
        if (client.settings.debug == 'true')
            logger.debug('Interaction Executed | ' + interaction.guild.name + ' | ' + interaction.user.username)
        if (!client.isReady()) return // <-- return statement here
        //TODO: Change lang from any to string inside .then((lang: any) => {}))
        // this.getLang(interaction2).then(async () => {
        //     const msg = new messageHelper(interaction2);
        //     if (interaction2.isCommand()) {
        //         let desc =
        //             interaction2.language.NODETHINKING[
        //             Math.floor(Math.random() * (Object.keys(interaction2.language.NODETHINKING).length + 1) + 1)
        //             ];
        //         if (!desc) desc = interaction2.language.NODETHINKING[1];

        //         const loadingEmbed = new EmbedBuilder().setColor(client.settings.color).setTitle(desc).setDescription('Estamos trabajando para tener lo antes posible tu respuesta')

        //         interaction2
        //             .reply({
        //                 embeds: [loadingEmbed],
        //             })
        //             .catch(e => {
        //                 logger.error(e);
        //             });
        //         let interaction = interaction2 as interactionCommandExtended
        //         const cmd = commands.getCache().find((cmd2: any) => cmd2.name === interaction.commandName)
        //         if (!interaction.guild && cmd?.only?.guilds) return; // <-- return statement here
        //         if (interaction.guild && cmd?.only?.dm) return; // <-- return statement here
        //         if (cmd) {
        //             // command found
        //             logger.info(`Comando ${cmd.name} ejecutado`)

        //             // TODO: Change this to a better way (remove any)
        //             const args: any[] = []
        //             for (let option of interaction.options.data) {
        //                 if (option.type === ApplicationCommandOptionType.Subcommand) {
        //                     option.name ? args.push(option.name) : null
        //                     option.options?.forEach(s => {
        //                         return s.value ? args.push(s.value) : null
        //                     })
        //                 } else if (option.value) args.push(option.value)
        //             }
        //         } else {
        //             // return command not found
        //         }
        //     } else if (interaction2.isButton()) {

        //     }
        // })
        return this.getLang(interaction)
            .then(async () => {
                if (interaction.isChatInputCommand()) return this.processChatImputCommand(interaction)
                else if (interaction.isButton()) return this.processButtonInteraction(interaction)
            })
            .catch(err => {
                logger.error(err)
                if (!interaction.isAutocomplete())
                    return interaction.reply({
                        content:
                            'Ha ocurrido un error al ejecutar el comando, contacta con los desarrolladores. Status: 500 (db error && internal error)',
                        embeds: [],
                        components: [],
                        files: [],
                    })
                return
            })
    }

    async getLang(interaction: InteractionExtend<'cached'>) {
        const user = interaction.member?.user ? interaction.member.user : interaction.user
        return await retrieveUserLang(user.id).then(async lang => {
            // Cast the "interaction" object as the "interactionCommandExtend" interface, and assign the "lang" value to the "language" field
            //Refactorizar el codigo para que no sea any, sino una collection que tenga el valor de el json de idiomas
            // eliyya: puedo generar una herramienta facil para generar el type de los idiomas, pero recomiendo refactorizar los idiomas a i18n
            interaction.language = await contenidoIdiomas.get(lang).default
            // console.log((interaction as interactionExtend).language)
        })
    }

    async processChatImputCommand(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        try {
            const client = interaction.client as Client

            const cmd = commands.getCache().find(c => c.name === interaction.commandName)
            if (!cmd) return
            if (interaction.guild && cmd?.only_dm) return // <-- return statement here

            logger.debug(`Comando ${cmd.name} ejecutado | ${interaction.user.username}`)
            //CHECK PERMISSIONS
            if (cmd.permissions) {
                // Check if the command is only for devs
                if (cmd.permissions.dev && !client.devs.includes(interaction.user.id))
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
            //TODO: remove from cache
        } catch (e) {
            logger.debug(e)
        }
        return
    }

    async processButtonInteraction(interaction: ButtonInteractionExtend<'cached'>) {
        logger.debug(`Button ${interaction.customId} pressed | ${interaction.user.username}`)
        const button = buttons.getCache().get(interaction.customId)
        // //TODO: Change this
        // console.log(button)
        if (button) return button(interaction.client as Client, interaction)
    }
}
