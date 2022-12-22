import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js';
import Command from '../../../structures/command';
import Client from '../../../structures/client';

export default class ball extends Command {
    constructor(client: Client) {
        super(client, {
            name: '8ball',
            description: 'Ask the magic 8ball a question',
            name_localizations: {
                'es-ES': 'ball',
            },
            description_localizations: {
                'es-ES': 'Pregunta al poderoso 8ball una pregunta',
            },
            cooldown: 5,
            options: [
                {
                    type: 3,
                    name: 'question',
                    description: 'The question to ask',
                    name_localizations: {
                        'es-ES': 'pregunta',
                    },
                    description_localizations: {
                        'es-ES': 'La pregunta a preguntar',
                    },
                    required: true,
                },
            ],
        });
    }
    async run(client: Client, interaction: CommandInteraction, args: any) {
        // try {
        let respuesta = client.language.QUESTIONBALL[4];
        let argumentos = args.join(' ');
        if (!argumentos.includes('?')) {
            const errorembed = new MessageEmbed()
                .setColor('RED')
                .setTitle(client.language.ERROREMBED)
                .setDescription(client.language.QUESTIONBALL[3])
                .setFooter(
                    interaction.member!.user.username + '#' + interaction.member!.user.discriminator,
                    interaction.user.displayAvatarURL({ format: 'png', dynamic: true }),
                );
            return interaction.editReply({
                embeds: [errorembed],
            });
        }
        var random = respuesta[Math.floor(Math.random() * respuesta.length)]; //aqui decimos que va a elegir una respuesta random de el let respuesta
        const embed = new MessageEmbed() //definimos el embed
            .addField(client.language.QUESTIONBALL[1], `${args.join(' ')}`) //primer valor decimos a su pregunta y en el segundo valor va la pregunta que iso el usuario
            .addField(client.language.QUESTIONBALL[2], `${random}`) //primer valor decimos "Mi respuesta" y en el segundo decimos que va a agarrar el var random
            .setColor(client.settings.color as ColorResolvable); //un color random
        interaction.editReply({
            embeds: [embed],
        }); //y que mande el embed
    }
}
