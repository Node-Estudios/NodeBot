import { ColorResolvable, EmbedBuilder as EmbedBuilder } from 'discord.js'
import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
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
            // options: [
            //     {
            //         type: 3,
            //         name: 'command',
            //         description: 'The command you want to get help for.',
            //         name_localizations: {
            //             'es-ES': 'comando',
            //         },
            //         description_localizations: {
            //             'es-ES': 'El comando del que quieres obtener ayuda.',
            //         },
            //         required: false,
            //     },
            // ],
        })
    }
    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        const language = interaction.language
        const client = interaction.client as Client
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    // .setColor(process.env.bot1Embed_Color as ColorResolvable)
                    .setDescription(`<a:pin:893553168259121172> ${language.HELP[5]} \`Node\`, ${language.HELP[6]}`)
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
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTitle('✨' + language.HELP[13]),
            ],
        })
        // const command = commands.get(cmd)

        //     if (!command) {
        //         return interaction.reply({
        //             embeds: [new EmbedBuilder()
        //             .setColor('RED')
        //             .setTitle(interaction.language.ERROREMBED)
        //             .setDescription(name + interaction.language.HELP[25])
        //             .setFooter(
        //                 interaction.user.username + '#' + interaction.user.discriminator,
        //                 interaction.user.displayAvatarURL(),
        //             )],
        //         })
        //     }

        //     data.push(`**${interaction.language.HELP[15]}:** ${command.name}`)

        //     if (command.description) data.push(`**${interaction.language.HELP[17]}:** ${command.description}`)
        //     let ajj
        //     if (command.options)
        //         data.push(
        //             `**${interaction.language.HELP[18]}:** .${command.name} ${command.options
        //                 .map((a: any) => {
        //                     return (ajj = a.name ? a.name : null)
        //                 })
        //                 .join(' ')}`,
        //         )

        //     data.push(`**${interaction.language.HELP[19]}:** ${command.cooldown || 3} ${interaction.language.HELP[30]}(s)`)
        //     let embed2 = new EmbedBuilder()
        //         .setTitle(interaction.language.HELP[20] + command.name + interaction.language.HELP[24])
        //         .setColor(process.env.bot1Embed_Color as ColorResolvable)
        //         .addFields(
        //             {
        //                 name: `**${interaction.language.HELP[17]}**`,
        //                 value: command.description ,
        //                 inline: true,
        //             },
        //             {
        //                 name: `**${interaction.language.HELP[18]}**`,
        //                 value: ajj ? ajj : interaction.language.HELP[29],
        //                 inline: true,
        //             },
        //         )
        //         .setFooter(
        //             `\n${interaction.language.HELP[26]} \`/${interaction.commandName} [${interaction.language.HELP[27]}]\` ${interaction.language.HELP[28]}`,
        //         )
        //         .setTimestamp()

        //     interaction.reply({
        //         embeds: [embed2],
        //     })
    }
}
