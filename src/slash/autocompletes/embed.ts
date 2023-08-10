import Autocomplete from '#structures/Autocomplete.js'
import logger from '#utils/logger.js'
import { AutocompleteInteraction, Colors } from 'discord.js'

export default class Embed extends Autocomplete {
    constructor () {
        super('embed')
    }

    override async run (interaction: AutocompleteInteraction) {
        const focused = interaction.options.getFocused()?.trim()
        const suggestions: Array<{ name: string, value: string }> = []
        if (!focused) {
            return await interaction.respond([
                { name: 'Default', value: `${Colors.Default}` },
                { name: '#000', value: `${Colors.Default}` },
                { name: '0x000000', value: `${Colors.Default}` },
                { name: 'rgb(0, 0, 0)', value: `${Colors.Default}` },
                { name: 'White', value: `${Colors.White}` },
                { name: '#ffffff', value: `${Colors.White}` },
                { name: '0xffffff', value: `${Colors.White}` },
                { name: 'rgb(255, 255, 255)', value: `${Colors.White}` },
                { name: 'Red', value: `${Colors.Red}` },
                { name: '#FF0000', value: `${Colors.Red}` },
                { name: '0xFF0000', value: `${Colors.Red}` },
                { name: 'rgb 255, 0, 0', value: `${Colors.Red}` },
                { name: 'Green', value: `${Colors.Green}` },
                { name: '#00FF00', value: `${Colors.Green}` },
                { name: '0x00FF00', value: `${Colors.Green}` },
                { name: 'rgb(0 255 0)', value: `${Colors.Green}` },
                { name: 'Blue', value: `${Colors.Blue}` },
                { name: '#0000FF', value: `${Colors.Blue}` },
                { name: '0x0000ff', value: `${Colors.Blue}` },
                { name: 'rgb 0 0 255', value: `${Colors.Blue}` },
            ]).catch(logger.error)
        } else if (focused.startsWith('#')) {
            if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(focused)) { suggestions.push({ name: 'invalid input', value: '#000000' }) }
            const values = Object.values(Colors)
            for (let i = 0, random = Math.floor(Math.random() * values.length); i < 24; i++, random = Math.floor(Math.random() * values.length)) { suggestions.push({ name: `#${values[random].toString(16)}`, value: `${values[random]}` }) }
        } else if (focused.startsWith('0x')) {
            if (!/^0x([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(focused)) { suggestions.push({ name: 'invalid input', value: '0x000000' }) }
            const values = Object.values(Colors)
            for (let i = 0, random = Math.floor(Math.random() * values.length); i < 24; i++, random = Math.floor(Math.random() * values.length)) { suggestions.push({ name: `0x${values[random].toString(16)}`, value: `${values[random]}` }) }
        } else if (focused.startsWith('rgb')) {
            const rgbMatch = focused.match(/^rgb\(?\s?(?<r>\d{1,3}),?\s*(?<g>\d{1,3}),?\s*(?<b>\d{1,3})\)?$/)
            if (!rgbMatch) { suggestions.push({ name: 'invalid input', value: 'rgb(0, 0, 0)' }) }
            const matches = rgbMatch?.groups ?? {}
            const r = parseInt(matches.r)
            const g = parseInt(matches.g)
            const b = parseInt(matches.b)
            if (!(r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255)) {
                suggestions.push({ name: 'invalid RGB input', value: 'rgb(0, 0, 0)' })
            }
            const values = Object.values(Colors)
            for (let i = 0, random = Math.floor(Math.random() * values.length); i < 24; i++, random = Math.floor(Math.random() * values.length)) {
                const [r, g, b] = values[random].toString(16).match(/[0-9A-Za-z]{2}/g) ?? []
                suggestions.push({ name: `rgb(${r ?? 0}, ${g ?? 0}, ${b ?? 0})`, value: `rgb(${r ?? 0}, ${g ?? 0}, ${b ?? 0})` })
            }
        } else {
            const colors = Object.entries(Colors)
            suggestions.push(...colors.filter(([name]) => name.toLowerCase().includes(focused.toLowerCase())).map(([name, value]) => ({ name, value: `${value}` })))
            suggestions.push(...colors.filter(([key]) => suggestions.some(({ name }) => name !== key)).map(([name, value]) => ({ name, value: `${value}` })))
        }
        if (suggestions.length > 25) suggestions.length = 25
        return await interaction.respond(suggestions).catch(logger.error)
    }
}
