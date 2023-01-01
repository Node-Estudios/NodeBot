import { ApplicationCommandOptionType, CacheType, CommandInteraction, GuildMember, Interaction, PermissionsBitField } from 'discord.js'

import Client from '../../structures/Client.js'
import logger from '../../utils/logger.js'
// const UserModel = require('../../models/user');
import Discord, { EmbedBuilder as MessageEmbed } from 'discord.js'
import Statcord from 'statcord.js'
import buttons from '../../cache/buttons.js'
import commands from '../../cache/commands.js'
import languageImport from '../../lang/index.json' assert { type: "json" }
import Event from '../../structures/Events.js'
import retrieveUserLang from '../../utils/db/retrieveUserLang.js'
//TODO: Finish cooldowns and move them to cache folder
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
}

// Call the "getLanguages()" function, passing in the list of language objects, to get a type that includes all the language names
const languagesType: Languages = getLanguages(languages);

// Define an interface that extends the "CommandInteraction" interface, adding a "language" field of type "Languages"
//TODO: Remove any and add types from the O¡Collection.set() function
export interface interactionCommandExtend extends CommandInteraction<CacheType> {
    language: any
}
type interactionExtend = Interaction<CacheType> & {
    language: any
}

export default class interactionCreate extends Event {
    constructor(client: Client) {
        super(client);
    }
    async run(client: Client, interaction: interactionExtend) {
        logger.debug(`Interaction ${interaction.id} created`)
        if (!client.user) return
        //TODO: Change lang from any to string inside .then((lang: any) => {}))
        await getLang(interaction)
        // if (!interaction.guild) return
        // console.log(client.commands);
        if (interaction.isCommand()) {
            let language = interaction.language
            const cmd = commands.find((cmd2: any) => cmd2.name === interaction.commandName)
            if (!interaction.guild && cmd?.only?.guilds) return;
            if (interaction.guild && cmd?.only?.dm) return;
            let commandName = interaction.commandName

            let desc =
                language.NODETHINKING[
                Math.floor(Math.random() * (Object.keys(language.NODETHINKING).length + 1) + 1)
                ]
            if (!desc) desc = language.NODETHINKING[1]

            const loadingEmbed = new MessageEmbed().setColor(client.settings.color).setDescription(desc)

            await interaction
                .reply({
                    embeds: [loadingEmbed],
                })
                .catch(e => {
                    logger.error(e)
                })

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
                // interaction.member = interaction.guild!.members.cache.get(
                //   interaction.user.id
                // );
                // fetchUser(client);

                // async function fetchUser(client2: Client) {
                //     return await new Promise(resolve => {
                //         client2.users.fetch(interaction.user.id).then(() => {
                //             UserModel.findOne({
                //                 USERID: interaction.user.id.toString(),
                //             }).then(async (s: typeof UserModel, err: Error) => {
                //                 if (err) {
                //                     client.logger.error(err);
                //                 }
                //                 if (s) {
                //                     s.COMMANDS_EXECUTED = s.COMMANDS_EXECUTED + 1;
                //                     s.save().catch((err: Error) => {
                //                         client.logger.error(err);
                //                     });
                //                 }
                //                 if (!s) {
                //                     client.logger.debug(interaction.user.id.toString());
                //                     const user = new UserModel({
                //                         USERID: interaction.user.id.toString(),
                //                         LANG: 'es_ES',
                //                         COMMANDS_EXECUTED: 0,
                //                         BANNED: false,
                //                         Roles: {
                //                             Developer: {
                //                                 Enabled: false,
                //                                 Date: null,
                //                             },
                //                             Tester: {
                //                                 Enabled: false,
                //                                 Date: null,
                //                             },
                //                         },
                //                         // Interacciones: {
                //                         //     Enviadas: {},
                //                         //     Recibidas: {},
                //                         // },
                //                     });
                //                     user.save().catch((err: Error) => client.logger.error(err));
                //                     resolve(user);
                //                 }
                //             });
                //         });
                //     });
                // }
                //CHECK PERMISSIONS *COPIADO DE OTRO BOT XD
                if (cmd.permissions) {
                    cmd.permissions.botPermissions?.concat([PermissionsBitField.Flags.SendMessages.toString(), PermissionsBitField.Flags.EmbedLinks.toString()])
                    if (cmd.permissions.botPermissions.length > 0) {
                        let missingPermissions: String[] = []
                        interaction.guild?.members.fetchMe().then((a) => {
                            missingPermissions = cmd.permissions.botPermissions.filter(
                                (perm: any) =>
                                    a.permissions.has(perm, true)
                            )
                        })

                        if (missingPermissions.length > 0) {
                            if (missingPermissions.includes(PermissionsBitField.Flags.SendMessages.toString())) {
                                const user = client.users.cache.get('id')
                                if (!user) return
                                else if (!user.dmChannel) await user.createDM()
                                await user.dmChannel!.send(
                                    `No tengo los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(
                                        ', ',
                                    )}**\n${permissionHelpMessage}`,
                                )
                            }
                            return interaction.editReply({
                                content: `No tengo los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(
                                    ', ',
                                )}**\n${permissionHelpMessage}`,
                                embeds: [],
                            })
                        }
                    }

                    if (cmd.permissions.userPermissions.length > 0) {
                        const missingPermissions = cmd.permissions.userPermissions.filter(
                            (perm: any) => !(interaction.member as GuildMember).permissions.has(perm),
                        )
                        if (missingPermissions.length > 0) {
                            return interaction.editReply({
                                content: `No tienes los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(
                                    ', ',
                                )}**`,
                                embeds: [],
                            })
                        }
                    }
                    if (
                        cmd.permissions.botPermissions.includes(PermissionsBitField.Flags.Connect.toString()) &&
                        !(interaction.member as GuildMember)!
                            .voice!.channel!.permissionsFor(client.user.id)!
                            .has(PermissionsBitField.Flags.Connect)
                    )
                        return interaction.editReply({
                            content: 'No tengo permisos de conectarme al canal de voz donde estás',
                            embeds: [],
                        })
                    if (
                        cmd.permissions.botPermissions.includes(PermissionsBitField.Flags.Speak.toString()) &&
                        !(interaction.member as GuildMember)!
                            .voice!.channel!.permissionsFor(client.user.id)!
                            .has(PermissionsBitField.Flags.Speak)
                    )
                        return interaction.editReply({
                            content: 'No tengo permisos de hablar en el canal de voz donde estás',
                            embeds: [],
                        })
                    //CHECK PERMISSION
                    if (cmd.permissions.dev === true && !client.devs.includes(interaction.user.id))
                        return interaction.editReply({
                            content: 'Comando exclusivo para devs',
                            embeds: [],
                        })
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
                //             return interaction.editReply({
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
                cmd._run(client, interaction, args).then(() => {
                    //remove from cache

                })
                if (process.env.NODE_ENV == 'production')
                    Statcord.ShardingClient.postCommand(cmd.name, (interaction.member as GuildMember).id, client)
            } else {
                if (!cmd)
                    return interaction.editReply({
                        content: 'No se encontró el comando',
                        embeds: [],
                        components: [],
                        files: [],
                    })

                interaction.editReply({
                    // TODO: Change this and add embeds
                    content: (cmd as any).response,
                })
            }
        } else if (interaction.isButton()) {
            logger.debug(`Button ${interaction.customId} pressed`)
            const button = buttons.get(interaction.customId)
            // console.log(button)
            //TODO: Change this
            if (button) return (button as any).run(client, interaction)
        }
    }
}
async function getLang(interaction: Interaction<CacheType>) {
    const user = interaction.member?.user ? interaction.member.user : interaction.user
    retrieveUserLang(user.id).then(async (lang: any) => {
        // Cast the "interaction" object as the "interactionCommandExtend" interface, and assign the "lang" value to the "language" field
        //Refactorizar el codigo para que no sea any, sino una collection que tenga el valor de el json de idiomas
        ((interaction as interactionCommandExtend).language as any) = contenidoIdiomas.get(lang)
    })
}