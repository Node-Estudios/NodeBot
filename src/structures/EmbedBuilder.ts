import { APIEmbedField, EmbedBuilder as EmbedBuilderBase, RestOrArray, normalizeArray } from 'discord.js'

export default class EmbedBuilder extends EmbedBuilderBase {
    override setFields (...fields: RestOrArray<APIEmbedField>): this {
        fields = normalizeArray(fields)
        const parsedFields: APIEmbedField[] = []
        for (const field of fields) {
            if (!field.value || !field.name) continue

            if (field.name.length > 256)
                field.name = field.name.slice(0, 253) + '...'

            if (field.value.length > 1024)
                field.value = field.value.slice(0, 1020) + '...'
            parsedFields.push(field)
        }
        return super.setFields(parsedFields)
    }

    override addFields (...fields: RestOrArray<APIEmbedField>): this {
        fields = normalizeArray(fields)
        const parsedFields: APIEmbedField[] = []
        for (const field of fields) {
            if (!field.value || !field.name) continue

            if (field.name.length > 256)
                field.name = field.name.slice(0, 253) + '...'

            if (field.value.length > 1024)
                field.value = field.value.slice(0, 1020) + '...'
            parsedFields.push(field)
        }
        return super.setFields(parsedFields)
    }

    override setDescription (description: string | null): this {
        if (!description) return this
        if (description && description.length > 4096)
            description = description.slice(0, 4092) + '...'
        return super.setDescription(description)
    }
}
