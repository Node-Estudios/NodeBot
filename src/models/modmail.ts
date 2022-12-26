import { Schema, model } from 'mongoose'

export default model(
    'modMails',
    new Schema(
        {
            guildID: { type: String, required: true },
            userID: { type: String, required: true },
            channelID: { type: String, required: true },
            messages: { type: Array, required: true },
            webhookURL: { type: String, required: true },
        },
        {
            collection: 'modMails',
        },
    ),
)
