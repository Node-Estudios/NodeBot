import Autocomplete from '#structures/Autocomplete.js'
import Color from '#structures/Color.js'
import Translator, { keys } from '#utils/Translator.js'
import logger from '#utils/logger.js'
import { AutocompleteInteraction, Colors } from 'discord.js'

export default class Embed extends Autocomplete {
    constructor () {
        super('embed')
    }

    override async run (interaction: AutocompleteInteraction) {
        const translate = Translator(interaction)
        const invalidInput = translate(keys.embed.invalid_input)
        const focused = interaction.options.getFocused()?.trim()
        const suggestions: Array<{ name: string, value: string }> = []
        const values = Object.values(Colors)
        if (!focused) {
            if (!this.canProced(interaction.user.id, interaction.id)) return false
            await interaction.respond([
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
            return true
        } else if (focused.startsWith('#')) {
            if (!Color.isHex(focused)) suggestions.push({ name: invalidInput, value: '#000000' })
            for (let i = 0, random = Math.floor(Math.random() * values.length); i < 24; i++, random = Math.floor(Math.random() * values.length)) suggestions.push({ name: `#${values[random].toString(16)}`, value: `${values[random]}` })
        } else if (focused.startsWith('0x')) {
            if (!Color.isHex0x(focused)) suggestions.push({ name: invalidInput, value: '0x000000' })
            for (let i = 0, random = Math.floor(Math.random() * values.length); i < 24; i++, random = Math.floor(Math.random() * values.length)) suggestions.push({ name: `0x${values[random].toString(16)}`, value: `${values[random]}` })
        } else if (focused.startsWith('rgb')) {
            if (!Color.isRGB(focused)) suggestions.push({ name: invalidInput, value: 'rgb(0, 0, 0)' })
            for (let i = 0; i < 24; i++) {
                const random = Math.floor(Math.random() * values.length)
                const [r, g, b] = new Color(`${values[random]}`).rgb
                suggestions.push({ name: `rgb(${r}, ${g}, ${b})`, value: `rgb(${r ?? 0}, ${g ?? 0}, ${b ?? 0})` })
            }
        } else {
            const colors = Object.entries(Colors)
            suggestions.push(...colors.filter(([name]) => name.toLowerCase().includes(focused.toLowerCase())).map(([name, value]) => ({ name, value: `${value}` })))
            suggestions.push(...colors.filter(([key]) => suggestions.some(({ name }) => name !== key)).map(([name, value]) => ({ name, value: `${value}` })))
        }
        if (suggestions.length > 25) suggestions.length = 25
        if (!this.canProced(interaction.user.id, interaction.id)) return false
        await interaction.respond(suggestions).catch(logger.error)
        return true
    }
}
