import { model, Schema } from 'mongoose'
export default model(
    'Guilds',
    new Schema(
        {
            id: { type: String, required: true },
            //LANG SHOULD BE A STRING, FOR EXAMPLE "ES" OR "EN"
            lang: { type: String },
            // Interacciones: Interacciones,
        },
        { collection: 'Guilds' },
    ),
)

export interface Guild {
    id: string,
    lang: string
}