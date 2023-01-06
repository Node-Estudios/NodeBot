import { Guild as DiscordGuild, User as DiscordUser, GuildMember } from "discord.js";
import langFile from '../../lang/index.json' assert { type: 'json' };
import GuildModel, { Guild } from '../../models/guild.js';
import Usermodel, { User } from "../../models/user.js";
import logger from '../../utils/logger.js';

async function createUserInDB(input: User) {
    return await Usermodel.create(input)
}

//TODO: Change this to use Cache instead of ready the file every time
export default async function retrieveLang(input: GuildMember | DiscordUser | string | DiscordGuild): Promise<User["lang"]> {
    logger.debug('retrieveUserLang exeuted with input: ' + input)
    if (input instanceof (GuildMember || DiscordUser)) {
        return await Usermodel.findOne({ id: input.id }).then((user: any) => {
            return user ? user.lang : null
        }) ?? langFile.find(l => l.default)?.nombre
    } else if (typeof input === "string") {
        return await Usermodel.findOne({ id: input }).then(async (user: any) => {
            // console.log(await user)
            return user ? user.lang : null
        }) ?? langFile.find(l => l.default)?.nombre
    } else if (input instanceof DiscordGuild) {
        return await GuildModel.findOne({ id: input }).then((guild: any) => {
            return guild ? guild.lang : null
        }) ?? langFile.find(l => l.default)?.nombre
    } else return langFile.find(l => l.default)!.nombre
}

export async function getGuildFromDB(input: DiscordGuild | string): Promise<Guild | undefined | null> {
    logger.debug('getGuildFromDB exeuted with input: ' + input)
    switch (true) {
        case input instanceof DiscordGuild:
            return GuildModel.findOne({ id: (input as DiscordGuild).id }, async (error: any, guild: Guild) => {
                if (!guild) {
                    return new GuildModel({ id: (input as DiscordGuild).id, lang: langFile.find(l => l.default)?.nombre })
                } else {
                    return guild;
                }
            });
        case input instanceof String:
            return GuildModel.findOne({ id: (input as string) }, async (error: any, guild: Guild) => {
                if (error) {
                    return error;
                }
                if (!guild) {
                    return await GuildModel.create({ id: (input as string), lang: langFile.find(l => l.default)?.nombre })
                } else {
                    return guild;
                }
            });
        default:
            return undefined;
    }

}

export async function getUserFromDB(input: GuildMember | DiscordUser | string): Promise<User | null> {
    logger.debug('getUserFromDB exeuted with input: ' + input)
    switch (true) {
        case input instanceof GuildMember:
            return Usermodel.findOneAndUpdate({ id: (input as GuildMember).id }, async (error: any, user: User) => {
                if (user) {
                    return user;
                }
                const guild = await getGuildFromDB((input as GuildMember).guild.id);
                if (guild && !user) {
                    return createUserInDB({ id: (input as GuildMember).id, lang: guild.lang, executedCommands: 0, roles: { Developer: { enabled: false }, Tester: { enabled: false } } })
                }
                return error ? undefined : user;
            });
        case input instanceof String:
            return Usermodel.findOneAndUpdate({ id: (input as String) }, async (error: any, user: User) => {
                if (user) {
                    return user;
                }
                if (!user) {
                    return createUserInDB({ id: (input as GuildMember).id, lang: langFile.find(l => l.default)!.nombre, executedCommands: 0, roles: { Developer: { enabled: false }, Tester: { enabled: false } } })
                }
                return error ? undefined : user;
            });
        default:
            return null;
    }
}
