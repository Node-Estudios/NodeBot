import { EmbedBuilder as EmbedBuilderBase, normalizeArray } from 'discord.js';
export default class EmbedBuilder extends EmbedBuilderBase {
    setFields(...fields) {
        fields = normalizeArray(fields);
        const parsedFields = [];
        for (const field of fields) {
            if (!field.value || !field.name)
                continue;
            if (field.name.length > 256)
                field.name = field.name.slice(0, 253) + '...';
            if (field.value.length > 1024)
                field.value = field.value.slice(0, 1020) + '...';
            parsedFields.push(field);
        }
        return super.setFields(parsedFields);
    }
    addFields(...fields) {
        fields = normalizeArray(fields);
        const parsedFields = [];
        for (const field of fields) {
            if (!field.value || !field.name)
                continue;
            if (field.name.length > 256)
                field.name = field.name.slice(0, 253) + '...';
            if (field.value.length > 1024)
                field.value = field.value.slice(0, 1020) + '...';
            parsedFields.push(field);
        }
        return super.setFields(parsedFields);
    }
    setDescription(description) {
        if (!description)
            return this;
        if (description && description.length > 4096)
            description = description.slice(0, 4092) + '...';
        return super.setDescription(description);
    }
    setTitle(title) {
        if (!title)
            return this;
        if (title.length > 256)
            title = title.slice(0, 253) + '...';
        return super.setTitle(title);
    }
}
//# sourceMappingURL=EmbedBuilder.js.map