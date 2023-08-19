import { PermissionsBitField, ApplicationCommandOptionType, } from 'discord.js';
import { getLocalesTranslations } from '../utils/Translator.js';
export default class Command {
    name;
    name_localizations;
    description = '...';
    description_localizations;
    description_localized;
    options;
    default_member_permissions = null;
    dm_permission;
    nsfw;
    only_dm;
    permissions;
    cooldown = 0;
    constructor(command) {
        const { description, name, default_member_permissions, dm_permission, nsfw, only_dm, options, permissions, cooldown, } = command;
        this.name = name;
        this.description = description;
        this.options = options;
        this.default_member_permissions = default_member_permissions ?? null;
        this.dm_permission = dm_permission;
        this.nsfw = nsfw;
        this.only_dm = only_dm;
        this.permissions = {
            dev: !!permissions?.dev,
            botPermissions: permissions?.botPermissions,
        };
        this.cooldown = cooldown ?? 0;
        this.name_localizations = this.getNameLocalizations();
        this.description_localizations = this.getDescriptionLocalizations();
        if (this.options)
            this.options = this.parseOptionsLocalizations(this.options);
    }
    async run(interaction) {
        return await interaction.reply({
            content: 'This command is not ready yet.',
            ephemeral: true,
        });
    }
    getNameLocalizations() {
        return getLocalesTranslations(`commands.${this.name}.name`);
    }
    getDescriptionLocalizations() {
        return getLocalesTranslations(`commands.${this.name}.description`);
    }
    parseOptionsLocalizations(options, deep = `commands.${this.name}.options`) {
        return options.map((option) => ({
            ...option,
            name_localizations: getLocalesTranslations(`${deep}.${option.name}.name`),
            description_localizations: getLocalesTranslations(`${deep}.${option.name}.description`),
            options: option.type === ApplicationCommandOptionType.Subcommand || option.type === ApplicationCommandOptionType.SubcommandGroup ? this.parseOptionsLocalizations(option.options ?? [], `${deep}.${option.name}.options`) : undefined,
        }));
    }
    toJSON() {
        return {
            name: this.name,
            name_localizations: this.name_localizations,
            description: this.description,
            nsfw: this.nsfw,
            description_localizations: this.description_localizations,
            options: this.options,
            default_member_permissions: this.default_member_permissions?.length
                ? new PermissionsBitField(this.default_member_permissions).bitfield.toString()
                : null,
            dm_permission: this.dm_permission,
        };
    }
}
//# sourceMappingURL=Command.js.map