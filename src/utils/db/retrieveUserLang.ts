import { Guild, GuildMember, User } from "discord.js";
import langFile from '../../lang/index.json' assert { type: 'json' };
import GuildModel from '../../models/guild.js';
import Usermodel from "../../models/user.js";
import logger from '../../utils/logger.js';

//TODO: Change this to use Cache instead of ready the file every time
export default async function retrieveUserLang(input: GuildMember | User | string | Guild): Promise<string> {
    logger.debug('retrieveUserLang exeuted with input: ' + input)
    if (input instanceof (GuildMember || User)) {
        return await Usermodel.findOne({ USERID: input.id }).then((user: any) => {
            return user.LANG
        }) ?? await import('../lang/' + langFile.find(l => l.default)?.nombre)
    } else if (typeof input === "string") {
        return await Usermodel.findOne({ USERID: input }).then((user: any) => {
            return user.LANG
        }) ?? await import('../lang/' + langFile.find(l => l.default)?.nombre)
    } else if (input instanceof Guild) {
        return await GuildModel.findOne({ ID: input }).then((guild: any) => {
            return guild.LANG
        }) ?? await import('../lang/' + langFile.find(l => l.default)?.nombre)
    } else return await import('../lang/' + langFile.find(l => l.default)?.nombre)
}