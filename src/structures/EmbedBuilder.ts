import { APIEmbedField, EmbedBuilder as EmbedBuilderBase, RestOrArray, normalizeArray } from 'discord.js'

export default class EmbedBuilder extends EmbedBuilderBase {
    override setFields (...fields: RestOrArray<APIEmbedField>): this {
        fields = normalizeArray(fields)
        for (const field of fields) {
            if (field.name.length > 256)
                field.name = field.name.slice(0, 253) + '...'

            if (field.value.length > 1024)
                field.value = field.value.slice(0, 1020) + '...'
        }
        return super.setFields(fields)
    }

    override addFields (...fields: RestOrArray<APIEmbedField>): this {
        fields = normalizeArray(fields)
        for (const field of fields) {
            if (field.name.length > 256)
                field.name = field.name.slice(0, 253) + '...'

            if (field.value.length > 1024)
                field.value = field.value.slice(0, 1020) + '...'
        }
        return super.addFields(fields)
    }
}
