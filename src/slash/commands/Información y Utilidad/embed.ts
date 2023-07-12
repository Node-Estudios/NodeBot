import {
    ApplicationCommandOptionType,
    PermissionsBitField,
    EmbedBuilder,
    ChannelType,
    Colors,
} from 'discord.js'
import { ChatInputCommandInteractionExtended } from '../../../events/client/interactionCreate.js'
import Translator from '../../../utils/Translator.js'
import Command from '../../../structures/Command.js'
import { keys } from '../../../utils/locales.js'

export default class embed extends Command {
    constructor() {
        super({
            name: 'embed',
            description: 'Sends a embed.',
            description_localizations: {
                'es-ES': 'Envía un embed.',
                'en-US': 'Sends a embed.',
            },
            name_localizations: {
                'es-ES': 'embed',
                'en-US': 'embed',
            },
            cooldown: 5,
            permissions: {
                botPermissions: new PermissionsBitField([
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.EmbedLinks,
                    PermissionsBitField.Flags.ViewChannel,
                ]),
            },
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: 'channel',
                    channel_types: [ChannelType.GuildText],
                    name_localizations: {
                        'es-ES': 'canal',
                        'en-US': 'channel',
                    },
                    description: 'Channel where the embed will be sent.',
                    description_localizations: {
                        'es-ES': 'Canal deseado para enviar el embed',
                        'en-US': 'Channel where the embed will be sent.',
                    },
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.Number,
                    name: 'color',
                    name_localizations: {
                        'es-ES': 'color',
                        'en-US': 'color',
                    },
                    description: 'Color of the embed',
                    description_localizations: {
                        'es-ES': 'Color a elegir del embed.',
                        'en-US': 'Color of the embed',
                    },
                    choices: getColorChoices(),
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'title',
                    name_localizations: {
                        'es-ES': 'titulo',
                        'en-US': 'title',
                    },
                    description: 'Title of the embed',
                    description_localizations: {
                        'es-ES': 'Título del embed',
                        'en-US': 'Title of the embed',
                    },
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'description',
                    name_localizations: {
                        'es-ES': 'descripcion',
                        'en-US': 'description',
                    },
                    description: 'Description of the embed',
                    description_localizations: {
                        'es-ES': 'Descripción del embed',
                        'en-US': 'Description of the embed',
                    },
                    required: true,
                },
            ],
        })
    }
    override async run(interaction: ChatInputCommandInteractionExtended<'cached'>) {
        //TODO: Add more colors && make it work with hex colors && Add language support
        const canal = interaction.options.getChannel('channel', true, [ChannelType.GuildText]),
            descripcion = interaction.options.getString('description', true),
            color = interaction.options.getNumber('color', true),
            titulo = interaction.options.getString('title', true)
        const embed = new EmbedBuilder().setDescription(`${descripcion}`).setColor(color).setTitle(titulo)

        canal.send({ embeds: [embed] })
        return interaction.reply(Translator(interaction)(keys.embed_successfully))
    }
}
function getColorChoices() {
    return [
        {
            name: 'Default',
            name_localizations: {
                'es-ES': 'Defecto',
                'en-US': 'Default'
            },
            value: Colors.Default,
        },
        {
            name: 'Aqua',
            name_localizations: {
                'es-ES': 'Agua',
                'en-US': 'Aqua'
            },
            value: Colors.Aqua,
        },
        {
            name: 'Dark Aqua',
            name_localizations: {
                'es-ES': 'Agua Oscuro',
                'en-US': 'Dark Aqua'
            },
            value: Colors.DarkAqua,
        },
        {
            name: 'Green',
            name_localizations: {
                'es-ES': 'Verde',
                'en-US': 'Green'
            },
            value: Colors.Green,
        },
        {
            name: 'Dark Green',
            name_localizations: {
                'es-ES': 'Verde Oscuro',
                'en-US': 'Dark Green'
            },
            value: Colors.DarkGreen,
        },
        {
            name: 'Blue',
            name_localizations: {
                'es-ES': 'Azul',
                'en-US': 'Blue'
            },
            value: Colors.Blue,
        },
        {
            name: 'Dark Blue',
            name_localizations: {
                'es-ES': 'Azul Oscuro',
                'en-US': 'Dark Blue'
            },
            value: Colors.DarkBlue,
        },
        {
            name: 'Purple',
            name_localizations: {
                'es-ES': 'Morado',
                'en-US': 'Purple'
            },
            value: Colors.Purple,
        },
        {
            name: 'Dark Purple',
            name_localizations: {
                'es-ES': 'Morado Oscuro',
                'en-US': 'Dark Purple'
            },
            value: Colors.DarkPurple,
        },
        {
            name: 'Lumious Vivid Pink',
            name_localizations: {
                'es-ES': 'Rosa Brillante',
                'en-US': 'Lumious Vivid Pink'
            },
            value: Colors.LuminousVividPink,
        },
        {
            name: 'Dark Vivid Pink',
            name_localizations: {
                'es-ES': 'Rosa Brillante Oscuro',
                'en-US': 'Dark Vivid Pink'
            },
            value: Colors.DarkVividPink,
        },
        {
            name: 'Gold',
            name_localizations: {
                'es-ES': 'Oro',
                'en-US': 'Gold'
            },
            value: Colors.Gold,
        },
        {
            name: 'Dark Gold',
            name_localizations: {
                'es-ES': 'Oro Oscuro',
                'en-US': 'Dark Gold'
            },
            value: Colors.DarkGold,
        },
        {
            name: 'Orange',
            name_localizations: {
                'es-ES': 'Naranja',
                'en-US': 'Orange'
            },
            value: Colors.Orange,
        },
        {
            name: 'Dark Orange',
            name_localizations: {
                'es-ES': 'Naranja Oscuro',
                'en-US': 'Dark Orange'
            },
            value: Colors.DarkOrange,
        },
        {
            name: 'Red',
            name_localizations: {
                'es-ES': 'Rojo',
                'en-US': 'Red'
            },
            value: Colors.Red,
        },
        {
            name: 'Dark Red',
            name_localizations: {
                'es-ES': 'Rojo Oscuro',
                'en-US': 'Dark Red'
            },
            value: Colors.DarkRed,
        },
        {
            name: 'Grey',
            name_localizations: {
                'es-ES': 'Gris',
                'en-US': 'Grey'
            },
            value: Colors.Grey,
        },
        {
            name: 'Dark Grey',
            name_localizations: {
                'es-ES': 'Gris Oscuro',
                'en-US': 'Dark Grey'
            },
            value: Colors.DarkGrey,
        },
        {
            name: 'Darker Grey',
            name_localizations: {
                'es-ES': 'Gris Oscuro',
                'en-US': 'Darker Grey'
            },
            value: Colors.DarkerGrey,
        },
        {
            name: 'Light Grey',
            name_localizations: {
                'es-ES': 'Gris Claro',
                'en-US': 'Light Grey'
            },
            value: Colors.LightGrey,
        },
        {
            name: 'Navy',
            name_localizations: {
                'es-ES': 'Azul Marino',
                'en-US': 'Navy'
            },
            value: Colors.Navy,
        },
        {
            name: 'Dark Navy',
            name_localizations: {
                'es-ES': 'Azul Marino Oscuro',
                'en-US': 'Dark Navy'
            },
            value: Colors.DarkNavy,
        },
        {
            name: 'Yellow',
            name_localizations: {
                'es-ES': 'Amarillo',
                'en-US': 'Yellow'
            },
            value: Colors.Yellow,
        },
    ]
}
