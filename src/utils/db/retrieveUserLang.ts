import { Guild, GuildMember, User } from "discord.js";
import langFile from '../../lang/index.json' assert { type: 'json' };
import GuildModel from '../../models/guild.js';
import Usermodel from "../../models/user.js";
import logger from '../../utils/logger.js';

//TODO: Change this to use Cache instead of ready the file every time
export default async function retrieveUserLang(member: GuildMember | User | string | Guild): Promise<string> {
    if (member instanceof (GuildMember || User)) {
        //go to db and also get user by id
        return await Usermodel.findOne({ id: member.id }, async (err: any, user: { LANG: string; }) => {
            logger.debug(user)
            return user.LANG.toLocaleLowerCase()
        }) ?? await import('../lang/' + langFile.find(l => l.default)?.nombre)
    } else if (typeof member === "string") {
        //go to db and get user by id
        return await Usermodel.findOne({ id: member }, async (_err: any, user: { LANG: string; }) => {
            logger.debug(user)
            return user.LANG.toLocaleLowerCase()
        }) ?? await import('../lang/' + langFile.find(l => l.default)?.nombre)
    } else if (member instanceof Guild) {
        return await GuildModel.findOne({ id: member }, async (_err: any, guild: { LANG: string; }) => {
            logger.debug(guild)
            return guild.LANG.toLocaleLowerCase()
        }) ?? await import('../lang/' + langFile.find(l => l.default)?.nombre)
    } else return await import('../lang/' + langFile.find(l => l.default)?.nombre)
}