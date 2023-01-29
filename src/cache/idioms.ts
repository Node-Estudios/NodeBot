import { Collection } from 'discord.js'

export default new Collection<string, any>()

/**
import * as en_US from '../lang/en_US.json' assert { type: 'json' };
import * as es_ES from '../lang/es_ES.json' assert { type: 'json' };
import * as defaul from '../lang/index.json' assert { type: 'json' };

type JSONValue = string | number | boolean | JSONObject | JSONArray;
interface JSONObject { [key: string]: JSONValue; }
interface JSONArray extends Array<JSONValue> { }

class Language  {
    private languages: Record<string, JSONObject> = {
        en_US: en_US,
        es_ES: es_ES,
    };
    private currentLanguage!: string;
    private defaultLanguage?: string

    setLanguage(language: string) {
        this.currentLanguage = language;
    }

    getDefault() {
        return this.defaultLanguage
    }

    setDefaultLanguage() {
        const defaultLanguageData = defaul.find(({ default: isDefault }) => isDefault)
        if (defaultLanguageData) {
            this.defaultLanguage = defaultLanguageData.nombre
        }
    }

    getText(key: string, language?: string) {
        const selectedLanguage = language ? language : this.currentLanguage
        if (this.languages[selectedLanguage] && this.languages[selectedLanguage][key]) {
            return this.languages[selectedLanguage][key]
        }
        return 'Key not found'
    }
    getWhole(language?: string) {
        const selectedLanguage = language ? language : this.currentLanguage

        return this.languages[selectedLanguage]

    }
}

export default new Language();

 */