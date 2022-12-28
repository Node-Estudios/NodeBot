import { GuildMember, CommandInteraction, Interaction, ButtonInteraction, Collection } from 'discord.js'
import Client from '../../structures/Client.js'
import commands from '../../cache/commands.js'
import buttons from '../../cache/buttons.js'
import logger from '../../utils/logger.js'
import Statcord from 'statcord.js'

const cooldowns = new Collection<string, Collection<string, number>>()

export default async function (interaction: Interaction<'cached'>) {
    if (interaction.guildId !== process.env.enabledGuild && process.env.enableCmds !== 'true') return
    if (!interaction.guild) return

    if (interaction.isCommand()) handleCommand(interaction as CommandInteraction<'cached'>)
    else if (interaction.isButton()) handleButton(interaction as ButtonInteraction<'cached'>)
}

async function handleCommand(interaction: CommandInteraction<'cached'>) {
    const client = interaction.client as Client
    const cmd = commands.find(c => c.name === interaction.commandName)

    if (!cmd)
        return interaction.reply({
            content: 'No se encontró el comando',
            embeds: [],
            components: [],
            files: [],
        })
    logger.debug(`Comando ${cmd.name} ejecutado`)

    //CHECK PERMISSIONS *COPIADO DE OTRO BOT XD
    // ! no used for now
    // if (cmd.permissions) {
    //     const missingPermissions = cmd.permissions.botPermissions.filter(
    //         (p: any) => !interaction.guild.me?.permissions.has(p),
    //     )
    //     if (missingPermissions.length) {
    //         return interaction.reply({
    //             content: `No tengo los permisos necesarios para ejecutar este comando, Permisos necesarios: **${missingPermissions.join(
    //                 ', ',
    //             )}**\nHey! Tienes problemas? Entra en nuestro servidor.`,
    //             embeds: [],
    //         })
    //     }
    //     if (
    //         cmd.permissions.botPermissions.includes(Permissions.FLAGS.CONNECT) &&
    //         !(interaction.member as GuildMember).voice.channel
    //             ?.permissionsFor(client.user.id)
    //             ?.has(Permissions.FLAGS.CONNECT)
    //     )
    //         return interaction.editReply({
    //             content: 'No tengo permisos de conectarme al canal de voz donde estás',
    //             embeds: [],
    //         })
    //     if (
    //         cmd.permissions.botPermissions.includes(Permissions.FLAGS.SPEAK) &&
    //         !(interaction.member as GuildMember).voice.channel
    //             ?.permissionsFor(client.user.id)
    //             ?.has(Permissions.FLAGS.SPEAK)
    //     )
    //         return interaction.editReply({
    //             content: 'No tengo permisos de hablar en el canal de voz donde estás',
    //             embeds: [],
    //         })
    //     //CHECK PERMISSION
    //     if (cmd.permissions.dev === true && !client.devs.includes(interaction.user.id))
    //         return interaction.editReply({
    //             content: 'Comando exclusivo para devs',
    //             embeds: [],
    //         })
    // }

    //COOLDOWN, TAMBIÉN COPIADO DE OTRO BOT EKISDEEEEE
    if (!client.devs.includes(interaction.user.id)) {
        if (!cooldowns.has(interaction.commandName))
            cooldowns.set(interaction.commandName, new Collection<string, number>())
        const now = Date.now()
        const timestamps = cooldowns.get(interaction.commandName) as Collection<string, number>
        const cooldownAmount = Math.floor(cmd.cooldown || 5) * 1000
        if (!timestamps.has(interaction.user.id)) timestamps.set(interaction.user.id, now + cooldownAmount)
        else {
            const expirationTime = (timestamps.get(interaction.user.id) ?? 0) + cooldownAmount
            const timeLeft = (expirationTime - now) / 1000
            if (now < expirationTime && timeLeft > 0.9)
                return interaction.reply({
                    content: `Heyy! Ejecutas los coamndos demasiado rápido! Espera ${timeLeft.toFixed(
                        1,
                    )} segundos para ejecutar \`${interaction.commandName}\``,
                })
        }
    }
    cmd.run(interaction)
    if (process.env.NODE_ENV == 'production')
        Statcord.ShardingClient.postCommand(cmd.name, (interaction.member as GuildMember).id, client)
}

async function handleButton(interaction: ButtonInteraction<'cached'>) {
    logger.debug(`Button ${interaction.customId} pressed`)
    buttons.get(interaction.customId)?.(interaction)
}
