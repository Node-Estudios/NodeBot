import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js';
import Command from '../../../structures/command';
import Client from '../../../structures/client';
import fetch from 'node-fetch';

export default class mchistory extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'mchistory',
            description: 'Show the history of a Minecraft account.',
            description_localizations: {
                'es-ES': 'Muesrta el historial de una cuenta de Minecraft.',
            },
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: 'account',
                    description: 'The account to show the history of.',
                    name_localizations: {
                        'es-ES': 'cuenta',
                    },
                    description_localizations: {
                        'es-ES': 'La cuenta para mostrar el historial.',
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
        let args2 = args.join('%20');
        let Fecha;
        let NameMC;
        if (!args2[1]) return interaction.editReply(client.language.MCHISTORY[1] + '/' + client.language.MCHISTORY[2]);
        fetch(`https://mc-heads.net/minecraft/profile/${args2}`)
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                } else {
                    const errorembed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(client.language.ERROREMBED)
                        .setDescription(client.language.MCHISTORY[3])
                        .setFooter(
                            interaction.user.username + '#' + interaction.user.discriminator,
                            interaction.user.displayAvatarURL(),
                        );
                    interaction.editReply({ embeds: [errorembed] });
                    return undefined;
                }
            })
            .then(History_Info => {
                if (!History_Info) return;

                const embedhistory = new MessageEmbed()
                    .setTitle(client.language.MCHISTORY[4])
                    .setColor(process.env.bot1Embed_Color as ColorResolvable)
                    .setTimestamp();

                // @ts-ignore
                for (var index = 0; index < History_Info['name_history'].length; index++) {
                    // @ts-ignore
                    Fecha = History_Info['name_history'][index]['changedToAt'];
                    // @ts-ignore
                    NameMC = History_Info['name_history'][index]['name'];

                    if (!Fecha) {
                        embedhistory.addField(client.language.MCHISTORY[5], NameMC); // LENGUAJEEEEEEEEEEEEEEE
                    } else {
                        embedhistory.addField(parserTimeStamp(Fecha), NameMC);
                    }
                }
                interaction.editReply({
                    embeds: [embedhistory],
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
function add_cero_day(numero: number) {
    if (numero.toString().length == 1) {
        return '0' + numero;
    } else {
        return numero;
    }
}

function parserTimeStamp(date: Date) {
    date = new Date(date);
    return (
        add_cero_day(date.getDate()) +
        '-' +
        add_cero_day(date.getMonth() + 1) +
        '-' +
        add_cero_day(date.getFullYear()) +
        '  ' +
        add_cero_day(date.getHours()) +
        ':' +
        add_cero_day(date.getMinutes()) +
        ':' +
        add_cero_day(date.getSeconds())
    );
}
