import { User, GuildMember } from 'discord.js'
import { db } from 'src/prisma/db'

export async function getUserFromDB(input: GuildMember | User | string) {
    const id = typeof input === 'string' ? input : input.id
    const user = await db.user.findFirst({
        where: { id },
        include: { user_credentials: true },
    })
    if (user) return user
    return await db.user.create({
        data: { id },
        include: { user_credentials: true },
    })
}
