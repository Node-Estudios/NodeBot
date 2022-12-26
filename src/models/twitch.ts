import { Schema, model } from 'mongoose'

const User = new Schema({
    id: { type: String, required: true },
    message: { type: String, required: true },
})
const Embed = new Schema({
    color: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    footer: { type: String },
    timestamp: { type: String },
    titleURL: { type: String },
    thumbnail: { type: String },
    footericon: { type: String },
})

const Link = new Schema({
    message: { type: String, required: true },
})

const CustomMessageTypeGuild = new Schema({
    embed: { type: Embed },
    link: { type: Link },
})
const Guild = new Schema({
    id: { type: String, required: true },
    textChannel: { type: String, required: true },
    customMessage: { type: CustomMessageTypeGuild, required: true },
})
const Interacciones = new Schema({
    Guilds: { type: [Guild] },
    Users: { type: [User] },
})

export default model(
    'Twitch',
    new Schema(
        {
            id: { type: String, required: true },
            type: { type: String, required: true },
            display_name: { type: String, required: true },
            broadcaster_user_id: { type: String, required: true },
            created_at: { type: String },
            cost: { type: Number },
            login: { type: String, required: true },
            Interacciones: { type: Interacciones, required: true },
        },
        { collection: 'Twitch' },
    ),
)
