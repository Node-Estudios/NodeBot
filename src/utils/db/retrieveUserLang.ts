import { User as DiscordUser, GuildMember } from 'discord.js'
// Import BOTH User (Mongoose doc type) and IUserBase (plain data type)
import Usermodel, { User, IUserBase } from '#models/user.js' // <-- Import IUserBase

// Define NewUserData based on the plain data interface IUserBase
// Note: We don't need the Omit utility type anymore
type NewUserData = IUserBase

export async function getUserFromDB (input: GuildMember | DiscordUser | string): Promise<User | null> {
    let userId: string

    if (typeof input === 'string')
        userId = input
    else if (input instanceof GuildMember || input instanceof DiscordUser)
        userId = input.id
    else {
        console.error('getUserFromDB received invalid input type:', input)
        return null
    }

    // 'defaultUserData' now correctly expects a plain object matching IUserBase
    const defaultUserData: NewUserData = {
        id: userId,
        // We only need fields defined in IUserBase here
        // Mongoose applies schema defaults for lang/banned on insert if needed
        executedCommands: 0, // As required by IUserBase
        roles: { Developer: { enabled: false }, Tester: { enabled: false } },
        // credentials: undefined, // Explicitly undefined or omit if not creating credentials by default
    }

    try {
        // findOneAndUpdate still returns the Mongoose Document type 'User' or null
        const user = await Usermodel.findOneAndUpdate(
            { id: userId },
            { $setOnInsert: defaultUserData }, // Pass the plain object
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true, // Ensure trailing comma if needed by comma-dangle
            }, // Ensure trailing comma if needed by comma-dangle
        ) // Removed .lean() - function returns Promise<User | null>

        // Return type (User | null) now matches function signature correctly
        return user
    } catch (error) {
        console.error('Error interacting with database in getUserFromDB:', error)
        return null
    }
} // Ensure final newline if needed by eol-last
