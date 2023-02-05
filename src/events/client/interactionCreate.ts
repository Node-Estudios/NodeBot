import { ApplicationCommandOptionType, ButtonInteraction, CacheType, CommandInteraction, EmbedBuilder, GuildMember, Interaction, PermissionsBitField } from 'discord.js'

import Client from '../../structures/Client.js'
import logger from '../../utils/logger.js'
// const UserModel = require('../../models/user');
import Discord from 'discord.js'
import commands from '../../cache/commands.js'
import performanceMeters from '../../cache/performanceMeters.js'
import { Timer as performanceMeter } from '../../handlers/performanceMeter.js'
import languageImport from '../../lang/index.json' assert { type: "json" }
import { BaseEvent } from '../../structures/Events.js'
import retrieveUserLang from '../../utils/db/retrieveUserLang.js'
//TODO: Finish cooldowns and move them to cache folder
import buttons from '../../cache/buttons.js'
import { messageHelper } from '../../handlers/messageHandler.js'
const cooldowns = new Discord.Collection()
const permissionHelpMessage = `Hey! Tienes problemas? Entra en nuestro servidor.`
// Define an interface for the JSON objects inside the array
interface Language {
    nombre: string;// The name of the language
    nombreCompleto: string;// The full name of the language
    archivo: string;// The name of the file containing translations for this language
    default: boolean;// Whether this language is the default language
}
// Define a type that includes all the values of the "name" field from the "Language" interface
type Languages = Language['nombre'];

// Define a function that takes a list of "Language" objects and returns a type that includes all the values of the "name" field
function getLanguages(languages: Language[]): Languages {
    // Use the "map()" function to create a list of the "name" values, and use the "join()" function to combine them into a single string
    return languages.map(language => language.nombre).join(' | ');
}

// Import the list of language objects from the "index.json" file
const languages: Language[] = languageImport

//Create an object for saving the contents of every language file
import contenidoIdiomas from '../../cache/idioms.js'
for (const archivo of languages) {
    // Import the contents of the file and add it to the "contenidoIdiomas" array
    const respuesta = await import(`../../lang/${archivo.archivo}`, { assert: { type: 'json' } });
    contenidoIdiomas.set(archivo.nombre, respuesta); // {es_ES: {...}, en_US: {...}}
    if (archivo.default) contenidoIdiomas.set('default', respuesta)
}

// Call the "getLanguages()" function, passing in the list of language objects, to get a type that includes all the language names
const languagesType: Languages = getLanguages(languages);

// Define an interface that extends the "CommandInteraction" interface, adding a "language" field of type "Languages"
//TODO: Remove any and add types from the O¡Collection.set() function
export interface interactionCommandExtend extends BaseEvent {
    language: any
}
type interactionExtend = Interaction<CacheType> & {
    language: any
}
export type interactionCommandExtended = CommandInteraction & {
    language: any
}
export type interactionButtonExtend = ButtonInteraction<CacheType> & {
    language: any
}
export class interactionCreate extends BaseEvent {
    async run(client: Client, interaction2: interactionExtend): Promise<void> {
        performanceMeters.set('interaction_' + interaction2.id, new performanceMeter())
        performanceMeters.get('interaction_' + interaction2.id).start()

        // return false if something went wrong, true if everything was okey
        logger.debug(`Interaction ${interaction2.id} created`)
        if (!client.user) return; // <-- return statement here
        //TODO: Change lang from any to string inside .then((lang: any) => {}))
        this.getLang(interaction2).then(async () => {
            const msg = new messageHelper(interaction2);
            if (interaction2.isCommand()) {
                let desc =
                    interaction2.language.NODETHINKING[
                    Math.floor(Math.random() * (Object.keys(interaction2.language.NODETHINKING).length + 1) + 1)
                    ];
                if (!desc) desc = interaction2.language.NODETHINKING[1];

                const loadingEmbed = new EmbedBuilder().setColor(client.settings.color).setTitle(desc).setDescription('Estamos trabajando para tener lo antes posible tu respuesta')

                interaction2
                    .reply({
                        embeds: [loadingEmbed],
                    })
                    .catch(e => {
                        logger.error(e);
                    });
                let interaction = interaction2 as interactionCommandExtended
                const cmd = commands.getCache().find((cmd2: any) => cmd2.name === interaction.commandName)
                if (!interaction.guild && cmd?.only?.guilds) return; // <-- return statement here
                if (interaction.guild && cmd?.only?.dm) return; // <-- return statement here
                if (cmd) {
                    // command found
                    logger.info(`Comando ${cmd.name} ejecutado`)

                    // TODO: Change this to a better way (remove any)
                    const args: any[] = []
                    for (let option of interaction.options.data) {
                        if (option.type === ApplicationCommandOptionType.Subcommand) {
                            option.name ? args.push(option.name) : null
                            option.options?.forEach(s => {
                                return s.value ? args.push(s.value) : null
                            })
                        } else if (option.value) args.push(option.value)
                    }
                } else {
                    // return command not found
                }
            } else if (interaction2.isButton()) {

            }
        })
        return await this.getLang(interaction2).then(async () => {
            const msg = new messageHelper(interaction2)

            // if (!interaction.guild) return // <-- return statement needed here
            // console.log(client.commands);
            // console.log(interaction.language)
            if (interaction2.isCommand()) {
                let interaction = interaction2 as interactionCommandExtended
                const cmd = commands.getCache().find((cmd2: any) => cmd2.name === interaction.commandName)
                if (!interaction.guild && cmd?.only?.guilds) return; // <-- return statement here
                if (interaction.guild && cmd?.only?.dm) return; // <-- return statement here
                let commandName = interaction.commandName
                // console.log(language.NODETHINKING && language)
                // let desc =
                //     language.NODETHINKING[
                //     Math.floor(Math.random() * (Object.keys(language.NODETHINKING).length + 1) + 1)
                //     ]
                // if (!desc) desc = language.NODETHINKING[1]

                // const loadingEmbed = new MessageEmbed().setColor(client.settings.color).setDescription(desc)

                // await interaction
                //     .reply({
                //         embeds: [loadingEmbed],
                //     })
                //     .catch(e => {
                //         logger.error(e)
                //     })

                if (cmd) {
                    logger.info(`Comando ${cmd.name} ejecutado`)

                    // TODO: Change this to a better way (remove any)
                    const args: any[] = []
                    for (let option of interaction.options.data) {
                        if (option.type === ApplicationCommandOptionType.Subcommand) {
                            option.name ? args.push(option.name) : null
                            option.options?.forEach(s => {
                                return s.value ? args.push(s.value) : null
                            })
                        } else if (option.value) args.push(option.value)
                    }
                    //CHECK PERMISSIONS 
                    if (cmd.permissions) {
                        cmd.permissions.botPermissions?.concat([PermissionsBitField.Flags.SendMessages.toString(), PermissionsBitField.Flags.EmbedLinks.toString()])
                        if (cmd.permissions.botPermissions.length > 0) {
                            let missingPermissions: String[] = []
                            let mySelfPermissions = await interaction.guild?.members.fetchMe();
                            missingPermissions = cmd.permissions.botPermissions.filter(
                                (perm: any) =>
                                    // TODO: Check this ?
                                    mySelfPermissions?.permissions.has(perm, true)
                            )

                            if (missingPermissions.length > 0) {
                                if (missingPermissions.includes(PermissionsBitField.Flags.SendMessages.toString())) {
                                    const user = interaction.user
                                    if (!user) return
                                    else if (!user.dmChannel) await user.createDM()
                                    await user.dmChannel!.send(
                                        `No tengo los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(
                                            ', ',
                                        )}**\n${permissionHelpMessage}`,
                                    ).catch(() => {
                                        logger.debug(`Permissions leak: Guild<${interaction.guildId}>, failed to send message to User<${interaction.user.id}>`)
                                    })

                                }
                                const promises = [
                                    msg.sendMessage({
                                        content: `Permissions leak; Requiered permissions: **${missingPermissions.join(
                                            ', ',
                                        )}**\n${permissionHelpMessage}`,
                                        embeds: [],
                                    }, false)
                                ]
                                return Promise.all(promises).then(() => {
                                    throw new Error(`Permissions leak; Guild<${interaction.guildId}>, User<${interaction.user.id}>`);
                                })
                            }

                            if (cmd.permissions.userPermissions.length > 0) {
                                const missingPermissions = cmd.permissions.userPermissions.filter(
                                    (perm: any) => !(interaction.member as GuildMember).permissions.has(perm),
                                )
                                if (missingPermissions.length > 0) {
                                    const promises = [

                                        msg.sendMessage({
                                            content: `No tienes los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(
                                                ', ',
                                            )}**`,
                                            embeds: [],
                                        }, false)
                                    ]
                                    return Promise.all(promises).then(() => {
                                        throw new Error(`Permissions leak; Guild<${interaction.guildId}>, User<${interaction.user.id}>`);
                                    })
                                }
                            }
                            if (
                                cmd.permissions.botPermissions.includes(PermissionsBitField.Flags.Connect.toString()) &&
                                !(interaction.member as GuildMember).voice.channel?.permissionsFor(client.user.id)?.has(PermissionsBitField.Flags.Connect)
                            ) {
                                const promises = [
                                    msg.sendMessage({
                                        content: `Permissions leak; I dont have enoguh permissions to join in your voice channel.`,
                                        embeds: [],
                                    }, false)
                                ]
                                return Promise.all(promises).then(() => {
                                    throw new Error(`Permissions leak; Guild<${interaction.guildId}>, User<${interaction.user.id}>`);
                                })
                            }
                            if (
                                cmd.permissions.botPermissions.includes(PermissionsBitField.Flags.Speak.toString()) &&
                                !(interaction.member as GuildMember).voice.channel?.permissionsFor(client.user.id)?.has(PermissionsBitField.Flags.Speak)
                            ) {
                                const promises = [
                                    msg.sendMessage({
                                        content: `Permissions leak; I dont have enoguh permissions to speak in your voice channel.`,
                                        embeds: [],
                                    }, false)
                                ]
                                return Promise.all(promises).then(() => {
                                    throw new Error(`Permissions leak; Guild<${interaction.guildId}>, User<${interaction.user.id}>`);
                                })
                            }
                            //CHECK PERMISSION
                            if (cmd.permissions.dev === true && !client.devs.includes(interaction.user.id)) {
                                const promises = [
                                    msg.sendMessage({
                                        content: 'Comando exclusivo para devs',
                                        embeds: [],
                                    }, false)
                                ]
                                return Promise.all(promises).then(() => {
                                    throw new Error(`Permissions leak (exclusive for devs); Guild<${interaction.guildId}>, User<${interaction.user.id}>`);
                                })
                            }
                        }

                        //TODO: Add COOLDOWN functionality
                        // if (!client.devs.includes(interaction.user.id)) {
                        //     if (!cooldowns.has(commandName)) {
                        //         cooldowns.set(commandName, new Discord.Collection())
                        //     }
                        //     const now = Date.now()
                        //     const timestamps = cooldowns.get(commandName)
                        //     const cooldownAmount = Math.floor(cmd.cooldown || 5) * 1000
                        //     if (!timestamps.has(interaction.user.id)) {
                        //         timestamps.set(interaction.user.id, now)
                        //         setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)
                        //     } else {
                        //         const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount
                        //         const timeLeft = (expirationTime - now) / 1000
                        //         if (now < expirationTime && timeLeft > 0.9) {
                        //             return msg.sendMessage({
                        //                 content: `Heyy! Ejecutas los coamndos demasiado rápido! Espera ${timeLeft.toFixed(
                        //                     1,
                        //                 )} segundos para ejecutar \`${commandName}\``,
                        //                 embeds: [],
                        //             })
                        //         }
                        //         timestamps.set(interaction.user.id, now)
                        //         setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)
                        //     }
                        // }
                    }
                    try {
                        cmd._run(async () => {
                            try {
                                return await cmd.run(client, interaction, args).then((data: any) => {
                                    return data
                                })
                            } catch (e) {
                                logger.debug(e)
                            }
                        }).then(async () => {
                            await performanceMeters.get('interaction_' + interaction.id).stop()
                            performanceMeters.delete('interaction_' + interaction.id)
                            //TODO: remove from cache
                            return;

                        })
                    } catch (e) {
                        logger.debug(e)
                    }
                }
            } else if (interaction2.isButton()) {
                let interaction = interaction2 as interactionButtonExtend
                logger.debug(`Button ${interaction.customId} pressed`)
                const button = buttons.getCache().get(interaction.customId)
                // // console.log(button)
                // //TODO: Change this
                console.log(button)
                if (button) return button(client, interaction)
            } else return
        }).catch((err) => {
            console.log(err)
            return (interaction2 as unknown as interactionCommandExtend).reply({
                content: 'Ha ocurrido un error al ejecutar el comando, contacta con los desarrolladores. Status: 500 (db error && internal error)',
                embeds: [],
                components: [],
                files: [],
            })
        })
    }

    async getLang(interaction: Interaction<CacheType>) {
        const user = interaction.member?.user ? interaction.member.user : interaction.user
        return await retrieveUserLang(user.id).then(async (lang: any) => {
            // Cast the "interaction" object as the "interactionCommandExtend" interface, and assign the "lang" value to the "language" field
            //Refactorizar el codigo para que no sea any, sino una collection que tenga el valor de el json de idiomas
            (interaction as interactionExtend).language = await contenidoIdiomas.get(lang).default
            // console.log((interaction as interactionExtend).language)
        })
    }
}