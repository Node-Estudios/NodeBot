import { Schema, model } from 'mongoose';
export default model('pvc', new Schema({
    guildID: { type: String, required: true },
    userID: { type: String, required: true },
    categoryID: { type: String, required: true },
    channelID: { type: String, required: true },
    temporary: { type: Boolean, required: true },
}, {
    collection: 'pvc',
}));
//# sourceMappingURL=pvc.js.map