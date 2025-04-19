import { User as DiscordUser, GuildMember } from 'discord.js';
import Usermodel from '#models/user.js';
export async function getUserFromDB(input) {
    let userId;
    if (typeof input === 'string')
        userId = input;
    else if (input instanceof GuildMember || input instanceof DiscordUser)
        userId = input.id;
    else {
        console.error('getUserFromDB received invalid input type:', input);
        return null;
    }
    const defaultUserData = {
        id: userId,
        executedCommands: 0,
        roles: { Developer: { enabled: false }, Tester: { enabled: false } },
    };
    try {
        const user = await Usermodel.findOneAndUpdate({ id: userId }, { $setOnInsert: defaultUserData }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        });
        return user;
    }
    catch (error) {
        console.error('Error interacting with database in getUserFromDB:', error);
        return null;
    }
}
//# sourceMappingURL=retrieveUserLang.js.map