import { Schema, model } from 'mongoose'

export default model(
    'Twitch',
    new Schema<{
        streamerId: string
        guildId: string
        channelId: string
        roleId?: string
    }>(
        {
            streamerId: { type: String, required: true },
            guildId: { type: String, required: true },
            channelId: { type: String, required: true },
            roleId: { type: String, required: false },
        },
        { collection: 'Twitch' },
    ),
)
