import { interactionCommandExtend } from '../events/client/interactionCreate.js'
import logger from '../utils/logger.js'

import {
    APIApplicationCommandOption,
    ApplicationCommand,
    ApplicationCommandType,
    LocalizationMap,
    PermissionsBitField,
    PermissionsString,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js'

export default class Command {
    /**
     * 1-32 character name; `CHAT_INPUT` command names must be all lowercase matching `^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$`
     */
    name: string
    /**
     * Localization dictionary for the name field. Values follow the same restrictions as name
     */
    name_localizations?: LocalizationMap | null
    /**
     * 1-100 character description for `CHAT_INPUT` commands, empty string for `USER` and `MESSAGE` commands
     */
    description = '...'
    /**
     * Localization dictionary for the description field. Values follow the same restrictions as description
     */
    description_localizations?: LocalizationMap | null
    /**
     * The localized description
     */
    description_localized?: string
    /**
     * The parameters for the `CHAT_INPUT` command, max 25
     */
    options?: APIApplicationCommandOption[]
    /**
     * Set of permissions represented as a bitset
     */
    default_member_permissions: PermissionsString[] | null = null
    /**
     * Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible
     */
    dm_permission?: boolean
    /**
     * Indicates whether the command is age-restricted, defaults to `false`
     */
    nsfw?: boolean

    // args: any
    // cooldown = false
    only_dm?: boolean
    permissions: { dev?: boolean; botPermissions?: PermissionsBitField }
    cooldown = 0

    constructor(
        command: RESTPostAPIChatInputApplicationCommandsJSONBody & {
            only_dm?: boolean
            default_member_permissions?: PermissionsString[] | null
            permissions?: { dev?: boolean; botPermissions?: PermissionsBitField }
            cooldown?: number
        },
    ) {
        const {
            description,
            name,
            default_member_permissions,
            description_localizations,
            dm_permission,
            name_localizations,
            nsfw,
            only_dm,
            options,
            permissions,
            cooldown,
        } = command

        this.name = name
        this.name_localizations = name_localizations
        this.description = description
        this.description_localizations = description_localizations
        this.options = options
        this.default_member_permissions = default_member_permissions ?? null
        this.dm_permission = dm_permission
        this.nsfw = nsfw
        //TODO: Add funcitonality in interactionCreate for only_dm && add more options
        this.only_dm = only_dm
        // this.args = options.args || false
        // this.cooldown = options.cooldown || false
        this.permissions = {
            dev: !!permissions?.dev,
            botPermissions: permissions?.botPermissions,
        }
        this.cooldown = cooldown ?? 0
    }

    run(interaction: interactionCommandExtend): Promise<any> {
        return interaction.reply({
            content: 'This command is not ready yet.',
            ephemeral: true,
        })
    }

    toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
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
        }
    }
}
