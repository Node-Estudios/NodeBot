import Command from '#structures/Command.js'
import { ChatInputCommandInteraction } from 'discord.js'
// import Client from '#structures/Client.js'
// import Translator, { keys } from '#utils/Translator.js'
// import { MessageHelper } from '../../../handlers/messageHandler.js'
// import Player from '#structures/Player.js'

export default class NowPlaying extends Command {
    constructor () {
        super({
            name: 'nowplaying',
            description: 'See the current song playing.',
            cooldown: 5,
        })
    }

    override async run (interaction: ChatInputCommandInteraction<'cached'>) {
        /*         const client = interaction.client as Client
        const translate = Translator(interaction)
        const message = new MessageHelper(interaction)
        const player = await Player.tryGetPlayer(interaction, false)

        // if (!player?.queue.current) {
        //      return await message.sendEphemeralMessage({
        //  embeds: [
        //       new EmbedBuilder().setColor(client.settings.color).setFooter({
        //            text: translate(keys.skip.messages[1]), // me gusta

                    }),
                ],
            }, true)
        } */
        return await interaction.reply({ content: 'En desarrollo, comando no disponible' })
        // const song = player.queue.current
        // const parsedCurrentDuration = moment
        //   .duration(player.position, 'milliseconds')
        //   .format('mm:ss', {
        //        trim: false,
        //   })
        // const parsedDuration = moment
        //   .duration(duration, 'milliseconds')
        //   .format('mm:ss', {
        //       trim: false,
        //  })
        // const part = Math.floor((player.position / duration) * 30)
        // const uni = player.playing ? '▶' : '⏸️'
        // const thumbnail = `https://img.youtube.com/vi/${identifier}/maxresdefault.jpg`
        // const user = `<@${requester.userId}>`
    }
}
