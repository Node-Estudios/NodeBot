import { Schema, model } from 'mongoose';
export default model('Twitch', new Schema({
    streamerId: { type: String, required: true },
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    roleId: { type: String, required: false },
}, { collection: 'Twitch' }));
//# sourceMappingURL=twitch.js.map