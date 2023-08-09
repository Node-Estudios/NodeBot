import { ApplicationCommandOptionType, AttachmentBuilder, ChatInputCommandInteraction } from 'discord.js'
import Command from '../../../structures/Command.js'
export default class mcserver extends Command {
    constructor () {
        super({
            name: 'mcserver',
            description: 'Send a image of a Minecraft server.',
            cooldown: 5,
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'server',
                    description: 'Minecraft server to show the image of.',
                    required: true,
                },
            ],
        })
    }

    override async run (interaction: ChatInputCommandInteraction) {
        const server = interaction.options.getString('server', true)
        interaction.reply({
            files: [
                new AttachmentBuilder(`http://status.mclive.eu/${server}/${server}/banner.png`, {
                    name: server + '.png',
                }),
            ],
        })
    }
}
