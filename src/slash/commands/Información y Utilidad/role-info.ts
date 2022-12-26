import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js'
import Command from '../../../structures/Command'
import Client from '../../../structures/Client'

export default class roleinfo extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'roleinfo',
            description: 'Get information about a role.',
            name_localizations: {
                'es-ES': 'inforol',
            },
            description_localizations: {
                'es-ES': 'Obtener información sobre un rol.',
            },
            cooldown: 5,
            options: [
                {
                    type: 8,
                    name: 'role',
                    description: 'Role to get information about.',
                    name_localizations: {
                        'es-ES': 'role',
                    },
                    description_localizations: {
                        'es-ES': 'El rol a obtener información sobre.',
                    },
                    required: true,
                },
            ],
        })
    }
    /**,
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async run(client: Client, interaction: CommandInteraction, args: any) {
        // try {
        let role = await interaction.guild?.roles.fetch(args[0])
        if (!role) {
            const errorembed = new MessageEmbed()
                .setColor('RED')
                .setTitle(client.language.ERROREMBED)
                .setDescription(client.language.ROLEINFO[9])
                .setFooter(
                    interaction.user.username + '#' + interaction.user.discriminator,
                    interaction.user.displayAvatarURL(),
                )
            return interaction.editReply({ embeds: [errorembed] })
        }
        const guild = interaction.guild
        if (guild) {
            const rol = new MessageEmbed()
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor((role.hexColor as ColorResolvable) || ('#1DC44F' as ColorResolvable))
            let iconURL = guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : undefined
            if (iconURL) rol.setAuthor(guild.name, iconURL)
            rol.addField(
                `<:pepeblink:967941236029788160> ${client.language.ROLEINFO[1]}: `,
                '```' + `${role.name}` + '```',
                true,
            ) //Nombre del rol
            rol.addField(
                `<:textchannelblurple:893490117451333632> ${client.language.ROLEINFO[2]}: `,
                '```' + `${role.id}` + '```',
                true,
            ) //Id del rol
            rol.addField(
                `🔢 ${client.language.ROLEINFO[4]}: `,
                '```' + `${Math.abs(role.rawPosition - interaction.guild.roles.cache.size)}` + '```',
                true,
            ) //Su pocision en cuanto los otros roles
            rol.addField(`🎩 ${client.language.ROLEINFO[5]}: `, '```' + `${role.hexColor}` + '```', true) //Su hexColor
            rol.addField(
                `<:star:893553167915188275> ${client.language.ROLEINFO[6]}: `,
                role.mentionable
                    ? '```' + client.language.ROLEINFO[10] + '```'
                    : '```' + client.language.ROLEINFO[11] + '```',
                true,
            ) //Devolvera true o false, segun si se puede mencionar este rol o no
            rol.addField(
                `<:share:893553167894216744> ${client.language.ROLEINFO[7]}: `,
                role.hoist
                    ? '```' + client.language.ROLEINFO[10] + '```'
                    : '```' + client.language.ROLEINFO[11] + '```',
                true,
            ) //Devolvera true o false, segun si se esta separado(visible ante los roles) o no
            rol.addField(
                `<:cmd:894171593431994388> ${client.language.ROLEINFO[8]}: `,
                role.managed
                    ? '```' + client.language.ROLEINFO[10] + '```'
                    : '```' + client.language.ROLEINFO[11] + '```',
                true,
            ) //Devolvera true o false, segun si lo creo el sistema(El propio discord)
            if (iconURL) rol.setImage(iconURL)

            return interaction.editReply({ embeds: [rol] })
        }

        // } catch (e) {
        //     console.error(e);
        //     message.channel.send({ embeds: [
        //         new Discord.MessageEmbed()
        //             .setColor("RED")
        //             .setTitle(client.language.ERROREMBED)
        //             .setDescription(client.language.fatal_error)
        //             .setFooter(message.author.username, message.author.avatarURL())
        //     ]});
        //     webhookClient.send(
        //         `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
        //     );
        //     try {
        //         message.author
        //             .send(
        //                 "Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>"
        //             )
        //             .catch(e);
        //     } catch (e) { }
        // }
    }
}

function trimArray(arr: Array<any>, maxLen = 10) {
    if (arr.length > maxLen) {
        const len = arr.length - maxLen
        arr = arr.slice(0, maxLen)
        arr.push(`${len} more...`)
    }
    return arr
}
