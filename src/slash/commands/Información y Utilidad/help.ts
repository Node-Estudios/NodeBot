import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js'
import Command from '../../../structures/Command.js'
import client from '../../../bot.js'

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
    override async run(interaction: CommandInteraction<'cached'>) {
        // const cmd = interaction.options.getString('command')
        // if (!cmd)
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(process.env.bot1Embed_Color as ColorResolvable)
                    .setDescription(
                        `<a:pin:893553168259121172> ${client.language.HELP[5]} \`Node\`, ${client.language.HELP[6]}`,
                    )
                    .addFields({
                        name: client.language.HELP[7],
                        value: `${client.language.HELP[8]} \`/${interaction.commandName}\`.`,
                    })
                    .addFields({ name: client.language.HELP[9], value: client.language.HELP[10] })
                    .addFields({
                        name: client.language.HELP[11],
                        value:
                            client.language.HELP[12] +
                            `<a:arrowright:970388686816550912> \`/vote\` <a:arrowleft:893553168108093560> ${client.language.HELP[14]}(https://vote.nodebot.xyz 'Estamos esperando tu voto :)')`,
                    })
                    .setThumbnail(
                        interaction.user.displayAvatarURL({
                            dynamic: true,
                        }),
                    )
                    .setTitle('✨' + client.language.HELP[13]),
            ],
        })
        // const command = commands.get(cmd)

        //     if (!command) {
        //         return interaction.reply({
        //             embeds: [new MessageEmbed()
        //             .setColor('RED')
        //             .setTitle(client.language.ERROREMBED)
        //             .setDescription(name + client.language.HELP[25])
        //             .setFooter(
        //                 interaction.user.username + '#' + interaction.user.discriminator,
        //                 interaction.user.displayAvatarURL(),
        //             )],
        //         })
        //     }

        //     data.push(`**${client.language.HELP[15]}:** ${command.name}`)

        //     if (command.description) data.push(`**${client.language.HELP[17]}:** ${command.description}`)
        //     let ajj
        //     if (command.options)
        //         data.push(
        //             `**${client.language.HELP[18]}:** .${command.name} ${command.options
        //                 .map((a: any) => {
        //                     return (ajj = a.name ? a.name : null)
        //                 })
        //                 .join(' ')}`,
        //         )

        //     data.push(`**${client.language.HELP[19]}:** ${command.cooldown || 3} ${client.language.HELP[30]}(s)`)
        //     let embed2 = new MessageEmbed()
        //         .setTitle(client.language.HELP[20] + command.name + client.language.HELP[24])
        //         .setColor(process.env.bot1Embed_Color as ColorResolvable)
        //         .addFields(
        //             {
        //                 name: `**${client.language.HELP[17]}**`,
        //                 value: command.description ,
        //                 inline: true,
        //             },
        //             {
        //                 name: `**${client.language.HELP[18]}**`,
        //                 value: ajj ? ajj : client.language.HELP[29],
        //                 inline: true,
        //             },
        //         )
        //         .setFooter(
        //             `\n${client.language.HELP[26]} \`/${interaction.commandName} [${client.language.HELP[27]}]\` ${client.language.HELP[28]}`,
        //         )
        //         .setTimestamp()

        //     interaction.reply({
        //         embeds: [embed2],
        //     })
    }
}
