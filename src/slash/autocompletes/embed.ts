import Autocomplete from '#structures/Autocomplete.js'
import logger from '#utils/logger.js'
import { AutocompleteInteraction, Colors } from 'discord.js'

export default class Embed extends Autocomplete {
    constructor () {
        super('embed')
    }

    override async run (interaction: AutocompleteInteraction) {
        const focused = interaction.options.getFocused()?.trim()
        if (!focused) {
            return await interaction.respond([
                { name: 'Default', value: `${Colors.Default}` },
                { name: '#000', value: `${Colors.Default}` },
                { name: '#ffffff', value: `${Colors.White}` },
                { name: '0x000000', value: `${Colors.Default}` },
                { name: 'rgb(0, 255, 0)', value: `${Colors.White}` },
            ]).catch(logger.error)
        } else if (focused.startsWith('#')) {
            if (focused.length > 7) {
                return await interaction.respond([
                    { name: 'invalid color', value: `${Colors.Default}` },
                ])
            }
            if (focused.length < 7 && focused.length > 4) {
                return await interaction.respond([
                    { name: 'invalid color', value: `${Colors.Default}` },
                ])
            }
            if (focused.length === 1) {
                return await interaction.respond([
                    { name: '#000000', value: `${Colors.Default}` },
                ])
            }
            if (/[^A-Fa-f0-9]/.test(focused.slice(1))) {
                return await interaction.respond([
                    { name: 'invalid color', value: `${Colors.Default}` },
                ])
            }
            if (focused.length === 4) {
                return await interaction.respond([
                    { name: focused + focused.slice(1), value: focused + focused.slice(1) },
                ])
            }
            return await interaction.respond([
                { name: focused, value: focused },
            ])
        } else if (focused.startsWith('0x')) {
            if (focused.length > 8) {
                return await interaction.respond([
                    { name: 'invalid color', value: `${Colors.Default}` },
                ])
            }
            if (focused.length < 8 && focused.length > 5) {
                return await interaction.respond([
                    { name: 'invalid color', value: `${Colors.Default}` },
                ])
            }
            if (focused.length === 2) {
                return await interaction.respond([
                    { name: '0x000000', value: `${Colors.Default}` },
                ])
            }
            if (/[^A-Fa-f0-9]/.test(focused.slice(2))) {
                return await interaction.respond([
                    { name: 'invalid color', value: `${Colors.Default}` },
                ])
            }
            if (focused.length === 5) {
                return await interaction.respond([
                    { name: focused + focused.slice(2), value: focused + focused.slice(2) },
                ])
            }
            return await interaction.respond([
                { name: focused, value: focused },
            ])
        } else if (focused.startsWith('rgb')) {
            const rgb = focused.slice(3).trim().replace(/\(|\)/g, '').split(',').map(n => Number(n.trim()))
            if (rgb.length !== 3) {
                return await interaction.respond([
                    { name: 'invalid color', value: `${Colors.Default}` },
                ])
            }
            if (rgb.some(n => isNaN(n))) {
                return await interaction.respond([
                    { name: 'invalid color', value: `${Colors.Default}` },
                ])
            }
            if (rgb.some(n => n < 0 || n > 255)) {
                return await interaction.respond([
                    { name: 'invalid color', value: `${Colors.Default}` },
                ])
            }
            return await interaction.respond([
                { name: focused, value: focused },
            ])
        } else {
            const colors = Object.entries(Colors)
            const response = colors.filter(([name]) => name.toLowerCase().includes(focused.toLowerCase()))
            response.push(...colors.filter(([key]) => response.some(([name]) => name !== key)))
            if (response.length > 25) response.length = 25
            return await interaction.respond(response.map(([name, value]) => ({ name, value: `${value}` }))).catch(logger.error)
        }
    }
}
