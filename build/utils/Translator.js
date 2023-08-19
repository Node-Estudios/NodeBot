import logger from './logger.js';
import keys from './locales.js';
import { join } from 'path';
import i18n from 'i18n';
i18n.configure({
    directory: join(process.cwd(), 'locales'),
    defaultLocale: 'en-US',
    retryInDefaultLocale: true,
    objectNotation: true,
    updateFiles: false,
    logWarnFn: (msg) => logger.warn(msg),
    logErrorFn: (msg) => logger.error(msg),
    missingKeyFn: (locale, value) => {
        logger.warn(`Missing key ${value} in locale ${locale}`);
        return value;
    },
});
export default function Translator(interaction) {
    const lang = typeof interaction === 'string' ? interaction : interaction.locale ?? interaction.preferredLocale ?? 'en';
    return (phrase, replace) => i18n.__mf({ phrase, locale: lang }, replace);
}
export function randomMessage(translate, keys) {
    const key = Object.keys(keys)[Math.floor(Math.random() * Object.keys(keys).length)];
    return translate(keys[key]);
}
export function getLocalesTranslations(phrase) {
    const locales = {};
    for (const locale of i18n.getLocales()) {
        const transalte = Translator(locale);
        locales[locale] = transalte(phrase);
    }
    return locales;
}
export { keys };
//# sourceMappingURL=Translator.js.map