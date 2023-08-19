import { Schema, model } from 'mongoose';
export default model('customCmds', new Schema({
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true, default: 'No hay descripción' },
    response: { type: String, required: true },
}, {
    collection: 'customCmds',
}));
//# sourceMappingURL=customCmds.js.map