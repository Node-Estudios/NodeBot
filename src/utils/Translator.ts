import { Guild, Interaction, LocaleString } from 'discord.js'
import logger from './logger.js'
import i18n from 'i18n'
import { join } from 'path'

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
export default function Translator(interaction: Interaction | Guild | LocaleString): translate {
    let lang = typeof interaction === 'string' ? interaction : (interaction as Interaction).locale ?? (interaction as Guild).preferredLocale ?? 'en'
    
    return (phrase, replace) => i18n.__mf({ phrase, locale: lang }, replace)
}