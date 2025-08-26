import { AutocompleteInteraction } from 'discord.js'
import Autocomplete from '#structures/Autocomplete.js'
import Client from '#structures/Client.js'
import logger from '#utils/logger.js'

export default class Play extends Autocomplete {
    constructor() {
        super('play')
    }

    override async run(interaction: AutocompleteInteraction): Promise<boolean> {
        const client = interaction.client as Client
        const focusedValue = interaction.options.getFocused()

        if (!focusedValue) {
            await interaction.respond([])
            return true
        }

        // CAMBIO: Se ha añadido un bloque try...catch para manejar errores de búsqueda
        try {
            const tracks = await client.music.search(
                focusedValue,
                interaction.user,
            )

            if (!tracks) {
                await interaction.respond([])
                return true
            }

            await interaction.respond(
                tracks
                    .map((track: any) => ({
                        name: `[${track.duration_string}] ${track.title}`.slice(
                            0,
                            100,
                        ),
                        value: track.id,
                    }))
                    .slice(0, 25),
            )
            return true // Indicar que la interacción fue exitosa
        } catch (error) {
            logger.error('Error en el autocompletado de Play:', error)
            // Responder con un array vacío si hay un error para que no se congele
            await interaction.respond([]).catch(() => {})
            return false // Indicar que hubo un error
        }
    }
}
