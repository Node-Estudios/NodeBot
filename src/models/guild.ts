import { model, Schema } from 'mongoose'
export default model(
    'Guilds',
    new Schema(
        {
            NAME: { type: String, required: true },
            ID: { type: String, required: true },
            //LANG SHOULD BE A STRING, FOR EXAMPLE "ES" OR "EN"
            LANG: { type: String },
            // Interacciones: Interacciones,
        },
        { collection: 'Guilds' },
    ),
)
