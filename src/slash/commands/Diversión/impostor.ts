import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js';
import Command from '../../../structures/command';
import Client from '../../../structures/client';

export default class impostor extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'impostor',
            description: 'Are you the impostor? SUS',
            description_localizations: {
                'es-ES': 'Eres el impostor? SUS',
            },
            cooldown: 5,
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: 'Are this user the impostor? SUS na na na na na na na',
                    name_localizations: {
                        'es-ES': 'usuario',
                    },
                    description_localizations: {
                        'es-ES': 'Es este usuario el impostor? SUS na na na na na na na',
                    },
                    required: false,
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
        let mencionado;
        if (args[0]) {
            mencionado = await interaction.guild?.members.fetch(args[0].replace('<@', '').replace('>', '')).catch(e => {
                return;
            });
        }
        if (!mencionado && args[0]) {
            const errorembed = new MessageEmbed()
                .setColor('RED')
                .setTitle(client.language.ERROREMBED)
                .setDescription(client.language.IMPOSTOR[3])
                .setFooter(
                    interaction.user.username + '#' + interaction.user.discriminator,
                    interaction.user.displayAvatarURL(),
                );
            return interaction.editReply({
                embeds: [errorembed],
            });
        }
        let random = [client.language.IMPOSTOR[1], client.language.IMPOSTOR[2]]; //Hacemos frases para ver si es o no

        if (!mencionado)
            //Si el autor no menciono a nadie

            return interaction.editReply({
                content: `. 　　　。　　　　•　 　ﾟ　　。 　　.

        　　　.　　　 　　.　　　　　。　　 。　. 　

        .　　 。　　　　　 ඞ 。 . 　　 • 　　　　•

        　　ﾟ　　 ${interaction.user.username + '#' + interaction.user.discriminator} ${
                    random[Math.floor(Math.random() * random.length)]
                } 　 。　.

        　　'　　　  　 　　。     ,         ﾟ             ,   ﾟ      .       ,        .             ,

        　　ﾟ　　　.　　　. ,　　　　.　 .`,
                embeds: [],
            }); //Enviamos el mensaje

        //Pero si menciona

        interaction.editReply({
            content: `. 　　　。　　　　•　 　ﾟ　　。 　　.

        　　　.　　　 　　.　　　　　。　　 。　. 　

        .　　 。　　　　　 ඞ 。 . 　　 • 　　　　•.                                     .

        　　ﾟ　　 ${mencionado.user.username + '#' + mencionado.user.discriminator} ${
                random[Math.floor(Math.random() * random.length)]
            } 　 。　.

        　　'　　　  　 　　。                                          .
        。  
        　　ﾟ　　　.　　　. ,　　　　.　 .`,
            embeds: [],
        });
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
