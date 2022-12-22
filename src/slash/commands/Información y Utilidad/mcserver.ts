import { ColorResolvable, CommandInteraction, MessageAttachment, MessageEmbed } from 'discord.js';
import Command from '../../../structures/command';
import Client from '../../../structures/client';
import axios from 'axios';

export default class mcserver extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'mcserver',
            description: 'Send a image of a Minecraft server.',
            description_localizations: {
                'es-ES': 'Envía una imagen de un servidor de Minecraft.',
            },
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: 'server',
                    description: 'Minecraft server to show the image of.',
                    name_localizations: {
                        'es-ES': 'servidor',
                    },
                    description_localizations: {
                        'es-ES': 'Servidor de Minecraft.',
                    },
                    required: true,
                },
            ],
        });
    }
    /**,
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async run(client: Client, interaction: CommandInteraction, args: any) {
        // try {
        let url;
        args = args[0].split(':');
        if (args[1]) {
            url = `http://status.mclive.eu/${args[0]}/${args[0]}/${args[1]}/banner.png`;
        } else {
            url = `http://status.mclive.eu/${args[0]}/${args[0]}/25565/banner.png`;
        }
        axios
            .get(url, {
                responseType: 'arraybuffer',
            })
            .then(image => {
                let returnedB64 = Buffer.from(image.data).toString('base64');
                const sfattach = new MessageAttachment(image.data, 'output.png');
                interaction.editReply({
                    embeds: [],
                    files: [sfattach],
                });
            })
            .catch(() => {
                const errorembed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(client.language.ERROREMBED)
                    .setDescription(client.language.MCSERVER[12])
                    .setFooter(
                        interaction.user.username + '#' + interaction.user.discriminator,
                        interaction.user.displayAvatarURL(),
                    );
                return interaction.editReply({
                    embeds: [errorembed],
                });
            });
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
