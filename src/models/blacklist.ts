import { Schema, model } from 'mongoose'

export default model(
    'BlackList',
    new Schema(
        {
            userID: { type: String, required: true },
        },
        {
            collection: 'BlackList',
        },
    ),
)
