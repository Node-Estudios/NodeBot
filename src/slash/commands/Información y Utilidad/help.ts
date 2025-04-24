import { ChatInputCommandInteraction } from 'discord.js'
import EmbedBuilder from '#structures/EmbedBuilder.js'
import Client from '#structures/Client.js'
import Command from '#structures/Command.js'
import Translator, { keys } from '#utils/Translator.js'

export default class help extends Command {
    constructor() {
        super({
            name: 'help',
            description: 'Show information about me.',
            cooldown: 5,
        })
    }

    override async run(interaction: ChatInputCommandInteraction) {
        const translate = Translator(interaction)
        const client = interaction.client as Client
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.settings.color)
                    .setDescription(translate(keys.help.presentation))
                    .addFields({
                        name: translate(keys.help.how_use),
                        value: `${translate(keys.help.how_use_answer)} \`/${interaction.commandName}\`.`,
                    })
                    .addFields({
                        name: translate(keys.help.need_support),
                        value: translate(keys.help.need_support_answer, {
                            inviteURL: client.officialServerURL,
                        }),
                    })
                    .addFields({
                        name: translate(keys.help.how_vote),
                        value: translate(keys.help.how_vote_answer),
                    })
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTitle(translate(keys.help.title)),
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
