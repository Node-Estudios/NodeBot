import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js'
import Command from '../../../structures/Command'
import commands from '../../../cache/commands'
import client from '../../../bot'

export default class help extends Command {
    constructor() {
        super({
            name: 'help',
            description: 'Show information about me.',
            name_localizations: {
                'es-ES': 'ayuda',
            },
            description_localizations: {
                'es-ES': 'Muestra información sobre mi.',
            },
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: 'command',
                    description: 'The command you want to get help for.',
                    name_localizations: {
                        'es-ES': 'comando',
                    },
                    description_localizations: {
                        'es-ES': 'El comando del que quieres obtener ayuda.',
                    },
                    required: false,
                },
            ],
        })
    }
    async run(interaction: CommandInteraction, args: any) {
        // try {
        if (!args[0]) {
            // let web = new MessageButton()
            //   .setStyle("url")
            //   .setLabel(client.language.HELP[1])
            //   .setEmoji("🌐")
            //   .setURL("https://nodebot.xyz");

            // let invite = new MessageButton()
            //   .setStyle("url")
            //   .setLabel(client.language.HELP[2])
            //   .setEmoji("💌")
            //   .setURL("https://invite.nodebot.xyz");

            // let support = new MessageButton()
            //   .setStyle("url")
            //   .setLabel(client.language.HELP[3])
            //   .setEmoji("🛠️")
            //   .setURL("https://support.nodebot.xyz");
            // let ButtonArray = [web, invite, support];

            const embed = new MessageEmbed()
                .setColor(process.env.bot1Embed_Color as ColorResolvable)
                .setDescription(
                    `<a:pin:893553168259121172> ${client.language.HELP[5]} \`Node\`, ${client.language.HELP[6]}`,
                )
                .addField(client.language.HELP[7], `${client.language.HELP[8]} \`/${interaction.commandName}\`.`)
                .addField(client.language.HELP[9], client.language.HELP[10])
                .addField(
                    client.language.HELP[11],
                    client.language.HELP[12] +
                        `<a:arrowright:970388686816550912> \`/vote\` <a:arrowleft:893553168108093560> ${client.language.HELP[14]}(https://vote.nodebot.xyz 'Estamos esperando tu voto :)')`,
                )
                .setThumbnail(
                    interaction.user.displayAvatarURL({
                        dynamic: true,
                    }),
                )
                .setTitle('✨' + client.language.HELP[13])
            //let user = client.users.cache.get(message.author.id)

            //message.lineReply(client.language.HELP[4]);
            interaction.editReply({
                embeds: [embed],
                //buttons: ButtonArray,
            })
        } else {
            const data: string[] = []
            const name = args[0].toLowerCase()
            const command = commands.get(name)

            if (!command) {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(name + client.language.HELP[25])
                    .setFooter(
                        interaction.user.username + '#' + interaction.user.discriminator,
                        interaction.user.displayAvatarURL(),
                    )
                return interaction.editReply({
                    embeds: [errorembed],
                })
            }

            data.push(`**${client.language.HELP[15]}:** ${command.name}`)

            if (command.description) data.push(`**${client.language.HELP[17]}:** ${command.description}`)
            let ajj
            if (command.options)
                data.push(
                    `**${client.language.HELP[18]}:** .${command.name} ${command.options
                        .map((a: any) => {
                            return (ajj = a.name ? a.name : null)
                        })
                        .join(' ')}`,
                )

            data.push(`**${client.language.HELP[19]}:** ${command.cooldown || 3} ${client.language.HELP[30]}(s)`)
            let embed2 = new MessageEmbed()
                .setTitle(client.language.HELP[20] + command.name + client.language.HELP[24])
                .setColor(process.env.bot1Embed_Color as ColorResolvable)
                .addFields(
                    {
                        name: `**${client.language.HELP[17]}**`,
                        value: command.description ? command.description.toString() : client.language.HELP[29],
                        inline: true,
                    },
                    {
                        name: `**${client.language.HELP[18]}**`,
                        value: ajj ? ajj : client.language.HELP[29],
                        inline: true,
                    },
                )
                .setFooter(
                    `\n${client.language.HELP[26]} \`/${interaction.commandName} [${client.language.HELP[27]}]\` ${client.language.HELP[28]}`,
                )
                .setTimestamp()

            interaction.editReply({
                embeds: [embed2],
            })
        }
        //   } catch (e) {
        //     console.error(e);
        //     message.channel.send({
        //       embeds: [
        //         new Discord.MessageEmbed()
        //         .setColor("RED")
        //         .setTitle(client.language.ERROREMBED)
        //         .setDescription(client.language.fatal_error)
        //         .setFooter(message.author.username, message.author.avatarURL())
        //       ]
        //     });
        //     webhookClient.send(
        //       `Ha habido un error en **${message.guild.name} [ID Server: ${message.guild.id}] [ID Usuario: ${message.author.id}] [Owner: ${message.guild.ownerId}]**. Numero de usuarios: **${message.guild.memberCount}**\nMensaje: ${message.content}\n\nError: ${e}\n\n**------------------------------------**`
        //     );
        //     try {
        //       message.author
        //         .send(
        //           "Oops... Ha ocurrido un eror con el comando ejecutado. Aunque ya he notificado a mis desarrolladores del problema, ¿te importaría ir a discord.gg/nodebot y dar más información?\n\nMuchísimas gracias rey <a:corazonmulticolor:836295982768586752>"
        //         )
        //         .catch(e);
        //     } catch (e) {}
        //   }
    }
}
