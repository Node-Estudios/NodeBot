import { ColorResolvable, MessageEmbed } from 'discord.js'
import { interactionCommandExtend } from '../../../events/client/interactionCreate.js'
import langFile from '../../../lang/index.json' assert { type: 'json' }
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'

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
    async run(interaction: interactionCommandExtend, args: any[]) {
        const language = await import('../lang/' + langFile.find(l => l.nombre == interaction.language)?.archivo, { assert: { type: "json" } })
        const client = interaction.client as Client
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(process.env.bot1Embed_Color as ColorResolvable)
                    .setDescription(
                        `<a:pin:893553168259121172> ${language.HELP[5]} \`Node\`, ${language.HELP[6]}`,
                    )
                    .addFields({
                        name: language.HELP[7],
                        value: `${language.HELP[8]} \`/${interaction.commandName}\`.`,
                    })
                    .addFields({ name: language.HELP[9], value: language.HELP[10] })
                    .addFields({
                        name: language.HELP[11],
                        value:
                            language.HELP[12] +
                            `<a:arrowright:970388686816550912> \`/vote\` <a:arrowleft:893553168108093560> ${language.HELP[14]}(https://vote.nodebot.xyz 'Estamos esperando tu voto :)')`,
                    })
                    .setThumbnail(
                        interaction.user.displayAvatarURL({
                            dynamic: true,
                        }),
                    )
                    .setTitle('✨' + language.HELP[13]),
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
