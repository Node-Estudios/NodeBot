import { GuildMember } from 'discord.js';
import Usermodel from '#models/user.js';
async function createUserInDB(input) {
    return await Usermodel.create(input);
}
export async function getUserFromDB(input) {
    switch (true) {
        case input instanceof GuildMember:
            return await Usermodel.findOneAndUpdate({ id: input.id }, async (_, user) => {
                if (user)
                    return user;
                return await createUserInDB({
                    id: input.id,
                    executedCommands: 0,
                    roles: { Developer: { enabled: false }, Tester: { enabled: false } },
                });
            });
        case input instanceof String:
            return await Usermodel.findOneAndUpdate({ id: input }, async (error, user) => {
                if (user) {
                    return user;
                }
                if (!user) {
                    return await createUserInDB({
                        id: input.id,
                        executedCommands: 0,
                        roles: { Developer: { enabled: false }, Tester: { enabled: false } },
                    });
                }
                return error ? undefined : user;
            });
        default:
            return null;
    }
}
//# sourceMappingURL=retrieveUserLang.js.map