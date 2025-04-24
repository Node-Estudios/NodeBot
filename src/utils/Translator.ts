import { Guild, Interaction, LocaleString, LocalizationMap } from 'discord.js'
import logger from './logger.js'
import { join } from 'path'
import i18n from 'i18n'
import { Translator as T, localeKeys as k } from 'type-locales'
i18n.configure({
    directory: join(process.cwd(), 'locales'),
    defaultLocale: 'en-US',
    retryInDefaultLocale: true,
    objectNotation: true,
    updateFiles: false,
    // logDebugFn: (msg) => logger.debug(msg),
    logWarnFn: msg => logger.warn(msg),
    logErrorFn: msg => logger.error(msg),
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
 */
export default function Translator(
    interaction: Interaction | Guild | LocaleString,
) {
    const lang =
        typeof interaction === 'string'
            ? interaction
            : ((interaction as Interaction).locale ??
              (interaction as Guild).preferredLocale ??
              'en')

    return T(lang)
}

export function randomMessage<T extends ReturnType<typeof T>>(
    translate: T,
    keys: { [key: `${number}`]: Parameters<T>[0] },
) {
    const key = Object.keys(keys)[
        Math.floor(Math.random() * Object.keys(keys).length)
    ] as `${number}`
    return translate(keys[key])
}

export function getLocalesTranslations(phrase: string): LocalizationMap {
    const locales: LocalizationMap = {}
    for (const locale of i18n.getLocales() as LocaleString[]) {
        const transalte = Translator(locale)
        locales[locale] = transalte(phrase as Parameters<typeof transalte>[0])
    }
    return locales
}

export { k as keys }
