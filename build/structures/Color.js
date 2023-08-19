import { Colors } from 'discord.js';
export default class Color {
    #rgb;
    constructor(color) {
        if (!Color.isColor(color)) {
            throw new TypeError('Invalid color');
        }
        if (Color.isHex(color)) {
            if (color.length === 4)
                color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
            const match = color.match(/^#(?<r>[A-Fa-f0-9]{2})(?<g>[A-Fa-f0-9]{2})(?<b>[A-Fa-f0-9]{2})$/);
            const { r, g, b } = match?.groups ?? {};
            this.#rgb = [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
        }
        if (Color.isHex0x(color)) {
            if (color.length === 5)
                color = `0x${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
            const match = color.match(/^0x(?<r>[A-Fa-f0-9]{2})(?<g>[A-Fa-f0-9]{2})(?<b>[A-Fa-f0-9]{2})$/);
            const { r, g, b } = match?.groups ?? {};
            this.#rgb = [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
        }
        if (Color.isRGB(color)) {
            const match = color.match(/^rgb\(?\s?(?<r>\d{1,3}),?\s*(?<g>\d{1,3}),?\s*(?<b>\d{1,3})\)?$/);
            const { r, g, b } = match?.groups ?? {};
            this.#rgb = [parseInt(r), parseInt(g), parseInt(b)];
        }
        if (Color.isName(color)) {
            const match = Colors[color].toString(16).match(/[0-9A-Za-z]{2}/g) ?? [];
            const [r, g, b] = match;
            this.#rgb = [parseInt(r ?? '0', 16), parseInt(g ?? '0', 16), parseInt(b ?? '0', 16)];
        }
        if (Color.isNumber(color)) {
            const match = parseInt(color).toString(16).match(/[0-9A-Za-z]{2}/g) ?? [];
            const [r, g, b] = match;
            this.#rgb = [parseInt(r ?? '0', 16), parseInt(g ?? '0', 16), parseInt(b ?? '0', 16)];
        }
    }
    get hex() {
        const [r, g, b] = this.#rgb.map(n => n.toString(16));
        return `#${r.length === 1 ? '0' + r : r}${g.length === 1 ? '0' + g : g}${b.length === 1 ? '0' + b : b}`;
    }
    get hex0x() {
        const [r, g, b] = this.#rgb.map(n => n.toString(16));
        return `0x${r.length === 1 ? '0' + r : r}${g.length === 1 ? '0' + g : g}${b.length === 1 ? '0' + b : b}`;
    }
    get rgbString() {
        return `rgb(${this.#rgb.join(', ')})`;
    }
    get rgb() {
        return this.#rgb;
    }
    get number() {
        const [r, g, b] = this.#rgb;
        return parseInt(`${r}${g}${b}`, 16);
    }
    static isColor(color) {
        return Color.isHex(color) ||
            Color.isHex0x(color) ||
            Color.isRGB(color) ||
            Color.isName(color) ||
            Color.isNumber(color);
    }
    static isHex(color) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }
    static isHex0x(color) {
        return /^0x([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }
    static isRGB(color) {
        return /^rgb\(?\s?(?<r>\d{1,3}),?\s*(?<g>\d{1,3}),?\s*(?<b>\d{1,3})\)?$/.test(color);
    }
    static isName(color) {
        return Object.keys(Colors).some(c => c === color);
    }
    static isNumber(color) {
        if (color === '0')
            return true;
        return /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(parseInt(color).toString(16));
    }
}
//# sourceMappingURL=Color.js.map