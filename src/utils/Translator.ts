import { Guild, Interaction, Locale, LocaleString, LocalizationMap } from 'discord.js'
import logger from './logger.js'
import keys from './locales.js'
import { join } from 'path'
import i18n from 'i18n'

i18n.configure({
    locales: ['en', 'es'],
    directory: join(process.cwd(), 'locales'),
    defaultLocale: 'en',
    retryInDefaultLocale: true,
    objectNotation: true,
    fallbacks: {
        'en-*': 'en',
        'es-*': 'es',
    },
    logDebugFn: (msg) => logger.debug(msg),
    logWarnFn: (msg) => logger.warn(msg),
    logErrorFn: (msg) => logger.error(msg),
    missingKeyFn: (locale, value) => {
        logger.warn(`Missing key ${value} in locale ${locale}`)
        return value
    },
})

/**
 * It takes a phrase and an optional object of parameters, and returns a translated string
 * @param {string} phrase - The phrase to translate
 * @param {object} [replace] - An object whit the parameters to replace
 * @returns {string} - The translated string
 */
type translate = (phrase: string, replace?: object) => string

/**
 * It takes an interaction and returns a function that takes a phrase and returns a translation
 * @param {Interaction | Guild} interaction - Interaction - The interaction object that contains the locale and client.
 * @returns {transalte} A function that takes a phrase and params and returns a string.
 */
export default function Translator (interaction: Interaction | Guild | LocaleString): translate {
    const lang = typeof interaction === 'string' ? interaction : (interaction as Interaction).locale ?? (interaction as Guild).preferredLocale ?? 'en'

    return (phrase, replace) => i18n.__mf({ phrase, locale: lang }, replace)
}

export function randomMessage (translate: translate, keys: { [key: `${number}`]: string }) {
    const key = Object.keys(keys)[Math.floor(Math.random() * Object.keys(keys).length)] as `${number}`
    return translate(keys[key])
}

export function getLocalesTranslations (phrase: string): LocalizationMap {
    const locales: LocalizationMap = {}
    for (const locale of Object.values(Locale)) {
        const transalte = Translator(locale)
        locales[locale] = transalte(phrase)
    }
    return locales
}

export { keys }
