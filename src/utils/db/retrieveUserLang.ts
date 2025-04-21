import { User as DiscordUser, GuildMember } from 'discord.js'
import Usermodel, { User } from '#models/user.js'

async function createUserInDB (input: User) {
    return await Usermodel.create(input)
}

export async function getUserFromDB (
    input: GuildMember | DiscordUser | string,
): Promise<User | null> {
    // logger.debug('getUserFromDB exeuted with input: ' + input)
    switch (true) {
        case input instanceof GuildMember:
            return await Usermodel.findOneAndUpdate(
                { id: input.id },
                async (_: any, user: User) => {
                    if (user) return user
                    return await createUserInDB({
                        id: input.id,
                        executedCommands: 0,
                        roles: {
                            Developer: { enabled: false },
                            Tester: { enabled: false },
                        },
                    })
                },
            )
        case input instanceof String:
            return await Usermodel.findOneAndUpdate(
                { id: input as String },
                async (error: any, user: User) => {
                    if (user)
                        return user

                    if (!user)
                        return await createUserInDB({
                            id: (input as GuildMember).id,
                            executedCommands: 0,
                            roles: {
                                Developer: { enabled: false },
                                Tester: { enabled: false },
                            },
                        })

                    return error ? undefined : user
                },
            )
        default:
            return null
    }
}
