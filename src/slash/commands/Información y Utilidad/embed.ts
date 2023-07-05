import {
    ApplicationCommandOptionType,
    PermissionsBitField,
    ColorResolvable,
    EmbedBuilder,
    ChannelType,
    Colors,
} from 'discord.js'
import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
// import langFile from '../../../lang/index.json' assert { type: 'json' }
import Client from '../../../structures/Client.js'
import Command from '../../../structures/Command.js'

export default class embed extends Command {
    constructor() {
        super({
            name: 'embed',
            description: 'Sends a embed.',
            description_localizations: {
                'es-ES': 'Envía un embed.',
            },
            cooldown: 5,
            options: [
                {
                    type: 7,
                    name: 'channel',
                    channel_types: [ChannelType.GuildText],
                    name_localizations: {
                        'es-ES': 'canal',
                    },
                    description: 'Channel where the embed will be sent.',
                    description_localizations: {
                        'es-ES': 'Canal deseado para enviar el embed',
                    },
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.Number,
                    name: 'color',
                    name_localizations: {
                        'es-ES': 'color',
                    },
                    description: 'Color of the embed',
                    description_localizations: {
                        'es-ES': 'Color a elegir del embed.',
                    },
                    choices: getColorChoices(),
                    required: true,
                },
                {
                    type: 3,
                    name: 'title',
                    name_localizations: {
                        'es-ES': 'titulo',
                    },
                    description: 'Title of the embed',
                    description_localizations: {
                        'es-ES': 'Título del embed',
                    },
                    required: true,
                },
                {
                    type: 3,
                    name: 'description',
                    name_localizations: {
                        'es-ES': 'descripcion',
                    },
                    description: 'Description of the embed',
                    description_localizations: {
                        'es-ES': 'Descripción del embed',
                    },
                    required: true,
                },
            ],
        })
    }
    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        //TODO: Add more colors && make it work with hex colors && Add language support
        const client = interaction.client as Client
        const canal = interaction.options.getChannel('channel', true, [ChannelType.GuildText]),
            descripcion = interaction.options.getString('description', true),
            color = interaction.options.getNumber('color', true),
            titulo = interaction.options.getString('title', true)
        const embed = new EmbedBuilder().setDescription(`${descripcion}`).setColor(color).setTitle(titulo)

        if (
            !canal
                .permissionsFor(client.user.id)
                ?.has([
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.EmbedLinks,
                    PermissionsBitField.Flags.ViewChannel,
                ])
        )
            return interaction.reply({
                content:
                    'No tengo los permisos `SEND_MESSAGES`, `EMBED_LINKS` ni `VIEW_CHANNEL`, que son necesarios para enviar el embed.',
            })

        canal.send({ embeds: [embed] })
        return interaction.reply({ content: 'Embed creado y enviado con éxito.' })
    }
}
function getColorChoices() {
    return [
        {
            name: 'Default',
            name_localizations: {
                'es-ES': 'Defecto',
            },
            value: Colors.Default,
        },
        {
            name: 'Aqua',
            name_localizations: {
                'es-ES': 'Agua',
            },
            value: Colors.Aqua,
        },
        {
            name: 'Dark Aqua',
            name_localizations: {
                'es-ES': 'Agua Oscuro',
            },
            value: Colors.DarkAqua,
        },
        {
            name: 'Green',
            name_localizations: {
                'es-ES': 'Verde',
            },
            value: Colors.Green,
        },
        {
            name: 'Dark Green',
            name_localizations: {
                'es-ES': 'Verde Oscuro',
            },
            value: Colors.DarkGreen,
        },
        {
            name: 'Blue',
            name_localizations: {
                'es-ES': 'Azul',
            },
            value: Colors.Blue,
        },
        {
            name: 'Dark Blue',
            name_localizations: {
                'es-ES': 'Azul Oscuro',
            },
            value: Colors.DarkBlue,
        },
        {
            name: 'Purple',
            name_localizations: {
                'es-ES': 'Morado',
            },
            value: Colors.Purple,
        },
        {
            name: 'Dark Purple',
            name_localizations: {
                'es-ES': 'Morado Oscuro',
            },
            value: Colors.DarkPurple,
        },
        {
            name: 'Lumious Vivid Pink',
            name_localizations: {
                'es-ES': 'Rosa Brillante',
            },
            value: Colors.LuminousVividPink,
        },
        {
            name: 'Dark Vivid Pink',
            name_localizations: {
                'es-ES': 'Rosa Brillante Oscuro',
            },
            value: Colors.DarkVividPink,
        },
        {
            name: 'Gold',
            name_localizations: {
                'es-ES': 'Oro',
            },
            value: Colors.Gold,
        },
        {
            name: 'Dark Gold',
            name_localizations: {
                'es-ES': 'Oro Oscuro',
            },
            value: Colors.DarkGold,
        },
        {
            name: 'Orange',
            name_localizations: {
                'es-ES': 'Naranja',
            },
            value: Colors.Orange,
        },
        {
            name: 'Dark Orange',
            name_localizations: {
                'es-ES': 'Naranja Oscuro',
            },
            value: Colors.DarkOrange,
        },
        {
            name: 'Red',
            name_localizations: {
                'es-ES': 'Rojo',
            },
            value: Colors.Red,
        },
        {
            name: 'Dark Red',
            name_localizations: {
                'es-ES': 'Rojo Oscuro',
            },
            value: Colors.DarkRed,
        },
        {
            name: 'Grey',
            name_localizations: {
                'es-ES': 'Gris',
            },
            value: Colors.Grey,
        },
        {
            name: 'Dark Grey',
            name_localizations: {
                'es-ES': 'Gris Oscuro',
            },
            value: Colors.DarkGrey,
        },
        {
            name: 'Darker Grey',
            name_localizations: {
                'es-ES': 'Gris Oscuro',
            },
            value: Colors.DarkerGrey,
        },
        {
            name: 'Light Grey',
            name_localizations: {
                'es-ES': 'Gris Claro',
            },
            value: Colors.LightGrey,
        },
        {
            name: 'Navy',
            name_localizations: {
                'es-ES': 'Azul Marino',
            },
            value: Colors.Navy,
        },
        {
            name: 'Dark Navy',
            name_localizations: {
                'es-ES': 'Azul Marino Oscuro',
            },
            value: Colors.DarkNavy,
        },
        {
            name: 'Yellow',
            name_localizations: {
                'es-ES': 'Amarillo',
            },
            value: Colors.Yellow,
        },
    ]
}
